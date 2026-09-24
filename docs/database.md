# Database Foundation

This document outlines the database foundation implemented in Phase 2 for the SIF-Sentinel project.

## 1. Overview
- **Database Engine**: PostgreSQL 15 (Docker)
- **ORM**: Prisma (v5.22.0)
- **Primary Source of Truth**: `apps/api/prisma/schema.prisma`
- **Extensions**: `pgvector` configured natively in Prisma via `extensions = [vector]`.

## 2. Entities
- **User**: System users, representing HSE Officers, Field Supervisors, and Admins.
- **Site**: Geographical or organizational sites (e.g., Duliajan, Moran).
- **Asset**: Operational assets (e.g., Rig Alpha-01, Well Beta-02) belonging to a Site.
- **Activity**: Types of operational work performed (e.g., Wellhead Intervention).
- **Report**: Central domain entity representing a safety report or observation.
- **LifeSavingRule**: Authoritative mapping of standardized Life-Saving Rules.
- **ReportLsr**: Join table linking `Report` and `LifeSavingRule`.
- **Barrier**: Predefined safety barriers (Hardware, Administrative, Behavioral).
- **ReportBarrierGap**: Join table representing failed or missing barriers for a `Report`.
- **AiInference**: Stored inference output from the ML pipeline (versions, confidence, drivers, embeddings).
- **PatternCluster**: Extracted thematic or risk clusters of reports.
- **ClusterReport**: Join table mapping `PatternCluster` to `Report`.
- **Review**: Human-in-the-loop review actions performed by a `User` against a `Report`.
- **AuditLog**: Generalized tracking of user actions across entities.

## 3. Relationships
- **Site ↔ User**: `1:n` (Users belong to one site). Restrict deletion.
- **Site ↔ Asset**: `1:n`. Restrict deletion.
- **Asset ↔ Report**: `1:n`. Restrict deletion.
- **Activity ↔ Report**: `1:n`. Restrict deletion.
- **Report ↔ ReportLsr ↔ LifeSavingRule**: `m:n`. Deleting a report cascades to its LSR mappings; deleting an LSR is restricted.
- **Report ↔ ReportBarrierGap ↔ Barrier**: `m:n`. Deleting a report cascades to barrier gaps; deleting a barrier is restricted.
- **Report ↔ AiInference**: `1:n`. Reports can have multiple AI inferences (e.g., different model versions). Deleting a report cascades to inferences.
- **Report ↔ ClusterReport ↔ PatternCluster**: `m:n`.
- **Report ↔ Review**: `1:n`. Reports can have a history of reviews. Deleting a report cascades to its reviews.

## 4. Enums
- `UserRole`: HSE_OFFICER, FIELD_SUPERVISOR, ADMIN
- `ReportType`: NEAR_MISS, UNSAFE_ACT, UNSAFE_CONDITION, INCIDENT
- `SifClass`: NON_SIF, SIF_POTENTIAL, HIGH_SIF, CRITICAL_SIF
- `ReportStatus`: PENDING, VERIFIED
- `ReviewDecision`: CONFIRMED, OVERRIDDEN
- `BarrierClass`: HARDWARE, ADMINISTRATIVE, BEHAVIORAL
- `BarrierTier`: L1, L2, L3

## 5. Index Strategy
Indexes are strictly focused on typical dashboard metrics and query performance requirements:
- `Report.occurredAt`: Frequently used for timeseries filtering.
- `Report.assetId`: Frequently used for location-based dashboards.
- `Report.status`: Filtering verified vs pending reports.
- `AiInference.sifClass`: Filtering reports by AI severity classification (placed on AiInference since that is where SIF class is stored).

## 6. Full-Text Search Strategy
A PostgreSQL **GIN Expression Index** was implemented directly via raw SQL appended to the initial migration:
```sql
CREATE INDEX report_freetext_idx ON "Report" USING GIN (to_tsvector('english', "freeText"));
```
This is a true PostgreSQL full-text index rather than a naive generic Prisma GIN index, enabling efficient linguistic search on `Report.freeText`.

## 7. pgvector Strategy
The `AiInference.embedding` field utilizes `pgvector` natively supported via Prisma:
- Field type: `Unsupported("vector(768)")`
- Configuration: Set using Prisma's `extensions = [vector]` directive on the PostgreSQL provider.
- Note: 768 dimensions were provisionally selected as an expected size for embedding models like DeBERTa-v3/mpnet, though this is easily adjustable in future phases.

## 8. Seed Data & Synthetic Warning
Synthetic seed data is configured in `apps/api/prisma/seed.ts`.
**WARNING: ALL DATA IS SYNTHETIC. DEMO DATA, NOT OIL PRODUCTION DATA.**
- Synthetic sites (Duliajan, etc.), mock users, mock reports, and randomly distributed baseline AI metrics are inserted solely to validate constraints and dashboard readiness. 

## 9. Migration Commands
To apply the database state:
```bash
npx prisma migrate dev
```
To re-seed synthetic data:
```bash
npx prisma db seed
```

## 10. Environment Configuration
Local Docker PostgreSQL connects via:
`DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5433/sif_sentinel?schema=public"`

## 11. Human-Review Data Model
The schema handles "Human-in-the-Loop" efficiently via the `Review` table. It maintains a 1-to-many relationship with `Report`, recording `decision` (CONFIRMED/OVERRIDDEN), reviewer notes, and timestamps to ensure an unbroken chain of custody and an audit trail for future dataset retraining.

## 12. Audit Logging
The `AuditLog` table securely tracks generic actions (WHO, WHAT, WHEN) tied directly to a `User` to track modifications or manual overrides in the system.
