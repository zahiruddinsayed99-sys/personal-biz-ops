### **Architectural Audit: Milestone 8 (CRM AI Copilot & Lead Scoring) — Approved & Signed Off**

This is an exceptional delivery. The engineering team has executed the final 25% of **Module 2 (CRM Engine)** with outstanding precision. By cleanly integrating our **Centralised AI Platform (Milestone 7)**, you have turned a standard lead tracker into a highly competitive, enterprise-ready CRM pipeline.

Several implementation details are particularly noteworthy from an architectural and security standpoint:
1. **Asynchronous Context Isolation:** Encapsulating the async database connections inside `asyncio.run()` with safe fallback triggers inside the Celery worker thread successfully bypasses SQLAlchemy connection pool conflicts, securing background worker stability.
2. **Pre-Flight Credit Metering Check-and-Increment:** Wrapping the `/api/v1/crm/` AI endpoints in our atomic database transaction middleware completely locks down the **Time-of-Check to Time-of-Use (TOCTOU) race condition**, securing billing credits even under concurrent user spam.
3. **Closing the IDOR Leak:** Your proactive fix requiring that the target `deal_id` matches the requesting tenant's `organization_id` before performing credit deductions is an exemplary application of our zero-trust horizontal isolation rules.
4. **Snappy Optimistic UI:** Managing drag-and-drop column changes, debouncing backend updates via RxJS, and gracefully rolling back card columns via Signals on error ensures an elite, modern user experience.

---

### **Project Status Board: Progress Against Software Requirements (SRS)**

With Module 0, Module 1, and Module 2 completely checked off, we are transitioning to **Module 3: E-Commerce & Inventory Management**.

| Module ID | Module Name | Major Functional Requirements | Completion % | Release Status |
| :--- | :--- | :--- | :---: | :--- |
| **Module 0** | **Core Platform, Auth & Multi-Tenancy** | Onboarding, JWT, Redis Sessions, Isolation Middleware | **100%** | **Completed & Merged** |
| **Module 1** | **Billing & Subscription Engine** | Stripe SDK (INR/GST), Webhook Idempotency, Usage Metering | **100%** | **Completed & Verified** |
| **Module 2** | **CRM Engine** | Pipeline (Kanban), Contacts, Team Invites, AI Lead Scoring | **100%** ✅ | **Completed & Merged** |
| **Module 3** | **E-Commerce & Inventory** | Catalog, Multi-Warehouse, Atomic Stock, Cloudflare R2 | **0%** | **Up Next (Milestone 9)** 🎯 |
| **Module 4** | **LMS Engine** | Course Builder, AI Quiz Generator | **0%** | Backlogged |
| **Module 5** | **Centralized AI Platform** | Universal RAG, Document processing, Vector isolation | **100%** | **Completed & Merged** |

---

### **The Blueprint for Milestone 9: Multi-Tenant E-Commerce & Multi-Warehouse Inventory**

To transition the platform into **Module 3: E-Commerce & Inventory Management**, we will tackle core catalog tracking, multi-warehouse stock allocations, and secure object storage uploads. 

We will structure **Milestone 9** around these technical requirements:
1. **Multi-Warehouse Relational Schema (`FR-ECIN-01`):** Core catalog structures isolating `products`, `warehouses`, and `inventory_items` across multi-tenant boundaries.
2. **S3-Compatible Object Storage Contract (MinIO / Cloudflare R2):** A secure media-upload service granting tenants pre-signed R2/MinIO upload URLs with strict path boundaries: `s3://businesshub-media/{organization_id}/ecommerce/{year}/{uuid}_{filename}`.
3. **Atomic Stock Allocation with Negative Stock Prevention (`BR-INV-001`):** Order routing transactions that check stock balances and reserve inventory atomically, returning a database-level `409 Conflict` (code `ERR_VALIDATION_001` or custom domain exception) on stock-outs to prevent race-condition order fulfillment.
4. **Angular Inventory Dashboard:** Standalone views enabling domain managers to track stock velocities, manage multi-warehouse thresholds, and upload product catalog imagery.

---

### **GitHub Issues for Milestone 9 Sprint Planning**

#### **Issue 1: Database Migration for Multi-Warehouse E-Commerce Inventory Schema**
*   **Type:** 🛠️ Migration (Backend)
*   **Track:** `track/9-inventory-core`
*   **Description:** Implement the physical database schemas for products, warehouses, and the active inventory junction table, adhering to our pluralized `snake_case` contracts and tenant isolation parameters.

##### **Technical Scope & Specifications**
1. **Alembic Migration:**
    * **`products` Table:** `id` (UUID PK), `organization_id` (UUID FK to organizations, cascade delete), `name` (VARCHAR), `sku` (VARCHAR, Indexed), `description` (TEXT), `price` (NUMERIC), `image_url` (VARCHAR, Nullable), standard audit and soft-delete timestamps (`deleted_at`).
    * **`warehouses` Table:** `id` (UUID PK), `organization_id` (UUID FK to organizations, cascade delete), `name` (VARCHAR), `location_code` (VARCHAR), standard audit and soft-delete timestamps.
    * **`inventory_items` Table (Junction):** `id` (UUID PK), `organization_id` (UUID FK), `product_id` (UUID FK referencing products), `warehouse_id` (UUID FK referencing warehouses), `quantity` (INTEGER, Default `0`), standard audit timestamps.
    * **Constraints:** Add a partial unique index on `inventory_items(organization_id, product_id, warehouse_id)` to prevent duplicate mapping rows per warehouse.
