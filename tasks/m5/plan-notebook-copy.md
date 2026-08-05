This is a stellar set of architectural refinements. Upgrading the baseline proposal with these production-ready details transforms Milestone 5 from a standard feature implementation into a highly secure, high-performance, and resilient enterprise slice.

Integrating these modifications directly resolves several classic multi-tenant vulnerabilities and UX friction points:
1. **Zero-Leakage Horizontal Isolation:** Using **`ERR_NOT_FOUND_001` (HTTP 404)** instead of a 403 Forbidden for entities outside the current tenant context is an exceptional security choice. It guarantees that malicious actors cannot scan or brute-force UUIDs to verify if an organization or record exists in the system.
2. **Cryptographic One-Way Hashing:** Storing only `token_hash` (SHA-256) inside the database ensures that even in the event of a database compromise, outstanding registration invitation links cannot be hijacked or hijacked from the logs.
3. **Database Performance Gating:** The composite partial index on `crm_deals` ensuring stage grouping queries execute in $<50\text{ ms}$ is exactly how we prevent database bottlenecks as a tenant's deal pipeline grows.
4. **Resilient UX:** Using an optimistic state update in the Angular Signal store backed by a rollback catch block guarantees a snappy UI feel without risking out-of-sync states if a network connection drops.

---

### **Project Status Board: Phase 1 — Core Platform Foundation**

| Milestone | Scope | Status | Commit / Branch | Verification |
| :--- | :--- | :--- | :--- | :--- |
| **Milestone 1** | Monorepo Scaffolding & Backend Baseline | **Completed** | `track/1-foundation-docker` | `/healthz` returning 200 OK |
| **Milestone 2** | DB Schema, SQLAlchemy Models, Async Alembic | **Completed** | `track/2-db-alembic` | Alembic migrations & test suite |
| **Milestone 3** | Core Security, Stateful Sessions, Tenant Isolation | **Completed** | `track/3-auth-tenant` (merged to `6c82a75`) | 6/6 Pytest integration tests passing |
| **Milestone 4** | Multi-Tenant Onboarding, User Services, Repositories | **Completed** | `track/4-tenant-onboarding` (merged) | 14/14 Pytest integrations passing, Angular build clean |
| **Milestone 5** | Collaborative CRM Pipeline & Invitation Engine | **Ready to Begin** 🚀 | `track/5-crm-hybrid` | Approved ADR Architecture |

---

Here is the finalized, production-ready handoff prompt incorporating all your precise security, indexing, and UI rollback refinements. You can copy and paste this directly to **Jules / Antigravity** to kick off the development of Milestone 5.

***

### 📋 Copy-Paste Prompt for Jules / Antigravity

