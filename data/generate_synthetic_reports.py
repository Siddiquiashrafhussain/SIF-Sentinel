import json
import random
import uuid
import datetime
from pathlib import Path
import argparse

random.seed(42)

def load_json(filepath):
    with open(filepath, 'r') as f:
        return json.load(f)

# Paths
DATA_DIR = Path(__file__).parent
LSR_PATH = DATA_DIR / 'lsr.json'
SITES_PATH = DATA_DIR / 'sites.json'
ASSETS_PATH = DATA_DIR / 'assets.json'
ACTIVITIES_PATH = DATA_DIR / 'activities.json'
BARRIERS_PATH = DATA_DIR / 'barriers.json'
OUTPUT_PATH = DATA_DIR / 'reports.jsonl'

# Data
try:
    lsr_data = load_json(LSR_PATH)
    sites_data = load_json(SITES_PATH)
    assets_data = load_json(ASSETS_PATH)
    activities_data = load_json(ACTIVITIES_PATH)
    barriers_data = load_json(BARRIERS_PATH)
except Exception as e:
    print(f"Error loading reference JSONs: {e}")
    exit(1)

assets_by_site = {}
for asset in assets_data:
    assets_by_site.setdefault(asset['siteCode'], []).append(asset)

# SCENARIO TEMPLATES
SCENARIOS = [
    {
        "id": "ENERGY_ISOLATION_001",
        "activity": "Line Breaking",
        "type": ["NEAR_MISS", "INCIDENT"],
        "sifClass": "HIGH_SIF",
        "lsr": ["LSR-04"],
        "barriers": ["BAR-ENG-014", "BAR-ADM-018"],
        "hazards": ["stored pressure", "hazardous fluid"],
        "templates": [
            "Bleed valve was opened while the gauge still indicated 450 PSI.",
            "Operator opened the bleed valve before pressure reached zero; gauge reading was approximately 450 psi.",
            "During line breaking, pressure was still showing on the gauge when the bleed valve was opened.",
            "LOTO was not verified, and the line was opened with residual pressure."
        ],
        "evidence_phrases": [
            "gauge still indicated 450 PSI",
            "opened the bleed valve before pressure reached zero",
            "pressure was still showing on the gauge",
            "LOTO was not verified"
        ],
        "weight": 10
    },
    {
        "id": "LIFTING_001",
        "activity": "Heavy Lifting",
        "type": ["NEAR_MISS", "UNSAFE_CONDITION"],
        "sifClass": "SIF_POTENTIAL",
        "lsr": ["LSR-07", "LSR-06"],
        "barriers": ["BAR-ENG-010", "BAR-ADM-024"],
        "hazards": ["suspended load", "dropped object"],
        "templates": [
            "During night shift lifting preparation, the operator noticed visible fraying on the webbing sling before the crane lift started.",
            "At approximately 23:10 during night-shift pipe handling, the crew identified visible fraying near the eye of the webbing sling during the pre-use inspection.",
            "Frayed webbing sling observed on crane during pre-lift check.",
            "A damaged lifting sling was found attached to the load, work was stopped."
        ],
        "evidence_phrases": [
            "visible fraying on the webbing sling",
            "visible fraying near the eye of the webbing sling",
            "Frayed webbing sling",
            "damaged lifting sling"
        ],
        "weight": 15
    },
    {
        "id": "CONFINED_SPACE_001",
        "activity": "Confined Tank",
        "type": ["UNSAFE_ACT", "NEAR_MISS"],
        "sifClass": "CRITICAL_SIF",
        "lsr": ["LSR-02", "LSR-01"],
        "barriers": ["BAR-ENG-004", "BAR-ADM-022", "BAR-BEH-038"],
        "hazards": ["toxic gas", "H2S", "asphyxiation"],
        "templates": [
            "H2S alarm was muted during the purge operation while personnel were near the tank manway.",
            "Gas detector alarm was bypassed by the operator to prevent nuisance tripping during purging.",
            "Confined space entry proceeded while the local H2S monitor was turned off.",
            "Hole watch noticed the gas detector was in calibration mode and not actively monitoring during entry."
        ],
        "evidence_phrases": [
            "H2S alarm was muted",
            "alarm was bypassed",
            "monitor was turned off",
            "not actively monitoring"
        ],
        "weight": 5
    },
    {
        "id": "DRIVING_001",
        "activity": "Vehicle Movement",
        "type": ["UNSAFE_ACT"],
        "sifClass": "SIF_POTENTIAL",
        "lsr": ["LSR-03"],
        "barriers": ["BAR-BEH-045", "BAR-BEH-046"],
        "hazards": ["vehicle collision"],
        "templates": [
            "Driver observed exceeding the speed limit by 20km/h on site access road without wearing a seatbelt.",
            "Truck was reversed without a spotter, nearly striking a pedestrian.",
            "Vehicle was parked on an incline without wheel chocks applied or parking brake engaged.",
            "Forklift operator seen driving with an obstructed view."
        ],
        "evidence_phrases": [
            "without wearing a seatbelt",
            "reversed without a spotter",
            "without wheel chocks applied",
            "obstructed view"
        ],
        "weight": 10
    },
    {
        "id": "HEIGHT_001",
        "activity": "Work at Height",
        "type": ["UNSAFE_ACT", "NEAR_MISS"],
        "sifClass": "HIGH_SIF",
        "lsr": ["LSR-09"],
        "barriers": ["BAR-ENG-011", "BAR-BEH-041"],
        "hazards": ["fall from height"],
        "templates": [
            "Contractor found working on the derrick at 15m height without being tied off.",
            "Harness was worn but the lanyard was not attached to a certified anchor point.",
            "Scaffolding was missing a mid-rail and toe board near the edge.",
            "Worker stepped outside the handrail protection without fall arrest equipment."
        ],
        "evidence_phrases": [
            "without being tied off",
            "not attached to a certified anchor point",
            "missing a mid-rail",
            "without fall arrest equipment"
        ],
        "weight": 10
    },
    {
        "id": "NON_SIF_HOUSEKEEPING",
        "activity": "General Maintenance",
        "type": ["UNSAFE_CONDITION"],
        "sifClass": "NON_SIF",
        "lsr": [],
        "barriers": ["BAR-BEH-044"],
        "hazards": ["trip hazard", "slip hazard"],
        "templates": [
            "Small oil spill noticed near the generator, cleanup requested.",
            "Tools were left on the walkway creating a tripping hazard.",
            "Trash bin was overflowing near the workshop entrance.",
            "Extension cord was routed across the corridor without a cable ramp."
        ],
        "evidence_phrases": [],
        "weight": 50
    },
    {
        "id": "NON_SIF_HARD_NEGATIVE",
        "activity": "Wellhead Intervention",
        "type": ["UNSAFE_CONDITION"],
        "sifClass": "NON_SIF",
        "lsr": [],
        "barriers": [],
        "hazards": ["none"],
        "templates": [
            "LOTO procedure reviewed during toolbox talk; all isolation points were verified before work started. Observation is positive.",
            "Pre-use inspection completed and sling was found serviceable. No defects noted.",
            "Permit to work was correctly filled out and all signatures were present for the confined space entry.",
            "Gas testing showed 0% LEL and 0 ppm H2S. Work proceeded normally."
        ],
        "evidence_phrases": [],
        "weight": 25
    }
]

