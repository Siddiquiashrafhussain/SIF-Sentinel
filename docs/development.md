# Development Guide

## Prerequisites

- Node.js >= 20
- pnpm
- Python >= 3.11
- Docker & Docker Compose

## Installation

1. Install Node dependencies:

   ```bash
   pnpm install
   ```

2. Setup Python environment:
   ```bash
   cd apps/ml
   python -m venv .venv
   # Windows:
   .\.venv\Scripts\Activate.ps1
   # macOS/Linux:
   source .venv/bin/activate

   pip install -r requirements.txt
   ```

## Infrastructure

Start PostgreSQL and Redis:

```bash
docker compose up -d
```

Check health:

```bash
docker compose ps
```

## Running the Applications

**Web (Next.js):**

```bash
pnpm --filter web dev
```

**API (NestJS):**

```bash
pnpm --filter api start:dev
```

**ML (FastAPI):**

```bash
cd apps/ml
# Activate venv first!
uvicorn app.main:app --reload --port 8000
```
