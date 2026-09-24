import pytest
from app.main import app
from fastapi.testclient import TestClient
import json

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

# Safety Net non-regression matrix
# These phrases MUST always trigger HIGH_SIF or CRITICAL_SIF
SAFETY_NET_CASES = [
    ("The operator bypassed the safety interlock.", ["HIGH_SIF", "CRITICAL_SIF"], "bypass"),
    ("H2S alarm was muted during purge.", ["HIGH_SIF", "CRITICAL_SIF"], "muted alarm"),
    ("Residual trapped pressure remained in the line.", ["HIGH_SIF", "CRITICAL_SIF"], "trapped pressure"),
    ("High concentration of h2s detected in the pit.", ["HIGH_SIF", "CRITICAL_SIF"], "H2S"),
    ("Alarm was MUTED", ["HIGH_SIF", "CRITICAL_SIF"], "muted"),
    ("Safety control was bypassed", ["HIGH_SIF", "CRITICAL_SIF"], "bypassed"),
    ("trapped PRESSURE", ["HIGH_SIF", "CRITICAL_SIF"], "trapped pressure")
]

@pytest.mark.parametrize("text,allowed_classes,trigger", SAFETY_NET_CASES)
def test_safety_net_regression(client, text, allowed_classes, trigger):
    response = client.post("/predict", json={"text": text, "metadata": {}})
    assert response.status_code == 200
    
    data = response.json()
    assert "sifClass" in data
    
    # Assert minimum SIF severity
    actual_sif = data["sifClass"]
    assert actual_sif in allowed_classes, f"Safety net failed for '{trigger}'. Expected one of {allowed_classes}, got {actual_sif}"

def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "sif-sentinel-ml", "models_loaded": True}
