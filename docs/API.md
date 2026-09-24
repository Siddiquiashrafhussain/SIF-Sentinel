# SIF-Sentinel API Documentation

## Authentication
All requests (except public endpoints) require a `Bearer` token passed in the `Authorization` header.

## Reports API

### POST /api/v1/reports
* **Description**: Create a new safety report and enqueue an asynchronous AI processing job.
* **Returns**: HTTP 202 Accepted. Includes the newly created `Report` (status `PENDING`) and `jobId`.

### GET /api/v1/reports/:id
* **Description**: Fetches detailed information regarding a report, including its AI inferences, life-saving rules, and barrier gaps.

## Review Queue API

### GET /api/v1/review/queue
* **Description**: Returns all reports requiring HSE Review (status `PENDING`), with critical or high severity reports prioritized.

### POST /api/v1/review/:reportId
* **Description**: Submit an HSE Human decision (`CONFIRMED` or `OVERRIDDEN`) for an AI prediction. Creates a Feedback label for future training.
* **Payload**:
  ```json
  {
    "decision": "OVERRIDDEN",
    "correctedSifClass": "SIF_POTENTIAL",
    "note": "..."
  }
  ```

## Patterns API

### POST /api/v1/patterns/recompute
* **Description**: Queues an async clustering job to re-evaluate unstructured precursor themes. Returns HTTP 202.

## Analytics API

### GET /api/v1/analytics/agreement
* **Description**: Calculates AI/Human agreement dynamically using feedback records from the DB.
