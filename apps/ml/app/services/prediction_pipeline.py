import os
import joblib
import numpy as np
from app.services.safety_net import SafetyNet
from app.services.barrier_extractor import BarrierExtractor

MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'models')

class PredictionPipeline:
    def __init__(self):
        self.safety_net = SafetyNet()
        self.barrier_extractor = BarrierExtractor()
        
        # Load SIF model
        sif_dir = os.path.join(MODELS_DIR, 'sif')
        self.sif_model = None
        self.sif_encoder = None
        if os.path.exists(os.path.join(sif_dir, 'sif_baseline.joblib')):
            self.sif_model = joblib.load(os.path.join(sif_dir, 'sif_baseline.joblib'))
            self.sif_encoder = joblib.load(os.path.join(sif_dir, 'label_encoder.joblib'))
            
        # Load LSR model
        lsr_dir = os.path.join(MODELS_DIR, 'lsr')
        self.lsr_model = None
        self.lsr_mlb = None
        if os.path.exists(os.path.join(lsr_dir, 'lsr_classifier.joblib')):
            self.lsr_model = joblib.load(os.path.join(lsr_dir, 'lsr_classifier.joblib'))
            self.lsr_mlb = joblib.load(os.path.join(lsr_dir, 'mlb.joblib'))
            
            # Defer loading heavy SentenceTransformer to avoid circular/slow loads if not predicting
            self.sentence_transformer = None
            
    def _get_st_model(self):
        if self.sentence_transformer is None:
            from sentence_transformers import SentenceTransformer
            self.sentence_transformer = SentenceTransformer('all-MiniLM-L6-v2')
        return self.sentence_transformer

    def predict(self, text: str):
        # 1. Safety Net
        safety_net_result = self.safety_net.evaluate(text)
        
        # 2. SIF Classification
        sif_class = "NON_SIF"
        confidence = 0.0
        top_drivers = []
        
        if self.sif_model:
            probas = self.sif_model.predict_proba([text])[0]
            pred_idx = np.argmax(probas)
            sif_class = self.sif_encoder.inverse_transform([pred_idx])[0]
            confidence = float(probas[pred_idx])
            
            # Explainability (Top weighted TF-IDF terms)
            classifier = self.sif_model.named_steps['clf']
            vectorizer = self.sif_model.named_steps['tfidf']
            feature_names = vectorizer.get_feature_names_out()
            
            # Get the weights for the predicted class
            class_weights = classifier.coef_[pred_idx]
            top_indices = np.argsort(class_weights)[-3:][::-1] # Top 3
            
            # Only include if they appear in text
            text_lower = text.lower()
            for idx in top_indices:
                feat = feature_names[idx]
                if feat in text_lower:
                    top_drivers.append({"feature": feat, "weight": float(class_weights[idx])})
        
        # Override if necessary
        final_sif_class = self.safety_net.apply_override(sif_class, safety_net_result)
        
        # 3. LSR Classification
        lsr_results = []
        if self.lsr_model:
            st_model = self._get_st_model()
            emb = st_model.encode([text])
            
            # Predict probabilities
            lsr_probas = self.lsr_model.predict_proba(emb)[0]
            
            # Dynamic Thresholding based on classes
            for idx, prob in enumerate(lsr_probas):
                if prob > 0.3: # Threshold 
                    lsr_results.append({
                        "code": self.lsr_mlb.classes_[idx],
                        "confidence": float(prob)
                    })
                    
        # 4. Barrier Extraction
        barriers = self.barrier_extractor.extract(text)
        
        return {
            "sifClass": final_sif_class,
            "confidence": confidence,
            "lsrs": lsr_results,
            "barriers": barriers,
            "topDrivers": top_drivers,
            "safetyNet": safety_net_result,
            "modelVersion": "sif-sentinel-0.1.0"
        }
