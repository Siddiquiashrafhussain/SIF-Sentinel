# SIF-Sentinel AI Integration Architecture

## 1. Overview
The SIF-Sentinel integration connects the NestJS backend with the FastAPI ML microservice. This ensures heavy NLP and clustering workloads do not block the primary API request loop, creating an asynchronous, resilient, and idempotent data pipeline.

## 2. Architecture Diagram

```
                    ┌───────────────┐
                    │    Web App    │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  NestJS API   │
                    └───────┬───────┘
                            │
                  ┌─────────┴─────────┐
                  ▼                   ▼
             PostgreSQL           BullMQ
                                      │
                                      ▼
                                   Redis
                                      │
                                      ▼
                               AI Worker
                                      │
                                      ▼
                               FastAPI ML
                                      │
                           ┌──────────┴──────────┐
                           ▼                     ▼
                       /predict               /cluster
                           │                     │
                           ▼                     ▼
                    AI Inference          Pattern Clusters
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
             LSR        Barriers      Review
                                         │
                                         ▼
                                      HSE User
                                         │
                                         ▼
                                    Feedback Label
```

## 3. Workflow
### Asynchronous Processing
When a new report is created via `POST /api/v1/reports`, the API commits the report to the database with a `PENDING` status. It then enqueues a job (`process-report-ai`) into a BullMQ queue backed by Redis and returns an HTTP 202 Accepted. 

### ML Integration
The `ReportAiProcessor` consumes jobs and forwards the text to the `FastAPI /predict` route. It sets an explicit timeout and validates the response schema. 

### Database Persistence
A single Prisma transaction is used to upsert the `AiInference`, map `ReportLsr`, and map `ReportBarrierGap`. High-severity cases trigger an escalation to the Review Queue and generate notifications. 

### Review and Feedback
HSE Officers interact with the system via the Review Queue. Overriding an AI prediction creates a `Feedback` label which records both the AI and Human decisions independently, without mutating the original `AiInference`. This allows for calculating true Agreement KPIs dynamically.

## 4. Operational Considerations
* **Idempotency**: All DB upserts utilize unique composite constraints to safely endure multiple job deliveries. 
* **Retries**: BullMQ utilizes exponential backoff for temporary ML unavailability. 
* **Concurrency**: Set via `AI_WORKER_CONCURRENCY`.
