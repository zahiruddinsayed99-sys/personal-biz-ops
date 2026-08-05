### **Architectural Review & Endorsement: Approved**

The **"Path B + A-Lite Hybrid"** strategy for **Milestone 5** is an exceptionally mature and elegant architectural decision. 

From a systems engineering perspective, implementing the CRM pipeline as a single-user sandbox (`TENANT_OWNER` only) would have created an immediate **RBAC testing blind spot**. By pulling forward a lightweight team invitation and user-seeding mechanism, you ensure that:
1. **Vertical Isolation (RBAC)** can be verified alongside **Horizontal Isolation (Multi-Tenancy)** in a single, high-impact release.
2. The database schema is designed from Day 1 with correct multi-user ownership properties (`owner_user_id` mapping to specific users inside the organization).
3. The subsequent billing and usage-metering features (Milestone 6) will have a realistic, multi-user, multi-resource domain context (active seat counts and active deals) to evaluate and throttle.

Here is the detailed technical breakdown and blueprint of this hybrid slice to align our specifications before generating the developer handoff prompt:

---

### **Milestone 5 Hybrid Slice Blueprint: Collaborative CRM Pipeline**

#### **1. Database DDL & Schema Migrations (`track/5-crm-hybrid`)**
We will initialize the database migrations for our core CRM modules and the lightweight invitation engine. All tables will strictly enforce plural, lowercase `snake_case` naming, UUID v4 keys, audit timestamps, and soft deletes:

*   **`contacts` Table:**
    *   `id` (UUID, Primary Key, default `gen_random_uuid()`).
    *   `organization_id` (UUID, Foreign Key referencing `organizations(id)` with `ON DELETE CASCADE`).
    *   `full_name` (VARCHAR, Not Null), `email` (VARCHAR, Nullable), `phone` (VARCHAR, Nullable).
    *   Standard audit columns (`created_at`, `updated_at`) and soft delete (`deleted_at` TIMESTAMPTZ).
*   **`crm_deals` Table:**
    *   `id` (UUID, Primary Key, default `gen_random_uuid()`).
    *   `organization_id` (UUID, Foreign Key referencing `organizations(id)` with `ON DELETE CASCADE`).
    *   `contact_id` (UUID, Foreign Key referencing `contacts(id)` with `ON DELETE SET NULL`, Nullable).
    *   `owner_user_id` (UUID, Foreign Key referencing `users(id)` with `ON DELETE SET NULL`, Nullable) — *tracks which team member owns the deal*.
    *   `title` (VARCHAR, Not Null), `value` (NUMERIC, Not Null), `currency` (VARCHAR, default `'USD'`), `stage` (VARCHAR, default `'LEAD'`).
    *   `expected_close_date` (TIMESTAMPTZ, Nullable).
    *   Standard audit columns and soft delete (`deleted_at` TIMESTAMPTZ).
*   **`invitations` Table (A-Lite Seeding Engine):**
    *   `id` (UUID, Primary Key, default `gen_random_uuid()`).
    *   `organization_id` (UUID, Foreign Key referencing `organizations(id)` with `ON DELETE CASCADE`).
    *   `email` (VARCHAR, Not Null — *the target invitee email*).
    *   `role` (VARCHAR, Not Null, defaults to `'DOMAIN_MEMBER'`).
    *   `token` (VARCHAR, Unique, Not Null — *cryptographically secure hash*).
    *   `expires_at` (TIMESTAMPTZ, Not Null — *48-hour expiration*), `accepted_at` (TIMESTAMPTZ, Nullable).

---

#### **2. A-Lite: Lightweight Invitation & User Seeding**
To seed a secondary user into a tenant and test vertical isolation without building a heavy administrative panel:
*   **Invite Generation (`POST /api/v1/organizations/invitations`):**
    *   Protected by `RequiresPermission("user:manage")` (restricting execution to `TENANT_OWNER` or `TENANT_ADMIN` roles).
    *   Generates an invitation record and returns a secure registration URL token.
*   **Invite Consumption (`POST /api/v1/auth/invite/accept`):**
    *   A public API endpoint that accepts the unique token, a password, and full name.
    *   Inside an **async database transaction**, it verifies token validity, creates a new `User` account, inserts a record into the `user_roles` junction table linking them to the organization as a `DOMAIN_MEMBER`, and marks the token as accepted.
*   **Eviction Hook:** Ensures that if user roles are dynamically modified, the Redis permission cache `org:{org_id}:usr:{user_id}:perms` is evicted instantly.

---

#### **3. Path B: Async CRM Deal Pipeline**
*   **Encapsulated Repository Layer:** Implement `ContactRepository` and `CrmDealRepository` using clean, async SQLAlchemy 2.0 select and execute syntax. 
*   **Query Filtering Hook:** Standardize a soft delete query condition (`deleted_at IS NULL`) and ensure that every deal and contact lookup query dynamically binds `organization_id == current_tenant_id` to enforce horizontal isolation.
*   **Role-Based Access Control (RBAC):**
    *   `POST`, `GET`, `PATCH` operations require `crm:write` permission (granted to both `TENANT_OWNER` and `DOMAIN_MEMBER`).
    *   `DELETE` operations (soft delete) require `crm:delete` permission (granted to `TENANT_OWNER` but **denied** to `DOMAIN_MEMBER`).
    *   `DOMAIN_MEMBER` users can view all deals in their organization but are restricted to modifying deals where they are explicitly assigned as the `owner_user_id` (Vertical Isolation).

---

#### **4. Angular 19/20: Drag-and-Drop Kanban Board**
*   **Kanban Board UI:** A responsive, glassmorphism Kanban view divided into pipeline stages: `LEAD`, `QUALIFIED`, `PROPOSAL`, `WON`, `LOST`.
*   **Tenant Injection Interceptor:** Integrates with your existing Angular Tenant HTTP Interceptor to dynamically append the active `X-Organization-Id` to all outbound CRM requests.
*   **Stateful Drag-and-Drop:** Dragging a deal card to a new column instantly updates the local reactive state using **Angular Signals** and transmits a debounced patch request to the backend to persist the stage change.

---

### **Verification Scenarios to Assert in Automated Tests**
1.  **Horizontal Isolation Check:** User A from Org 1 attempts to PATCH a deal belonging to Org 2, resulting in an immediate `ERR_TENANT_001` (403 Forbidden).
2.  **Vertical Isolation Check (Read):** A `DOMAIN_MEMBER` and a `TENANT_OWNER` inside the same organization can both read shared organization deals.
3.  **Vertical Isolation Check (Write):** A `DOMAIN_MEMBER` receives an `ERR_RBAC_001` (403 Forbidden) if they attempt to hard-delete or soft-delete any deal.
4.  **Transaction Integrity Check:** Accepting an invalid or expired invitation token aborts user creation, leaving zero orphaned database records.

***

Is this technical layout fully aligned with your architectural expectations, or would you like to refine any of the database structures before I write the official handoff prompt for Jules?
