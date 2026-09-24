# SIF-Sentinel Security Policy

## 1. Authentication & Authorization
- **JWT Storage:** JWT tokens are issued as `HttpOnly` cookies. They are strictly forbidden from appearing in `localStorage`, `sessionStorage`, or JSON payload bodies.
- **Roles:** Handled by NestJS `@Roles()` decorators. Field Supervisors cannot approve High/Critical SIF events; only HSE Officers and Admins can.
- **CSRF:** Mitigated via SameSite cookie configurations combined with strict CORS checking against `WEB_ORIGIN`.

## 2. Web Security (Helmet & CORS)
- **Helmet:** Used to enforce strict headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).
- **CORS:** Wildcard (`*`) is disabled for credentials. Restricted to explicit `WEB_ORIGIN` domains.

## 3. Database & SQL Injection
- **Prisma Layer:** User input is never concatenated manually. We do not use `$executeRawUnsafe()`. 

## 4. Input Validation (XSS)
- Validated rigorously via Zod on the frontend and `class-validator` / `zod-validation-pipe` on the backend.
- Reports free text is treated as potentially malicious and safely handled by React rendering (which automatically escapes text context). 

## 5. Secrets Management
- Secrets are passed as environment variables.
- `.env` files are in `.gitignore`.
- `.env.example` contains only blank placeholders or safe local development ports.

## 6. Audit Logging & PII
- Every review workflow modification yields an immutable `AuditLog` row.
- Neither Audit Logs nor API Console Logs contain tokens, passwords, or PII.

## 7. HTTPS
- Development runs on HTTP, but the production stack forces HTTPS. Cookies are marked `Secure` in production builds.

## 8. Threat Model Mitigation
- **Credential Leakage:** Prevented by `HttpOnly` design.
- **Malicious AI Output:** AI output cannot bypass human review; humans always confirm or override via `/api/v1/review/:reportId`.
