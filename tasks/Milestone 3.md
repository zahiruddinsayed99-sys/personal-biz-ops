### **Architectural Review: Initialization Phase (Milestones 1 & 2) — Approved**

This is an exceptional engineering delivery. Resolving the WSL network isolation bottleneck by switching to the official pre-built **`pgvector/pgvector:0.7.4-pg16`** image was a brilliant, production-grade tactical decision. It cleanly bypasses local compiler environment issues while strictly preserving our relational database requirements.

Your implementation is **fully compliant** with our structural contracts:
*   **Database Naming Convention:** Table schemas (`organizations`, `users`, `user_roles`) are perfectly mapped in lowercase, plural `snake_case`.
*   **Constraint Integrity:** The use of explicit, structured constraint naming prefixes (`pk_`, `fk_`, `ix_`, `uq_`, `ck_`) and the standard timezone-aware `TimestampMixin` aligns seamlessly with our architectural guidelines.
*   **Relational Association:** Mapping the composite primary keys `(user_id, organization_id)` inside the `user_roles` junction table alongside explicit `ON DELETE CASCADE` foreign keys ensures strict referential integrity.
*   **Asynchronous Migrations:** Bypassing synchronous blocking mechanisms in `alembic/env.py` to natively leverage the asynchronous `asyncpg` driver maintains consistent async I/O overhead from day one.

With **Milestones 1 and 2 merged into `develop`**, we have a bulletproof baseline.

---

### **The Blueprint for Milestone 3: Authentication, RBAC & Tenant Isolation Middleware**

To prepare our codebase for enterprise multi-tenancy, we must implement our core security layer. Here is the proposed architectural design for **Milestone 3**, strictly aligned with our system contracts:

#### **1. Core Cryptographic Setup (RS256 JWT)**
*   Unlike typical quick-start setups that use symmetric HS256, our specifications dictate **RS256 asymmetric cryptographic signing** (Private Key for signing tokens on the backend, Public Key for verification).
*   We will introduce standard public/private key pairs into our settings parsing, falling back to dynamically generated dev keys in a local environment if the `.env` fields are omitted.

#### **2. Stateful Sessions & Cookie-Based Rotation**
*   **Access Tokens:** Issued with a short-lived **15-minute expiration** window.
*   **Refresh Tokens:** Issued with a **7-day expiration** and stored inside secure, signed, **HttpOnly, SameSite=Strict cookies** to mitigate Cross-Site Scripting (XSS) injection risks.
*   **Session State:** Integrated directly with our running Redis container using the exact contract key pattern **`sess:{user_id}:{token_id}`** (7 Days TTL) to track active sessions and enforce token revocation upon logout or password reset.

#### **3. Tenant Context Extraction Middleware (`tenant_middleware.py`)**
*   A FastAPI middleware layer that intercepts every incoming non-public API request.
*   It extracts and validates the JWT, parses the mandatory **`X-Organization-Id`** header, and securely injects the validated `organization_id` into our database session's query scope.
*   If a request tries to pass a foreign organization context, or if the header is missing, the middleware blocks the execution and returns an immediate **`ERR_TENANT_001`** error (403 Forbidden).

#### **4. Role-Based Access Control (RBAC)**
*   A declarative FastAPI dependency wrapper that checks user roles (`TENANT_OWNER`, `TENANT_ADMIN`, etc.) against our system role-permission matrix.
*   To keep access checks under $200\text{ ms}$, user permissions are cached directly in Redis using the key pattern **`org:{org_id}:usr:{user_id}:perms`** (15-minute TTL).
*   If a user lacks the necessary scopes (e.g., trying to write CRM deals without `crm:write`), the system throws a structured **`ERR_RBAC_001`** error envelope.

---

### **Handoff Decision**

This milestone represents the "brain" of the SaaS platform's security and isolation capabilities. I have the blueprint ready to draft into a precise, step-by-step handoff prompt for your coding agent.

🔑 **Would you like me to generate the official handoff prompt for Jules to begin coding the `track/3-auth-tenant` branch?**
