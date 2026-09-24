# SIF-Sentinel Model Card

## Model Purpose
The models within the SIF-Sentinel ML module are designed to analyze free-text safety reports, extract barrier gaps, map to Life-Saving Rules (LSRs), and classify Serious Injury and Fatality (SIF) potential.

## Intended Users
- HSE Data Analysts
- System Administrators
- Application Developers demonstrating capabilities in hackathons.

## Non-intended Uses
- Do not use for automated dispatch or emergency response without human oversight.
- Do not use to replace expert Human HSE verification.

## Training Data
- Synthetically generated dataset representing observations, near-misses, and incidents across simulated sites.
- **Limitation**: The model is trained on small scale synthetic data for demonstration and validation of the architecture.

## Evaluation Data
- A separate hand-written test set of safety reports designed to capture variations in terminology, triggers, and rule descriptions.

## Known Limitations
- **Synthetic Training Data**: Patterns learned may not reflect real-world linguistic diversity of actual field workers.
- **Hand-written test size**: Evaluated on a limited (50-sample) hand-written dataset, which is not statistically exhaustive.
- **Domain Shift**: High probability of domain shift when applied to unseen real-world OIL production data.
- **Out-of-domain limitations**: The system is not calibrated for non-HSE text.

## Expected Failure Modes
- Ambiguous or abbreviated wording may lead to false negatives.
- Heavy reliance on deterministic safety-net triggers for critical captures means novel terminology might slip through.

## Model Version
- `sif-sentinel-0.1.0` (TF-IDF + LogisticRegression baseline)

## Disclaimer
"This prototype is trained and evaluated on synthetic/hand-written demonstration data and must not be interpreted as validated performance on OIL production data."
