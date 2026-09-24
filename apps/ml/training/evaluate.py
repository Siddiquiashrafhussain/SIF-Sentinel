import json
import os
import joblib
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix, recall_score, precision_score, f1_score
from app.services.prediction_pipeline import PredictionPipeline

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
REPORTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'reports')

def load_data(filename):
    data = []
    with open(os.path.join(DATA_DIR, filename), 'r', encoding='utf-8') as f:
        for line in f:
            data.append(json.loads(line))
    return data

def main():
    print("Evaluating SIF Model and Safety Net...")
    pipeline = PredictionPipeline()
    
    test_data = load_data('test_handwritten.jsonl')
    
    y_true_sif = []
    y_pred_sif = []
    
    safety_net_coverage_count = 0
    safety_net_total = 0
    
    for item in test_data:
        text = item['text']
        true_sif = item['sif_class']
        
        y_true_sif.append(true_sif)
        
        # Predict using full pipeline
        pred = pipeline.predict(text)
        y_pred_sif.append(pred['sifClass'])
        
        # Test safety net on triggers
        # If it's a known trigger from the test set, ensure it's caught
        if true_sif in ['HIGH_SIF', 'CRITICAL_SIF'] and 'bypass' in text.lower():
            safety_net_total += 1
            if pred['safetyNet']['triggered']:
                safety_net_coverage_count += 1
                
    # 1. SIF Evaluation
    classes = ["NON_SIF", "SIF_POTENTIAL", "HIGH_SIF", "CRITICAL_SIF"]
    
    cm = confusion_matrix(y_true_sif, y_pred_sif, labels=classes)
    
    # Save Confusion Matrix plot
    plt.figure(figsize=(8,6))
    sns.heatmap(cm, annot=True, fmt='d', xticklabels=classes, yticklabels=classes, cmap='Blues')
    plt.title('SIF Classification Confusion Matrix')
    plt.ylabel('True Class')
    plt.xlabel('Predicted Class')
    plt.savefig(os.path.join(REPORTS_DIR, 'sif_confusion_matrix.png'))
    
    # Metrics
    # High/Critical Recall
    high_critical_true = [1 if y in ['HIGH_SIF', 'CRITICAL_SIF'] else 0 for y in y_true_sif]
    high_critical_pred = [1 if y in ['HIGH_SIF', 'CRITICAL_SIF'] else 0 for y in y_pred_sif]
    
    hc_recall = recall_score(high_critical_true, high_critical_pred)
    
    sif_report = {
        "HighCritical_Recall": float(hc_recall),
        "classification_report": classification_report(y_true_sif, y_pred_sif, output_dict=True)
    }
    
    with open(os.path.join(REPORTS_DIR, 'sif_evaluation.json'), 'w') as f:
        json.dump(sif_report, f, indent=2)
        
    print(f"High/Critical SIF Recall: {hc_recall:.2f} (Target: >= 0.90)")
    
    # 2. Safety Net Evaluation
    if safety_net_total > 0:
        coverage = safety_net_coverage_count / safety_net_total
    else:
        coverage = 1.0 # default to 100% if no triggers tested, but we have some.
        
    sn_report = {
        "test_list_coverage": float(coverage)
    }
    with open(os.path.join(REPORTS_DIR, 'safety_net_evaluation.json'), 'w') as f:
        json.dump(sn_report, f, indent=2)
        
    print(f"Safety Net Trigger Coverage: {coverage*100:.0f}%")
    print("Evaluation complete. Reports saved to apps/ml/reports.")

if __name__ == '__main__':
    main()
