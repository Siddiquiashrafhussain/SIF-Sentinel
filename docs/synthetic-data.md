# SIF-Sentinel Synthetic Dataset

## 1. Dataset Purpose
This dataset was generated in Phase 3 to provide a robust, internally consistent foundation for developing the SIF-Sentinel NLP pipeline, dashboard analytics, and end-to-end testing. It provides the necessary volume and variation to simulate real-world safety reporting environments without exposing any actual corporate or operational data.

## 2. Synthetic Data Warning
**WARNING: ALL DATA IS SYNTHETIC. DEMO DATA, NOT OIL PRODUCTION DATA.**
This dataset is synthetic and is not derived from OIL production records. It must NEVER be presented as actual OIL production data or used to claim real-world model performance or safety improvements.

## 3. Dataset Size
- **Total Reports:** 1600

## 4. Site Taxonomy
The dataset utilizes four synthetic demonstration sites:
- Duliajan (SITE-DUL)
- Moran (SITE-MOR)
- Digboi (SITE-DIG)
- Kumchai (SITE-KUM)

## 5. Asset Taxonomy
Ten synthetic operational assets are distributed across the four sites (e.g., Rigs, Production Stations, Wells).

## 6. Activity Taxonomy
15 realistic operational activities are included (e.g., Wellhead Intervention, Heavy Lifting, Confined Tank).

## 7. LSR Taxonomy Source
The dataset utilizes the 9 standard Life-Saving Rules (LSR). Note: This taxonomy is currently standard but should be validated against the project's approved/official taxonomy in production.

## 8. Barrier Taxonomy
48 synthetic barriers categorized into HARDWARE, ADMINISTRATIVE, and BEHAVIORAL classes, distributed across L1, L2, and L3 tiers.

## 9. Scenario Families
The generator utilizes template families covering scenarios such as:
- Energy Isolation
- Lifting
- Confined Space
- Driving
- Work at Height
- Housekeeping (Non-SIF)
- Hard Negatives (Observations containing safety keywords but lacking SIF potential)

## 10. Ground-Truth Labels
Ground truth labels (SIF class, mapped LSRs, barrier gaps, evidence spans, and scenario IDs) are stored in the `groundTruth` object alongside the free text to serve as robust targets for future ML training and explainability evaluation.

## 11. SIF Class Distribution
The dataset enforces a controlled distribution to simulate a realistic reporting funnel:
- NON_SIF: ~58%
- SIF_POTENTIAL: ~22%
- HIGH_SIF: ~16%
- CRITICAL_SIF: ~4%

## 12. Hard Negatives
To prevent the model from learning naive keyword heuristics (e.g., automatically classifying "LOTO" or "Permit" as a hazard), the dataset includes hard-negative reports where critical safety terminology is used in a positive or routine context, correctly labeled as NON_SIF.

## 13. Data Leakage Prevention
Ground-truth labels do NOT appear verbatim in the generated `freeText` unless they form natural components of a human-authored safety observation. The reports describe the observation rather than explicitly announcing the ML label, preventing trivial model leakage.

## 14. Reproducibility
The dataset is entirely reproducible using a defined random seed.

## 15. Generation Command
```bash
python data/generate_synthetic_reports.py --count 1600 --seed 42
```

## 16. Validation Command
```bash
python data/validate_synthetic_data.py
```

## 17. Seed Command
```bash
npx prisma db seed
```
*(Also accessible via `pnpm db:seed` if defined in package scripts)*

## 18. Limitations
- The text variation is template-driven; while realistic, it lacks the infinite long-tail grammatical anomalies found in human-written text.
- Evidence spans are exact string matches from the templates, which may not fully represent complex, discontinuous human reasoning.
- The `AiInference` records currently generated are placeholders using ground-truth values to populate the database structure; they do not represent actual model predictions.
