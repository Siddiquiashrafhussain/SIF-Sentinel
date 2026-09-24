import json
from pathlib import Path

DATA_DIR = Path(__file__).parent
REPORTS_PATH = DATA_DIR / 'reports.jsonl'
LSR_PATH = DATA_DIR / 'lsr.json'
BARRIERS_PATH = DATA_DIR / 'barriers.json'
SITES_PATH = DATA_DIR / 'sites.json'
ASSETS_PATH = DATA_DIR / 'assets.json'
ACTIVITIES_PATH = DATA_DIR / 'activities.json'

def load_json(path):
    with open(path, 'r') as f:
        return json.load(f)

def load_jsonl(path):
    data = []
    with open(path, 'r') as f:
        for line in f:
            if line.strip():
                data.append(json.loads(line))
    return data

def main():
    print("Validating synthetic data...")
    
    lsrs = {r['code'] for r in load_json(LSR_PATH)}
    barriers = {r['code'] for r in load_json(BARRIERS_PATH)}
    sites = {r['code'] for r in load_json(SITES_PATH)}
    assets = {r['code'] for r in load_json(ASSETS_PATH)}
    activities = {r['name'] for r in load_json(ACTIVITIES_PATH)}
    
    reports = load_jsonl(REPORTS_PATH)
    
    # Validation checks
    assert len(reports) >= 1500, f"Expected >= 1500 reports, got {len(reports)}"
    
    report_codes = set()
    sif_distribution = {"NON_SIF": 0, "SIF_POTENTIAL": 0, "HIGH_SIF": 0, "CRITICAL_SIF": 0}
    
    for r in reports:
        # reportCode exists and is unique
        assert 'reportCode' in r and r['reportCode']
        assert r['reportCode'] not in report_codes, f"Duplicate reportCode: {r['reportCode']}"
        report_codes.add(r['reportCode'])
        
        # text non-empty
        assert 'freeText' in r and r['freeText'].strip()
        
        # valid fields
        assert r['type'] in ["NEAR_MISS", "UNSAFE_ACT", "UNSAFE_CONDITION", "INCIDENT"]
        assert r['shift'] in ["DAY", "NIGHT"]
        assert r['occurredAt'].endswith("Z")
        assert r['siteCode'] in sites, f"Invalid siteCode: {r['siteCode']}"
        assert r['assetCode'] in assets, f"Invalid assetCode: {r['assetCode']}"
        assert r['activityName'] in activities, f"Invalid activityName: {r['activityName']}"
        
        # ground truth
        gt = r['groundTruth']
        assert gt['sifClass'] in sif_distribution
        sif_distribution[gt['sifClass']] += 1
        
        for lsr in gt['lifeSavingRules']:
            assert lsr in lsrs, f"Invalid LSR: {lsr}"
            
        for b in gt['barrierGaps']:
            assert b in barriers, f"Invalid Barrier: {b}"
            
    print(f"Validated {len(reports)} reports successfully.")
    print("SIF Distribution:")
    for k, v in sif_distribution.items():
        pct = (v / len(reports)) * 100
        print(f"  {k}: {v} ({pct:.1f}%)")
        
    sif_related = sif_distribution["SIF_POTENTIAL"] + sif_distribution["HIGH_SIF"] + sif_distribution["CRITICAL_SIF"]
    sif_related_pct = (sif_related / len(reports)) * 100
    print(f"Total SIF-related: {sif_related} ({sif_related_pct:.1f}%)")
    
if __name__ == "__main__":
    main()
