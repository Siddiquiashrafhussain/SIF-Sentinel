from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class Metadata(BaseModel):
    site: Optional[str] = None
    asset: Optional[str] = None
    activity: Optional[str] = None
    shift: Optional[str] = None

class PredictRequest(BaseModel):
    text: str = Field(..., min_length=1)
    metadata: Optional[Metadata] = None

class LSRResult(BaseModel):
    code: str
    confidence: float

class BarrierResult(BaseModel):
    code: str
    status: str
    evidenceSpan: str

class DriverResult(BaseModel):
    feature: str
    weight: float

class SafetyNetResult(BaseModel):
    triggered: bool
    rules: List[str]
    minimumSifClass: Optional[str] = None

class PredictResponse(BaseModel):
    sifClass: str
    confidence: float
    lsrs: List[LSRResult]
    barriers: List[BarrierResult]
    topDrivers: List[DriverResult]
    safetyNet: SafetyNetResult
    modelVersion: str

class ClusterRequest(BaseModel):
    recompute: bool = True
