import json
import os
import joblib
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.multiclass import OneVsRestClassifier
from sentence_transformers import SentenceTransformer
from sklearn.preprocessing import MultiLabelBinarizer

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models', 'lsr')
os.makedirs(MODELS_DIR, exist_ok=True)

def load_data(filename):
    texts, all_lsrs = [], []
    with open(os.path.join(DATA_DIR, filename), 'r', encoding='utf-8') as f:
        for line in f:
            item = json.loads(line)
            texts.append(item['text'])
            all_lsrs.append(item['lsrs'])
    return texts, all_lsrs

def main():
    print("Training LSR Multi-label Model...")
    
    train_texts, train_lsrs = load_data('train.jsonl')
    
    mlb = MultiLabelBinarizer()
    y_train = mlb.fit_transform(train_lsrs)
    
    # Use a small, fast model for embeddings
    print("Loading Sentence Transformer...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    print("Generating embeddings for training...")
    X_train = model.encode(train_texts, show_progress_bar=True)
    
    print("Training OneVsRest Classifier...")
    clf = OneVsRestClassifier(LogisticRegression(class_weight='balanced', max_iter=1000, random_state=42))
    clf.fit(X_train, y_train)
    
    # Save artifacts
    joblib.dump(clf, os.path.join(MODELS_DIR, 'lsr_classifier.joblib'))
    joblib.dump(mlb, os.path.join(MODELS_DIR, 'mlb.joblib'))
    
    metadata = {
        "version": "lsr-sentinel-0.1.0",
        "type": "sentence-transformer-ovr",
        "embedding_model": "all-MiniLM-L6-v2",
        "classes": list(mlb.classes_)
    }
    with open(os.path.join(MODELS_DIR, 'metadata.json'), 'w') as f:
        json.dump(metadata, f, indent=2)
        
    print("LSR Model saved successfully.")

if __name__ == '__main__':
    main()
