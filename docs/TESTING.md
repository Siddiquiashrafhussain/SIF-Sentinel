# SIF-Sentinel Testing Strategy

## 1. Overview
The testing architecture covers Unit, Integration, E2E, and AI Safety layers. It ensures that any regressions in safety net mappings, API logic, or frontend workflows are caught securely before merging.

## 2. Test Layers

### 2.1 Unit Tests (Jest)
**Location:** `apps/web/src/lib/*.test.ts`, `apps/api/src/**/*.spec.ts`
**Scope:** Core business logic, pure formatters, complex data manipulations.
**Execution:** `pnpm test:unit`

### 2.2 API Integration Tests (Supertest)
**Location:** `apps/api/test/**/*.e2e-spec.ts`
**Scope:** HTTP request/response format, authentication bypass checks, HTTP headers, role guard behavior.
**Execution:** `pnpm test:api`

### 2.3 End-to-End Tests (Playwright)
**Location:** `apps/web/tests/e2e.spec.ts`
**Scope:** Complete user journey (Login -> Reports Filter -> Inspect -> Review). Verifies browser-level security (no JWT in localStorage).
**Execution:** `pnpm test:e2e`

### 2.4 AI Safety-Net Tests
**Location:** `apps/ml/tests/test_safety_net.py`
**Scope:** Strict verification that triggers like "bypass", "muted alarm", and "H2S" always elevate the SIF class appropriately, overriding the model's raw probability output.
**Execution:** `pnpm test:ai`

## 3. Test Databases
E2E and API tests use an isolated database environment when executed in CI. Real OIL production data is never used inside tests; synthetic fixtures are required.

## 4. Commands
- `pnpm test`: Runs all configured test suites.
- `pnpm test:e2e`: Runs Playwright UI tests.
- `pnpm test:unit`: Runs Jest unit tests.
- `pnpm test:api`: Runs NestJS Supertest suite.
- `pnpm test:ai`: Runs Python Pytest AI regression suite.
- `pnpm test:a11y`: Runs Accessibility scans (Axe).
