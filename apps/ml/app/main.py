from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import PredictRequest, PredictResponse, ClusterRequest
from app.services.prediction_pipeline import PredictionPipeline

app = FastAPI(title="SIF-Sentinel ML API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lazy loading of model
pipeline = None

@app.on_event("startup")
async def startup_event():
    global pipeline
    # Load pipeline on startup
    pipeline = PredictionPipeline()

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "sif-sentinel-ml",
        "models_loaded": pipeline is not None
    }

@app.get("/model-info")
async def model_info():
    return {
        "modelVersion": "sif-sentinel-0.1.0",
        "sifModel": "tfidf-logreg",
        "lsrModel": "sentence-transformer-ovr",
        "taxonomyVersion": "v1",
        "safetyNetVersion": "v1"
    }

@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    if not pipeline:
        raise HTTPException(status_code=503, detail="Models not loaded")
        
    try:
        result = pipeline.predict(request.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/cluster", status_code=status.HTTP_202_ACCEPTED)
async def cluster(request: ClusterRequest):
    # In a real app, this dispatches a celery/redis job.
    return {
        "status": "accepted",
        "message": "Pattern recomputation job queued."
    }