2. **SQLAlchemy 2.0 Repositories:**
    * Create `ProductRepository` and `WarehouseRepository` using async select and execute syntax. Ensure all filters enforce `organization_id == current_tenant_id` and `deleted_at IS NULL`.

##### **Definition of Done (DoD)**
- [ ] Migration runs cleanly on `alembic upgrade head` and rolls back on `alembic downgrade -1`.
- [ ] Pytest integration validates that looking up inventory items automatically scopes to the active tenant.

---

#### **Issue 2: Cloudflare R2/MinIO Pre-Signed Upload Endpoint**
*   **Type:** 🔒 Security & Feature (Backend)
*   **Track:** `track/9-inventory-core`
*   **Dependencies:** Issue 1

##### **Description**
Deploy a secure storage API authorizing B2B tenant owners and domain managers to acquire pre-signed object upload links, enforcing directory partitioning per tenant workspace.

##### **Technical Scope & Specifications**
1. **POST `/api/v1/storage/presigned-upload`:**
    * Payload format: `{"file_name": "product_hero.png", "mime_type": "image/png", "module": "ecommerce"}`.
    * Validate file extension (restrict to standard imagery: `png`, `jpg`, `jpeg`, `webp`).
    * Construct the multi-tenant storage key template: `s3://businesshub-media/{organization_id}/ecommerce/{year}/{uuid}_{filename}`.
    * Use the pre-configured local MinIO client (or AWS S3 SDK) to generate a secure `PUT` pre-signed URL with a 15-minute expiration.
2. **Access Security:**
    * Protect the route using the `RequiresPermission("inventory:write")` dependency block.

##### **Definition of Done (DoD)**
- [ ] Endpoints return JSON payloads mapping `upload_url` and `storage_path` matching our external integration contract.
- [ ] Security test confirms that unauthenticated sessions or users lacking proper permissions receive an HTTP 403 `ERR_RBAC_001` error.

---

#### **Issue 3: Atomic Order Reservation Subsystem (Negative Stock Prevention)**
*   **Type:** 🔒 Security & Infrastructure (Backend)
*   **Track:** `track/9-inventory-core`
*   **Dependencies:** Issue 1

##### **Description**
Develop the order fulfillment pipeline to perform transactional stock checks, atomically decrementing inventory levels during order placements while completely blocking negative balances.

##### **Technical Scope & Specifications**
1. **Schema DDL Extensions:**
    * **`orders` Table:** `id` (UUID PK), `organization_id` (UUID FK), `status` (VARCHAR, e.g., `'PENDING'`, `'COMPLETED'`), standard audit and soft-delete columns.
    * **`order_items` Table:** `id` (UUID PK), `organization_id` (UUID FK), `order_id` (UUID FK to orders), `product_id` (UUID FK), `quantity` (INTEGER), `price` (NUMERIC).
2. **POST `/api/v1/ecommerce/orders` (Atomic Stock Checkout):**
    * Accepts an array of product IDs, warehouse IDs, and purchase quantities.
    * Execute the stock checkout routine inside an **async database transaction context**:
        1. Query the matching warehouse stock rows using a pessimistic write-lock: `SELECT quantity FROM inventory_items WHERE product_id = :p_id AND warehouse_id = :w_id FOR UPDATE`.
        2. Verify that `quantity >= requested_qty`. If any item violates this condition (breaching rule `BR-INV-001`), raise a **409 Conflict** with message code `ERR_VALIDATION_001` and abort/roll back the entire transaction.
        3. On success, decrement `inventory_items.quantity`, create the `Order` record, and populate `order_items`.

##### **Definition of Done (DoD)**
- [ ] Concurrency test executes parallel orders against a single inventory item and verifies that the database successfully prevents overselling.
- [ ] Database transaction rolls back cleanly on stock conflicts, leaving zero orphaned orders or corrupt entries.

---

#### **Issue 4: Angular Standalone Stock Management & Image Uploader UI**
*   **Type:** 🎨 Feature (Frontend)
*   **Track:** `track/9-inventory-core`
*   **Dependencies:** Issue 2

##### **Description**
Build the standalone Angular interface for warehouse inventory management and product registration, including drag-and-drop file uploaders resolving pre-signed R2 URLs.

##### **Technical Scope & Specifications**
1. **UI Layout:**
    * Standalone components with `ChangeDetectionStrategy.OnPush` and `inject()` dependency architecture.
    * Catalog dashboard rendering active inventory quantities, warehouse locations, and low-stock indicators.
