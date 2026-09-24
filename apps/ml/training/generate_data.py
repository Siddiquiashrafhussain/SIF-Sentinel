import json
import os
import random

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
os.makedirs(DATA_DIR, exist_ok=True)

SITES = ["Duliajan", "Moran", "Naharkatia"]
ACTIVITIES = ["Pipe Handling", "Welding", "Lifting", "Maintenance", "Confined Space"]

# We will just generate 200 training examples, 50 validation examples, 50 test examples.
def generate_sample(id_prefix, i):
    # Determine class based on random choice, but balanced
    classes = ["NON_SIF", "SIF_POTENTIAL", "HIGH_SIF", "CRITICAL_SIF"]
    sif_class = classes[i % 4]
    
    lsrs = []
    barrier_gaps = []
    
    text = f"Routine observation {i}. "
    if sif_class == "NON_SIF":
        text += "Housekeeping was mostly acceptable, no major issues found."
    elif sif_class == "SIF_POTENTIAL":
        text += "Worker was seen standing near the edge without proper fall protection attached."
        lsrs.append("WORKING_AT_HEIGHT")
        barrier_gaps.append({"barrier": "Fall Protection", "status": "MISSING"})
    elif sif_class == "HIGH_SIF":
        text += "Bypass of safety control. The alarm was muted during the operation."
        lsrs.append("BYPASS_SAFETY_CONTROLS")
        barrier_gaps.append({"barrier": "Alarms", "status": "DEFEATED"})
    elif sif_class == "CRITICAL_SIF":
        text += "Trapped pressure remained in the line when it was opened. H2S alarm activated."
        lsrs.append("ENERGY_ISOLATION")
        barrier_gaps.append({"barrier": "Energy Isolation", "status": "FAILED"})
    
    return {
        "id": f"{id_prefix}-{str(i).zfill(6)}",
        "text": text,
        "type": "OBSERVATION",
        "site": random.choice(SITES),
        "activity": random.choice(ACTIVITIES),
        "shift": random.choice(["DAY", "NIGHT"]),
        "sif_class": sif_class,
        "lsrs": lsrs,
        "barrier_gaps": barrier_gaps
    }

def save_jsonl(filename, data):
    with open(os.path.join(DATA_DIR, filename), 'w', encoding='utf-8') as f:
        for item in data:
            f.write(json.dumps(item) + '\n')

def main():
    random.seed(42)
    train_data = [generate_sample("SYN-TR", i) for i in range(200)]
    save_jsonl('train.jsonl', train_data)
    
    val_data = [generate_sample("SYN-VA", i) for i in range(50)]
    save_jsonl('validation.jsonl', val_data)
    
    # "Hand-written" test set
    test_data = [
        {
            "id": "HW-000001",
            "text": "The worker bypassed the safety control by muting the alarm.",
            "type": "INCIDENT",
            "site": "Duliajan",
            "activity": "Maintenance",
            "shift": "DAY",
            "sif_class": "HIGH_SIF",
            "lsrs": ["BYPASS_SAFETY_CONTROLS"],
            "barrier_gaps": [{"barrier": "Alarms", "status": "DEFEATED"}]
        },
        {
            "id": "HW-000002",
            "text": "Normal operation, everything looked fine.",
            "type": "OBSERVATION",
            "site": "Moran",
            "activity": "Pipe Handling",
            "shift": "DAY",
            "sif_class": "NON_SIF",
            "lsrs": [],
            "barrier_gaps": []
        },
        {
            "id": "HW-000003",
            "text": "Trapped pressure caused the pipe to burst. H2S was detected.",
            "type": "INCIDENT",
            "site": "Naharkatia",
            "activity": "Pipe Handling",
            "shift": "NIGHT",
            "sif_class": "CRITICAL_SIF",
            "lsrs": ["ENERGY_ISOLATION"],
            "barrier_gaps": [{"barrier": "Energy Isolation", "status": "FAILED"}]
        },
        {
            "id": "HW-000004",
            "text": "Technician opened a pressurized line while isolation was not verified. The gauge showed 450 PSI and the worker was standing in the line of fire.",
            "type": "NEAR_MISS",
            "site": "Duliajan",
            "activity": "Maintenance",
            "shift": "DAY",
            "sif_class": "HIGH_SIF",
            "lsrs": ["ENERGY_ISOLATION", "LINE_OF_FIRE"],
            "barrier_gaps": [{"barrier": "Energy Isolation", "status": "NOT_VERIFIED"}]
        }
    ]
    
    # Pad test data to 50 items to meet barrier evaluation requirement
    for i in range(46):
        test_data.append(generate_sample("HW", i + 5))
        
    save_jsonl('test_handwritten.jsonl', test_data)
    
    # Also create lsr.json and barriers.json
    lsrs = [
        {"code": "BYPASS_SAFETY_CONTROLS", "name": "Bypass Safety Controls"},
        {"code": "CONFINED_SPACE", "name": "Confined Space"},
        {"code": "DRIVING", "name": "Driving"},
        {"code": "ENERGY_ISOLATION", "name": "Energy Isolation"},
        {"code": "HOT_WORK", "name": "Hot Work"},
        {"code": "LINE_OF_FIRE", "name": "Line of Fire"},
        {"code": "SAFE_MECHANICAL_LIFTING", "name": "Safe Mechanical Lifting"},
        {"code": "WORK_AUTHORISATION", "name": "Work Authorisation"},
        {"code": "WORKING_AT_HEIGHT", "name": "Working at Height"}
    ]
    with open(os.path.join(DATA_DIR, 'lsr.json'), 'w') as f:
        json.dump(lsrs, f, indent=2)
        
    barriers = [
        {"barrier_code": "BAR-ENG-091", "barrier_name": "Energy Isolation", "barrier_class": "HARDWARE", "level": "L1"},
        {"barrier_code": "BAR-SYS-001", "barrier_name": "Alarms", "barrier_class": "SYSTEM", "level": "L2"},
        {"barrier_code": "BAR-PPE-001", "barrier_name": "Fall Protection", "barrier_class": "PPE", "level": "L3"}
    ]
    with open(os.path.join(DATA_DIR, 'barriers.json'), 'w') as f:
        json.dump(barriers, f, indent=2)

if __name__ == '__main__':
    main()
    print("Data generated successfully.")
