To support your finalized **"Path B + A-Lite Hybrid"** strategy for **Milestone 5 (Collaborative CRM Pipeline & Invitation Engine)**, I have drafted four highly detailed, production-grade GitHub Issues. 

These issues are structured so that they can be directly copied and pasted into your project management board. They are explicitly designed around our core architectural rules, database constraints, zero-leakage security boundaries, and optimistic frontend state management patterns.

---

### **Issue 1: Database Schemas, Alembic Migrations & Async Repositories**
*   **Type:** 🛠️ Feature (Backend)
*   **Track:** `track/5-crm-hybrid`
*   **Dependencies:** None (Prerequisite for CRM Endpoints)

#### **Description**
Implement the relational schema definitions, performance indices, and async repository classes for the core CRM module and the invitation engine.

#### **Technical Scope & Specifications**
1.  **Alembic Database Migration:** Create a new migration revision specifying:
    *   **`contacts` Table:** Plural `snake_case` naming. Columns: `id` (UUID PK, default `gen_random_uuid()`), `organization_id` (UUID FK referencing `organizations(id)` with `ON DELETE CASCADE`), `full_name` (VARCHAR, Not Null), `email` (VARCHAR, Nullable), `phone` (VARCHAR, Nullable), standard audit timestamps (`created_at`, `updated_at` with timezone), and soft delete (`deleted_at` TIMESTAMPTZ, Nullable).
    *   **`crm_deals` Table:** Columns: `id` (UUID PK), `organization_id` (UUID FK with cascade delete), `contact_id` (UUID FK referencing `contacts(id)` with `ON DELETE SET NULL`, Nullable), `owner_user_id` (UUID FK referencing `users(id)` with `ON DELETE SET NULL`, Nullable), `title` (VARCHAR, Not Null), `value_amount` (NUMERIC, Not Null), `currency` (VARCHAR, default `'USD'`), `stage` (VARCHAR, default `'LEAD'`), expected close date, standard audit timestamps, and soft delete (`deleted_at`).
    *   **`invitations` Table:** Columns: `id` (UUID PK), `organization_id` (UUID FK with cascade delete), `email` (VARCHAR, Not Null), `role` (VARCHAR, default `'DOMAIN_MEMBER'`), `token_hash` (VARCHAR(64), Unique, Not Null), `expires_at` (TIMESTAMPTZ, Not Null), `accepted_at` (TIMESTAMPTZ, Nullable).
2.  **Performance & Spam Optimizations:**
    *   Enforce a **Composite Partial Index** on `crm_deals(organization_id, stage) WHERE deleted_at IS NULL` to ensure stage grouping queries execute in $<50\text{ ms}$ under heavy tenant loads.
    *   Enforce a **Partial Unique Constraint** on `invitations(organization_id, email) WHERE accepted_at IS NULL` to prevent multiple pending invites to the same recipient.
3.  **SQLAlchemy 2.0 Repositories:**
    *   Implement `ContactRepository` in `backend/app/repositories/contact_repository.py`.
    *   Implement `CrmDealRepository` in `backend/app/repositories/crm_deal_repository.py`.
    *   Strictly utilize Async SQLAlchemy 2.0 `select()` and `execute()` statements. Raw SQL or legacy `session.query()` calls are forbidden.

#### **Definition of Done (DoD)**
- [ ] Alembic migration generated and successfully applied with `alembic upgrade head`.
- [ ] Rollback paths verified running `alembic downgrade -1`.
- [ ] Async SQLAlchemy repositories unit tested for CRUD operations against `contacts` and `crm_deals` under isolation mockups.

---

### **Issue 2: Zero-Leakage Multi-Tenant CRM Endpoints & RBAC Validation**
*   **Type:** 🔒 Security & Feature (Backend)
*   **Track:** `track/5-crm-hybrid`
*   **Dependencies:** Issue 1

#### **Description**
Expose the REST API endpoints for CRM Deals and Contacts, enforcing strict Horizontal Isolation (multi-tenancy) and Vertical Isolation (RBAC controls) according to our zero-leakage security directives.

#### **Technical Scope & Specifications**
1.  **Expose REST Routes:** 
    *   `POST /api/v1/crm/deals` & `POST /api/v1/crm/contacts`
    *   `GET /api/v1/crm/deals/{id}` & `GET /api/v1/crm/contacts/{id}`
    *   `PATCH /api/v1/crm/deals/{id}` & `PATCH /api/v1/crm/contacts/{id}`
    *   `DELETE /api/v1/crm/deals/{id}` & `DELETE /api/v1/crm/contacts/{id}`
2.  **Zero-Leakage Horizontal Isolation Middleware & Scopes:**
    *   Every lookup or update query must strictly bind `organization_id == current_tenant_id` and `deleted_at IS NULL`.
    *   **Critical Security Rule:** If a resource lookup by ID fails this check (meaning the UUID does not exist OR belongs to another tenant), the endpoint must return an **HTTP 404 Not Found** with system error code **`ERR_NOT_FOUND_001`**. Returning an HTTP 403 in this scenario is strictly forbidden to prevent malicious actors from scanning and discovering valid UUIDs across tenants.
3.  **Intra-Tenant Vertical Isolation (RBAC Checking):**
    *   All write/update routes require the `crm:write` permission (available to `TENANT_OWNER`, `TENANT_ADMIN`, `DOMAIN_MANAGER`, and `DOMAIN_MEMBER` roles).
    *   Soft-deletion (`DELETE`) routes require the `crm:delete` permission (restricted to `TENANT_OWNER`, `TENANT_ADMIN`, and `DOMAIN_MANAGER`; denied to `DOMAIN_MEMBER`).
    *   **Vertical Ownership Check:** If a user with the `DOMAIN_MEMBER` role accesses a deal, they are restricted from updating/patching it unless they are explicitly assigned as the `owner_user_id` of that deal card.

