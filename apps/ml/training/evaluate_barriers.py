import json
import os
from app.services.barrier_extractor import BarrierExtractor

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
REPORTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'reports')

def load_data(filename):
    data = []
    with open(os.path.join(DATA_DIR, filename), 'r', encoding='utf-8') as f:
        for line in f:
            data.append(json.loads(line))
    return data

def main():
    print("Evaluating Barrier Extraction...")
    test_data = load_data('test_handwritten.jsonl')
    
    extractor = BarrierExtractor()
    
    true_positives = 0
    false_positives = 0
    
    # Simple evaluation on the first 4 samples which have known barrier targets
    for item in test_data:
        text = item['text']
        true_gaps = [bg['barrier'] for bg in item['barrier_gaps']]
        
        extracted = extractor.extract(text)
        extracted_names = [e['evidenceSpan'] for e in extracted] # Using evidenceSpan which stores matched name
        
        for name in extracted_names:
            if any(name.lower() in tg.lower() or tg.lower() in name.lower() for tg in true_gaps):
                true_positives += 1
            else:
                false_positives += 1
                
    precision = true_positives / (true_positives + false_positives) if (true_positives + false_positives) > 0 else 0
    
    report = {
        "true_positives": true_positives,
        "false_positives": false_positives,
        "precision": float(precision)
    }
    
    with open(os.path.join(REPORTS_DIR, 'barrier_evaluation.json'), 'w') as f:
        json.dump(report, f, indent=2)
        
    print(f"Barrier Extraction Precision: {precision:.2f}")
    print("Barrier evaluation complete.")

if __name__ == '__main__':
    main()