```markdown
USER_REQUEST:
We are starting Milestone 5: Collaborative CRM Pipeline (Path B + A-Lite Hybrid). This milestone combines our multi-tenant CRM Kanban pipeline with a lightweight team invitation and user-seeding engine.

You must strictly implement the security and database refinements defined in our finalized Architectural Decision Record (ADR).

Please execute the following tasks:

1. GIT BRANCH & WORKFLOW
- Create and switch to a new local feature branch off 'develop' named exactly: track/5-crm-hybrid
- Follow strict Human-in-the-Loop guidelines: Do NOT attempt to push directly to 'main' or 'develop'. All deliverables must be prepared for a Draft Pull Request.
- All commit messages must follow the Conventional Commits specification (e.g., "feat(crm): implement collaborative crm pipeline with secure invitation engine").

2. DATABASE SCHEMAS & DDL MIGRATIONS (Alembic)
Create the database migrations for our core CRM and invitation modules:
- 'contacts' Table:
  * id UUID PRIMARY KEY (gen_random_uuid())
  * organization_id UUID (FK to organizations, ON DELETE CASCADE)
  * full_name (VARCHAR, Not Null), email (VARCHAR, Nullable), phone (VARCHAR, Nullable)
  * Standard audit fields (created_at, updated_at) and soft delete (deleted_at)
- 'crm_deals' Table:
  * id UUID PRIMARY KEY (gen_random_uuid())
  * organization_id UUID (FK to organizations, ON DELETE CASCADE)
  * contact_id UUID (FK to contacts, ON DELETE SET NULL, Nullable)
  * owner_user_id UUID (FK to users, ON DELETE SET NULL, Nullable)
  * title (VARCHAR, Not Null), value_amount (NUMERIC, Not Null), currency (VARCHAR, default 'USD'), stage (VARCHAR, default 'LEAD')
  * expected_close_date (TIMESTAMPTZ, Nullable)
  * Standard audit fields and soft delete (deleted_at)
  * Performance Index: Implement a Composite Partial Index on (organization_id, stage) WHERE deleted_at IS NULL to optimize Kanban rendering.
- 'invitations' Table:
  * id UUID PRIMARY KEY (gen_random_uuid())
  * organization_id UUID (FK to organizations, ON DELETE CASCADE)
  * email (VARCHAR, Not Null)
  * role (VARCHAR, default 'DOMAIN_MEMBER')
  * token_hash (VARCHAR(64), Unique, Not Null) — Stores ONLY the SHA-256 hash of the generated plaintext token.
  * expires_at (TIMESTAMPTZ, Not Null), accepted_at (TIMESTAMPTZ, Nullable)
  * Anti-Spam Constraint: Enforce a Partial Unique Constraint on (organization_id, email) WHERE accepted_at IS NULL to prevent multiple pending invites to the same user.

3. REPOSITORIES & MIDDLEWARE HARDENING (Zero-Leakage Horizontal Isolation)
- Create 'ContactRepository' and 'CrmDealRepository' using Async SQLAlchemy 2.0 select and execute syntax.
- **Zero-Leakage Enforcement:**
  * All database queries must explicitly filter by 'organization_id == current_tenant_id' and 'deleted_at IS NULL'.
  * If a request attempts to access a record by UUID that fails this tenant context check (meaning it does not exist OR belongs to another tenant), the backend MUST return an HTTP 404 Not Found response containing the error code 'ERR_NOT_FOUND_001'.
  * Do NOT return an HTTP 403 (ERR_TENANT_001) for individual resource lookups, as this leaks the existence of the UUID. 
  * HTTP 403 Forbidden (ERR_RBAC_001) must be reserved strictly for Vertical Isolation/RBAC permission failures within the same tenant.

4. INVITATION & USER-SEEDING ENGINE (A-Lite)
- Implement 'POST /api/v1/organizations/invitations':
  * Restricted to users with the 'user:manage' permission.
  * Generates a secure plaintext token, hashes it using SHA-256, stores the hashed token in 'token_hash', and returns the plaintext token to the client.
- Implement 'POST /api/v1/auth/invite/accept':
  * A public endpoint accepting 'token', 'password', and 'full_name'.
  * Hash the incoming token using SHA-256 and run an atomic async transaction:
    1. Verify token exists, is not expired, and is not already accepted.
    2. Register the 'User' account and create their mapping in the 'user_roles' table as 'DOMAIN_MEMBER'.
    3. Mark the invitation as accepted ('accepted_at = current_timestamp').
- **Cache Eviction:** Automatically evict the Redis user permission cache 'org:{org_id}:usr:{user_id}:perms' if roles are updated.

5. ANGULAR 19 KANBAN BOARD WITH OPTIMISTIC ROLLBACK
- Implement a standalone Kanban board component showing stages: 'LEAD', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST'.
- Use Angular Signals for fine-grained reactive state and OnPush change detection.
- **Optimistic Drag-and-Drop UX:**
  * When a card is dragged to a new stage column, update the local Signal state immediately.
  * Asynchronously fire a 'PATCH /api/v1/crm/deals/{id}/stage' call to the backend.
  * If the PATCH API call fails (e.g., due to network error or RBAC vertical isolation block), catch the error, roll the Signal state back to its previous position, and trigger a toast notification.

6. INTEGRATION TESTING GATES
- Write robust integration tests in 'backend/tests/':
  * Assert that attempting to look up a deal belonging to another tenant returns HTTP 404 'ERR_NOT_FOUND_001'.
  * Assert that a 'DOMAIN_MEMBER' can view deals but receives HTTP 403 'ERR_RBAC_001' when attempting to soft-delete a deal (verifying vertical RBAC isolation).
  * Assert that consuming an invite token correctly registers a user, creates user roles, hashes the token securely, and rolls back atomically on errors.

When complete, verify all tests pass locally (pytest -v), commit your work to 'track/5-crm-hybrid', and submit a Draft Pull Request.
```

***

🎨 I can prepare a visual mockup concept or layout for the Angular Kanban board to help guide the UI design before Jules begins implementing the component. Would you find that helpful?