def generate_date(start_date: datetime.date, end_date: datetime.date):
    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days
    random_number_of_days = random.randrange(days_between_dates)
    random_date = start_date + datetime.timedelta(days=random_number_of_days)
    random_hour = random.randrange(24)
    random_minute = random.randrange(60)
    return datetime.datetime(random_date.year, random_date.month, random_date.day, random_hour, random_minute)

def generate_reports(count):
    reports = []
    
    start_date = datetime.date(2025, 1, 1)
    end_date = datetime.date(2025, 12, 31)

    scenario_population = []
    weights = []
    for s in SCENARIOS:
        scenario_population.append(s)
        weights.append(s["weight"])
        
    for i in range(count):
        scenario = random.choices(scenario_population, weights=weights, k=1)[0]
        
        site = random.choice(sites_data)
        asset = random.choice(assets_by_site.get(site['code'], assets_data))
        
        # Determine activity: use scenario activity or fallback to a random one if not strict
        activity_name = scenario["activity"]
        
        shift = random.choice(["DAY", "NIGHT"])
        # Give a slight bump to night shift for lifting if LIFTING_001
        if scenario["id"] == "LIFTING_001" and random.random() < 0.3:
            shift = "NIGHT"
            
        report_type = random.choice(scenario["type"]) if scenario["type"] else random.choice(["NEAR_MISS", "UNSAFE_ACT", "UNSAFE_CONDITION", "INCIDENT"])
        source = random.choice(["FIELD_OBSERVATION", "NEAR_MISS_REPORT", "INCIDENT_REPORT", "SUPERVISOR_REPORT", "SAFETY_OBSERVATION"])
        
        occurred_at = generate_date(start_date, end_date)
        # Fix time if shift is specific
        if shift == "DAY":
            occurred_at = occurred_at.replace(hour=random.randint(6, 17))
        else:
            h = random.choice([18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5])
            occurred_at = occurred_at.replace(hour=h)

        text_template = random.choice(scenario["templates"])
        
        # Evidence spans logic
        spans = []
        for phrase in scenario["evidence_phrases"]:
            if phrase in text_template:
                spans.append(phrase)

        # Ground truth object
        groundTruth = {
            "sifClass": scenario["sifClass"],
            "lifeSavingRules": scenario["lsr"],
            "barrierGaps": scenario["barriers"],
            "hazards": scenario["hazards"],
            "evidenceSpans": spans,
            "scenarioId": scenario["id"]
        }

        report_code = f"OIL-DEMO-{str(i+1).zfill(6)}"
        
        reports.append({
            "reportCode": report_code,
            "type": report_type,
            "shift": shift,
            "occurredAt": occurred_at.isoformat() + "Z",
            "freeText": text_template,
            "source": source,
            "siteCode": site["code"],
            "assetCode": asset["code"],
            "activityName": activity_name,
            "groundTruth": groundTruth
        })
        
    return reports

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Generate synthetic safety reports.')
    parser.add_argument('--count', type=int, default=1600, help='Number of reports to generate')
    parser.add_argument('--seed', type=int, default=42, help='Random seed')
    
    args = parser.parse_args()
    
    random.seed(args.seed)
    
    generated = generate_reports(args.count)
    
    with open(OUTPUT_PATH, 'w') as f:
        for r in generated:
            f.write(json.dumps(r) + '\n')
            
    print(f"Generated {len(generated)} synthetic reports to {OUTPUT_PATH}")