#### **Definition of Done (DoD)**
- [ ] API endpoints return payloads encapsulated in our standard system response envelope.
- [ ] Pytest suites verify that cross-tenant access returns HTTP 404 with code `ERR_NOT_FOUND_001` rather than HTTP 403.
- [ ] Pytest suites verify that a `DOMAIN_MEMBER` user trying to soft-delete a deal is correctly rejected with HTTP 403 `ERR_RBAC_001`.

---

### **Issue 3: Cryptographically Secure Team Invitation & User Seeding Engine**
*   **Type:** 🔑 IAM & Core Service (Backend)
*   **Track:** `track/5-crm-hybrid`
*   **Dependencies:** Issue 1

#### **Description**
Develop the invitation workflow allowing tenant administrators to invite external team members and register them securely as `DOMAIN_MEMBER` users with instant Redis permission cache eviction.

#### **Technical Scope & Specifications**
1.  **Invitation Token Issuance (`POST /api/v1/organizations/invitations`):**
    *   Endpoint restricted to users holding the `user:manage` permission scope (`TENANT_OWNER`, `TENANT_ADMIN`).
    *   Generates a cryptographically secure random plaintext token.
    *   **Token Cryptography:** The plaintext token is never stored in the database. Instead, compute its one-way hash using SHA-256 and save the output inside `invitations.token_hash`.
    *   Returns the plaintext token to the client. Sets token expiration to 48 hours.
2.  **Invitation Consumption (`POST /api/v1/auth/invite/accept`):**
    *   Public endpoint accepting: `token`, `password`, and `full_name`.
    *   In a single, atomic **async database transaction**:
        1. Hash the incoming plaintext token using SHA-256 and lookup a matching unexpired, unaccepted record in `invitations.token_hash`. If invalid or expired, abort and return `ERR_VALIDATION_001`.
        2. Create and persist the new `User` entity, hashing their password safely.
        3. Insert the mapping in `user_roles` linking the user ID, organization ID (from the invitation), and assigning the `'DOMAIN_MEMBER'` role.
        4. Flag the invitation record as accepted (`accepted_at = current_timestamp`).
3.  **Active Session Eviction Hook:**
    *   Integrate a post-save hook on user-role updates.
    *   Instantly evict the Redis permission cache key matching pattern **`org:{org_id}:usr:{user_id}:perms`** to guarantee vertical deprovisioning compiles in under 200 milliseconds.

#### **Definition of Done (DoD)**
- [ ] Verified that invitation generation saves only SHA-256 token hashes (`token_hash`), never raw string parameters.
- [ ] Integration tests verify that if registration fails mid-process, the database rolls back completely with zero orphaned records.
- [ ] Verified that changing roles or deactivating an invited user immediately evicts their `org:{org_id}:usr:{user_id}:perms` cache key in Redis.

---

### **Issue 4: Standalone Angular 19/20 Kanban Board with Optimistic Signal Rollbacks**
*   **Type:** 🎨 Frontend Component
*   **Track:** `track/5-crm-hybrid`
*   **Dependencies:** Issue 2

#### **Description**
Create the standalone Angular Kanban board component displaying pipeline stages with reactive Signal state management and optimistic rollback error handling to prevent UI desynchronisation on network or RBAC failures.

#### **Technical Scope & Specifications**
1.  **UI Layout & Aesthetics:**
    *   Design a modern, responsive, glassmorphism-themed pipeline component.
    *   Organize deals into 5 stages: `LEAD`, `QUALIFIED`, `PROPOSAL`, `WON`, `LOST`.
    *   Display key metadata on cards: Deal Title, Value (Decimal formatted as currency), Assigned Owner, and Close Date.
2.  **Signal-Driven State & Standalone Architecture:**
    *   Enforce `ChangeDetectionStrategy.OnPush` and utilize the `inject()` dependency syntax.
    *   Manage active pipeline states reactively via Angular **Signals** (`computed`, `signal`).
3.  **Optimistic UI with Rollback Handling:**
    *   Implement HTML5 Drag-and-Drop capability for deal cards.
    *   When a card is dragged from stage $A$ to stage $B$, immediately update the local Signal store to render the change instantly to the user.
    *   Asynchronously dispatch a `PATCH /api/v1/crm/deals/{id}` (or stage update) API request.
    *   If the backend PATCH API call fails (e.g., due to a temporary network disconnect or a Vertical Isolation RBAC failure like a `DOMAIN_MEMBER` trying to move an unassigned card), catch the error, **automatically roll back the local Signal state** to its previous stage column, and trigger an error toast notification.
4.  **Tenant Context Injection:**
    *   Ensure the pipeline calls cleanly routing through your existing HTTP Interceptor to dynamically inject the active `X-Organization-Id` and `Authorization` headers on all CRM operations.

#### **Definition of Done (DoD)**
- [ ] Standalone Kanban component successfully compiles inside the Angular project with zero type or template errors.
- [ ] Bundle limits remain compliant with the strict style constraints in your configuration files.
- [ ] UI manual/automated test confirms that failing API updates roll card positions back to their starting columns cleanly with no duplicate renderings.

---

### 💡 Suggested Next Step

📈 Once you create these four issues on your GitHub board, I can compile a **detailed architectural diagram** or visual layout mapping showing how the *Zero-Leakage Horizontal Isolation* middleware intercepts requests before they hit the SQLAlchemy repositories. This will give Jules a visual anchor when coding the routing loops. Want me to draft that?
