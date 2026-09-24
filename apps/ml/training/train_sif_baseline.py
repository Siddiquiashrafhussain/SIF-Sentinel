import json
import os
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import recall_score, precision_score, f1_score, fbeta_score

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models', 'sif')
REPORTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'reports')

os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(REPORTS_DIR, exist_ok=True)

def load_data(filename):
    texts, labels = [], []
    with open(os.path.join(DATA_DIR, filename), 'r', encoding='utf-8') as f:
        for line in f:
            item = json.loads(line)
            texts.append(item['text'])
            labels.append(item['sif_class'])
    return texts, labels

def main():
    print("Training SIF Baseline Model (TF-IDF + LogisticRegression)...")
    
    # Load training data
    train_texts, train_labels = load_data('train.jsonl')
    
    # Encode labels
    label_encoder = LabelEncoder()
    label_encoder.fit(["NON_SIF", "SIF_POTENTIAL", "HIGH_SIF", "CRITICAL_SIF"])
    y_train = label_encoder.transform(train_labels)
    
    # Create pipeline
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=5000, ngram_range=(1, 2), stop_words='english')),
        ('clf', LogisticRegression(class_weight='balanced', max_iter=1000, random_state=42))
    ])
    
    # Train model
    pipeline.fit(train_texts, y_train)
    
    # Save model and artifacts
    joblib.dump(pipeline, os.path.join(MODELS_DIR, 'sif_baseline.joblib'))
    joblib.dump(label_encoder, os.path.join(MODELS_DIR, 'label_encoder.joblib'))
    
    metadata = {
        "version": "sif-sentinel-baseline-0.1.0",
        "type": "tfidf-logreg",
        "classes": label_encoder.classes_.tolist()
    }
    with open(os.path.join(MODELS_DIR, 'metadata.json'), 'w') as f:
        json.dump(metadata, f, indent=2)
        
    print("Model saved successfully.")

if __name__ == '__main__':
    main()
