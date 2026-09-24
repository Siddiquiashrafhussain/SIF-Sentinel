import pytest
from app.services.safety_net import SafetyNet
from app.services.barrier_extractor import BarrierExtractor
from app.schemas import PredictRequest, PredictResponse

def test_safety_net_bypass():
    sn = SafetyNet()
    res = sn.evaluate("The operator decided to bypass safety control during maintenance.")
    assert res["triggered"] is True
    assert "bypass safety control" in res["rules"]
    assert res["minimumSifClass"] == "HIGH_SIF"

def test_safety_net_h2s():
    sn = SafetyNet()
    res = sn.evaluate("h2s alarm activated after trapped pressure release.")
    assert res["triggered"] is True
    assert "h2s alarm activated" in res["rules"]
    assert "trapped pressure" in res["rules"]
    assert res["minimumSifClass"] == "HIGH_SIF"

def test_safety_net_override():
    sn = SafetyNet()
    res = sn.evaluate("muted alarm")
    override = sn.apply_override("NON_SIF", res)
    assert override == "HIGH_SIF"

    # Should not downgrade
    override_critical = sn.apply_override("CRITICAL_SIF", res)
    assert override_critical == "CRITICAL_SIF"

def test_pydantic_validation():
    req = PredictRequest(text="This is a test", metadata={"site": "TestSite"})
    assert req.text == "This is a test"
    assert req.metadata.site == "TestSite"
    
    with pytest.raises(ValueError):
        PredictRequest(text="") # min_length = 1
