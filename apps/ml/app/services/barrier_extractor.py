import json
import os
import re

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'data')

class BarrierExtractor:
    def __init__(self):
        self.barriers = []
        self._load_barriers()
        
    def _load_barriers(self):
        barrier_file = os.path.join(DATA_DIR, 'barriers.json')
        if os.path.exists(barrier_file):
            with open(barrier_file, 'r') as f:
                self.barriers = json.load(f)
                
    def extract(self, text: str):
        """
        Stage 1: Keyword/Ontology matcher.
        Returns a list of extracted barriers based on matching terminology.
        """
        extracted = []
        text_lower = text.lower()
        
        for barrier in self.barriers:
            name = barrier.get('barrier_name', '').lower()
            if not name:
                continue
                
            if name in text_lower or (name == 'alarms' and 'alarm' in text_lower):
                # Basic context check for failure statuses
                status = "VERIFIED"
                if any(w in text_lower for w in ['fail', 'mute', 'defeat', 'miss', 'bypass', 'not verified']):
                    status = "FAILED" if 'fail' in text_lower else \
                             "DEFEATED" if any(w in text_lower for w in ['mute', 'defeat', 'bypass']) else \
                             "MISSING" if 'miss' in text_lower else \
                             "NOT_VERIFIED"
                
                extracted.append({
                    "code": barrier.get('barrier_code'),
                    "status": status,
                    "evidenceSpan": name  # Basic span, could be improved with regex
                })
                
        return extracted