2. **Product Image Uploader Widget:**
    * Implement an interactive drag-and-drop uploader. On file drop:
        1. Dispatch a request to `/api/v1/storage/presigned-upload` to retrieve the pre-signed URL.
        2. Perform a direct HTTP `PUT` upload from the browser to MinIO using the returned `upload_url`.
        3. On upload resolution, bind the `storage_path` to the product creation form's `image_url` field.
3. **Reactive Signals:**
    * Bind active stock selections and warehouse filtering to local Signals to ensure low-latency reactivity.

##### **Definition of Done (DoD)**
- [ ] Front-end code builds successfully without any style budget warnings.
- [ ] Verified that uploading an image successfully writes to the local MinIO bucket and correctly populates database records.

---

### 📋 Copy-Paste Prompt for Jules / Antigravity

```markdown
USER_REQUEST:
We are starting Milestone 9: Multi-Tenant E-Commerce & Multi-Warehouse Inventory (Module 3 Core).
The goal of this track is to implement the relational schemas for our product catalog and multi-warehouse structures, build the pre-signed S3-compatible media uploader (MinIO/R2), and implement the atomic stock checkout transaction to enforce negative stock prevention (BR-INV-001).

Please execute the following tasks on a clean feature branch off 'develop':

1. GIT BRANCH & WORKFLOW
- Create and switch to a new local feature branch off 'develop' named exactly: track/9-inventory-core
- Follow strict Human-in-the-Loop guidelines: Do NOT attempt to push directly to 'main' or 'develop'. All deliverables must be prepared for a Draft Pull Request.
- All commit messages must follow the Conventional Commits specification.

2. MULTI-WAREHOUSE RELATIONAL SCHEMA (Alembic Migration)
- Generate an Alembic database migration to create these tables with UUID v4 PKs and organization_id FKs:
  * 'products': id, organization_id, name, sku (Indexed), description, price (NUMERIC), image_url, standard audit and soft-delete ('deleted_at') columns.
  * 'warehouses': id, organization_id, name, location_code, standard audit and soft-delete columns.
  * 'inventory_items': id, organization_id, product_id (FK to products), warehouse_id (FK to warehouses), quantity (INTEGER, Default 0), standard audit columns.
  * Create a Partial Unique Index on 'inventory_items(organization_id, product_id, warehouse_id)'.
- Implement 'ProductRepository' and 'WarehouseRepository' utilizing Async SQLAlchemy 2.0 select syntax. Ensure all queries filter by 'organization_id == current_tenant_id' and 'deleted_at IS NULL'.

3. SECURE MEDIA STORAGE INTEGRATION (MinIO / Cloudflare R2)
- Expose 'POST /api/v1/storage/presigned-upload':
  * Restricted to users with the 'inventory:write' permission scope.
  * Accepts 'file_name', 'mime_type', and 'module'. Restrict mime-types strictly to standard images (png, jpg, jpeg, webp).
  * Build the multi-tenant key path: 's3://businesshub-media/{organization_id}/ecommerce/{year}/{uuid}_{filename}'.
  * Initialize the S3 client using environment configurations and return a secure PUT 'upload_url' and 'storage_path' with a 15-minute TTL.

4. ATOMIC CHECKOUT & NEGATIVE STOCK PREVENTION (BR-INV-001)
- Create 'orders' and 'order_items' database tables mapped securely to the organization context.
- Expose 'POST /api/v1/ecommerce/orders':
  * Accepts an array of checkout items (product_id, warehouse_id, quantity).
  * Run the checkout routine inside an async transaction block. Inside the transaction:
    1. Query the corresponding 'inventory_items' rows applying a pessimistic write-lock ('FOR UPDATE').
    2. Enforce BR-INV-001: Validate 'quantity >= requested_quantity'. If any item fails this check, abort/roll back the entire transaction and raise an HTTP 409 Conflict with system code 'ERR_VALIDATION_001'.
    3. Update the quantities, save the 'Order', and populate 'order_items'.

5. ANGULAR STANDALONE STOCK DASHBOARD & IMAGE UPLOADER UI
- Implement the standalone components using Angular Signals and OnPush change detection.
- Build an interactive Product Registration Form containing a Drag-and-Drop Image Uploader:
  * On image drop, request the pre-signed URL from the backend and execute a direct HTTP PUT upload to the storage bucket.
  * Bind the resolved image path to the product record creation payload.
- Create a Warehouse Inventory Viewer rendering low-stock thresholds reactively.

6. INTEGRATION TESTING GATES
- Write comprehensive async integration tests in 'backend/tests/':
  * Verify unauthenticated or unauthorized users are blocked from generating pre-signed URLs with a 403.
  * Verify cross-tenant requests on catalog/warehouse records return an HTTP 404 'ERR_NOT_FOUND_001' (Horizontal Isolation).
  * Verify a concurrency test suite executing simultaneous checkout requests on limited stock triggers a 409 Conflict and rolls back atomically without overselling.

When complete, verify all tests pass locally (pytest -v), commit your work to 'track/9-inventory-core', and submit a Draft Pull Request.
```

***

Once Jules initiates this feature branch, we will be poised to audit their database row-locking mechanics, MinIO pre-signed URL generations, and transaction rollback boundaries. Let me know when you are ready to kick off this sprint!
