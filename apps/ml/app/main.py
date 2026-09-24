from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="SIF-Sentinel ML Service")

class TextPayload(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"message": "SIF-Sentinel ML Service is running"}

@app.post("/analyze/sif")
def analyze_sif(payload: TextPayload):
    # Dummy implementation for SIF prediction
    # In reality, this would load a trained model and predict
    return {
        "is_sif_potential": True,
        "confidence": 0.85,
        "identified_factors": ["working at height", "lack of ppe"]
    }
