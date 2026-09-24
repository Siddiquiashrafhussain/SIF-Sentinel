class SafetyNet:
    def __init__(self):
        # Case insensitive exact substrings
        self.triggers = [
            "bypass",
            "bypass safety control",
            "muted alarm",
            "alarm was muted",
            "trapped pressure",
            "trapped pressure remained in the line",
            "h2s",
            "h2s alarm activated"
        ]
        
    def evaluate(self, text: str):
        text_lower = text.lower()
        
        triggered_rules = []
        for trigger in self.triggers:
            if trigger in text_lower:
                triggered_rules.append(trigger)
                
        if triggered_rules:
            return {
                "triggered": True,
                "rules": list(set(triggered_rules)),
                "minimumSifClass": "HIGH_SIF"
            }
            
        return {
            "triggered": False,
            "rules": [],
            "minimumSifClass": None
        }

    def apply_override(self, model_prediction: str, safety_net_result: dict) -> str:
        if not safety_net_result["triggered"]:
            return model_prediction
            
        severity_order = {
            "NON_SIF": 0,
            "SIF_POTENTIAL": 1,
            "HIGH_SIF": 2,
            "CRITICAL_SIF": 3
        }
        
        model_score = severity_order.get(model_prediction, 0)
        min_score = severity_order.get(safety_net_result["minimumSifClass"], 2)
        
        if min_score > model_score:
            return safety_net_result["minimumSifClass"]
            
        return model_prediction
