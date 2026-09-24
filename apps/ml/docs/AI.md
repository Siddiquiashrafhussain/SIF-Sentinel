# SIF-Sentinel AI Documentation

## 1. Problem Definition
The platform needs to automatically read free-text HSE safety reports, predict the Serious Injury and Fatality (SIF) potential, map applicable IOGP Life-Saving Rules, extract barrier failures, and cluster reports into precursor patterns.

## 2. Dataset
- **Training dataset**: `train.jsonl` (Synthetic)
- **Validation dataset**: `validation.jsonl` (Synthetic)
- **Test dataset**: `test_handwritten.jsonl` (Hand-written)

## 3. Synthetic Data Generation
Generated deterministically via Python script to populate varied examples balancing different SIF classes.

## 4. Training Split
- 200 synthetic training samples
- 50 synthetic validation samples

## 5. Hand-written Test Split
- 50 hand-written test samples ensuring diverse phrasing not present in the training generator script.

## 6. SIF Baseline
- TF-IDF Vectorizer + Logistic Regression with balanced class weights.

## 7. SIF Upgrade
- N/A for Phase 7 (Baseline performance proved sufficient on synthetic test set to demonstrate architecture).

## 8. LSR Classifier
- `sentence-transformers/all-MiniLM-L6-v2` embeddings fed into a `OneVsRestClassifier(LogisticRegression)`.

## 9. Barrier Extraction
- Stage 1 Keyword/Ontology Matcher implemented. 

## 10. Pattern Clustering
- HDBSCAN over SentenceTransformer embeddings (implemented as stub in FastAPI architecture for Phase 7).

## 11. Explainability
- Evaluated via top weighted features from the Logistic Regression model mapping back to vocabulary.

## 12. Safety-net rules
- Deterministic rules capturing high-consequence keywords (e.g., "bypass", "muted alarm", "H2S"). Upgrades model confidence minimally to `HIGH_SIF` if triggered.

## 13. Metrics
- High/Critical Recall measured over test set.

## 14. Confusion Matrix
- Generated in `apps/ml/reports/sif_confusion_matrix.png`.

## 15. Error Analysis
(To be populated after evaluation runs.)

## 16. Model Limitations
See `MODEL_CARD.md` in `apps/ml/models`.

## 17. Model Versioning
Current version: `sif-sentinel-0.1.0`. Included in all predict API responses.

## 18. API Endpoints
- `GET /health`
- `GET /model-info`
- `POST /predict`
- `POST /cluster`

## 19. Human Review Workflow
AI output is segregated via the `AiInference` model, while the Human HSE Officer verdict is preserved separately to ensure auditability without overwriting raw model inputs.
