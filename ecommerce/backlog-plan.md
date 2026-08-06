## **1. Sequential vs. Batch Assignment: Best Execution Strategy**

**Do not assign all 4 issues (`MVP-001` to `MVP-004`) to a single AI coding session at once.**

When AI coding agents (like Jules) receive multiple full-stack tasks simultaneously, their context window becomes saturated, leading to hallucinations, incomplete edits, and Git staging conflicts. More importantly, **there is a strict dependency between `MVP-002` and `MVP-003**`—the frontend Angular Signals cannot be safely wired to the dashboard until the backend `/api/v1/admin/dashboard` FastAPI router is implemented and returning a confirmed JSON schema.

### **Recommended 3-Step Execution Order**

If you want to maximize velocity while keeping Git branches clean, execute Milestone 1 in this sequence:

* **Step 1 (Parallel / Independent Batch):** Assign **`MVP-001`** (Checkout shipping address payload serialization) and **`MVP-004`** (Inline SVG fallback on catalog cards) first. These are standalone frontend fixes that do not depend on backend database schema changes.


* **Step 2 (Backend Endpoint):** Assign **`MVP-002`** (FastAPI `/api/v1/admin/dashboard` endpoint implementation). Verify via Swagger/Postman that it returns 200 OK before touching the UI.


* **Step 3 (Frontend Integration):** Assign **`MVP-003`** (Angular `DashboardService` `HttpClient` binding). Jules can now bind live signals to the endpoint created in Step 2.



---

## **2. GitHub Issues for Pending & Backlog Items (Milestones 2 & 3)**

Below are the production-ready GitHub issues formatted in Markdown for your remaining backlog items—including payment sandbox integration, admin dashboard KPIs, user administration, RBAC normalization, Redis caching, and automated CI/CD pipelines. You can copy and paste these directly into your repository.

---

### **Issue 5: `ENT-001` — Hosted Sandbox Payment Gateway Integration**

```markdown
### **Milestone:** Milestone 2 - Enterprise Transaction & RBAC
### **Labels:** `feature` `full-stack` `payments` `priority-high`

### **Objective**
Integrate a transactional payment gateway in test mode using Stripe or Razorpay so users can complete checkout flows in a sandbox environment[cite: 1].

### **Technical Specification**
1. **Backend (FastAPI):**
   - Configure Stripe Checkout (or Razorpay Sandbox) SDK in test mode[cite: 1].
   - Implement `/api/v1/orders/{order_id}/checkout-session` to generate a hosted checkout URL.
   - Implement a webhook endpoint `/api/v1/webhooks/payment` to verify signature payloads and transition order status from `Pending` to `Processing`[cite: 1].
2. **Frontend (Angular 19):**
   - Add a "Proceed to Payment" action on the order confirmation view that redirects to the generated sandbox session URL.
   - Handle success and cancellation redirect routes cleanly.

### **Definition of Done**
- [ ] Users can initiate a sandbox checkout session from a created order.
- [ ] Successful sandbox transactions automatically update the database order status from `Pending` to `Processing`[cite: 1].

```

---

### **Issue 6: `ENT-002` — Admin Dashboard Operations: Low-Stock Alerts & Recent Orders**

```markdown
### **Milestone:** Milestone 2 - Enterprise Transaction & RBAC
### **Labels:** `feature` `full-stack` `admin` `priority-medium`

### **Objective**
Provide specialized KPIs and operational tables for administrators to monitor low-stock inventory alerts and recent customer orders[cite: 1].

### **Technical Specification**
1. **Backend (FastAPI):**
   - Implement an Admin-only endpoint `/api/v1/admin/inventory/low-stock` returning products where `stock_quantity <= 10`[cite: 1].
   - Implement `/api/v1/admin/orders/recent` returning the 10 most recent orders with customer and status details[cite: 1].
2. **Frontend (Angular 19):**
   - Build a Standalone Admin Operations view protected by Admin JWT RBAC[cite: 1, 2].
   - Render two OnPush data tables: "Low-Stock Alerts" and "Recent Orders".

### **Definition of Done**
- [ ] Non-admin roles receive `403 Forbidden` when accessing operational endpoints or UI routes[cite: 2, 3].
- [ ] Low-stock items and the 10 newest orders populate accurately from database queries[cite: 1].

```

---

### **Issue 7: `ENT-003` — User Administration: Customer Directory & Status Management**

```markdown
### **Milestone:** Milestone 2 - Enterprise Transaction & RBAC
### **Labels:** `feature` `full-stack` `admin` `priority-medium`

### **Objective**
Implement administrative tools for managing customer lists and user account status[cite: 1].

### **Technical Specification**
1. **Backend (FastAPI):**
   - Create `/api/v1/admin/users` to return a paginated list of registered users.
   - Support filtering by user role (`Admin` / `Customer`) and account status (`Active` / `Disabled`).
2. **Frontend (Angular 19):**
   - Implement a Standalone Customer Directory component displaying user name, email, role, and registration date.

### **Definition of Done**
- [ ] Administrators can view all registered customer accounts in a clean directory table[cite: 1].
- [ ] User role and status metadata correctly reflect PostgreSQL database records[cite: 1].

```

---

### **Issue 8: `ENT-004` — RBAC Security: Normalize Role Name Comparisons to Enums**

```markdown
### **Milestone:** Milestone 2 - Enterprise Transaction & RBAC
### **Labels:** `security` `backend` `fastapi` `priority-high`

### **Objective**
Replace hardcoded, case-sensitive string matching for user roles with normalized Enum comparisons to prevent authorization edge-case failures[cite: 2, 3].

### **Technical Specification**
1. Inspect FastAPI role dependency checks (e.g., `require_admin`, `require_customer`)[cite: 2, 3].
2. Create a Python `Enum` for system roles (`ADMIN = "ADMIN"`, `CUSTOMER = "CUSTOMER"`).
3. Ensure user role validation explicitly normalizes database strings (`str.upper()`) against the Role Enum during JWT generation and route validation[cite: 2, 3].

### **Definition of Done**
- [ ] Backend authorization dependencies evaluate against Enums rather than hardcoded case-sensitive strings[cite: 2, 3].
- [ ] Customer and Admin role-protected endpoints continue to pass all RBAC security checks[cite: 1, 2].

```

---

### **Issue 9: `DEBT-001` — Redis Caching Wrappers in `ProductService**`

```markdown
### **Milestone:** Milestone 3 - Technical Debt & DevOps
### **Labels:** `performance` `backend` `redis` `priority-normal`

### **Objective**
Implement Redis caching wrappers for frequently queried product listings to achieve sub-second response times[cite: 1, 2].

### **Technical Specification**
1. Locate `ProductService.get_products` in the backend service layer[cite: 2, 3].
2. Add Redis `get/set` wrappers to check Redis 8 cache before querying PostgreSQL 17[cite: 1, 2].
3. Set a reasonable TTL (e.g., 300 seconds) and ensure cache invalidation triggers on product updates.

### **Definition of Done**
- [ ] Repeated calls to catalog endpoints serve data directly from Redis cache[cite: 1, 2].
- [ ] Product mutations properly invalidate or update corresponding Redis cache keys.

```

---

### **Issue 10: `DEBT-002` — Fix Component Projection Selectors in Jasmine Test Suite**

```markdown
### **Milestone:** Milestone 3 - Technical Debt & DevOps
### **Labels:** `testing` `frontend` `angular19` `priority-normal`

### **Objective**
Resolve the 3 failing unit tests in the frontend Karma/Jasmine test suite (`ErrorStateComponent` and `SearchToolbarComponent`) caused by brittle DOM projection selectors[cite: 2, 3].

### **Technical Specification**
1. Update testbed configurations for `ErrorStateComponent` and `SearchToolbarComponent`[cite: 2, 3].
2. Fix `TypeError: Cannot read properties of null (reading 'nativeElement')` by safely querying projected content slots inside `ViewChild`/`ContentChild` test fixtures[cite: 2, 3].

### **Definition of Done**
- [ ] Running `ng test` executes with 0 failures (134/134 tests passing)[cite: 2, 3].

```

---

### **Issue 11: `OPS-001` — Automated CI/CD Build & Lint Workflow with Status Badge**

```markdown
### **Milestone:** Milestone 3 - Technical Debt & DevOps
### **Labels:** `devops` `ci-cd` `automation` `priority-normal`

### **Objective**
Finalize GitHub Actions automation for builds, linting, and regression testing, displaying a passing build badge on the repository README[cite: 1].

### **Technical Specification**
1. Implement `.github/workflows/main.yml` triggered on push and pull requests to `main`[cite: 1].
2. **Backend Job:** Set up Python 3.12, install requirements, and execute linter and backend pytest suite[cite: 1].
3. **Frontend Job:** Set up Node.js, install dependencies, and run `ng build` (production build check)[cite: 1].
4. Embed the GitHub Actions status badge at the top of `README.md`.

### **Definition of Done**
- [ ] Pushing to the repository automatically triggers green CI pipelines for both backend and frontend[cite: 1].
- [ ] A dynamic, passing build badge renders clearly on the README file.

```

---

## **3. Complete Master Execution Track**

| Milestone | Task ID | Focus Area | Short Objective |
| --- | --- | --- | --- |
| **Milestone 1** | `MVP-001` | Checkout Flow | Serialize nested shipping address form group into flat request payload.

 |
| **Milestone 1** | `MVP-004` | Catalog UI | Add inline SVG image placeholder fallback to product list cards.

 |
| **Milestone 1** | `MVP-002` | Backend Dashboard | Implement `/api/v1/admin/dashboard` endpoint returning live KPI counts.

 |
| **Milestone 1** | `MVP-003` | Frontend Dashboard | Bind Angular `DashboardService` to `HttpClient` live endpoint.

 |
| **Milestone 2** | `ENT-001` | Payments | Integrate Stripe or Razorpay sandbox checkout session.

 |
| **Milestone 2** | `ENT-002` | Admin KPIs | Implement Low-Stock Alerts and Recent Orders admin data tables.

 |
| **Milestone 2** | `ENT-003` | User Admin | Implement customer directory table and user account status view.

 |
| **Milestone 2** | `ENT-004` | RBAC Security | Normalize case-sensitive role string matching to Python Enums.

 |
| **Milestone 3** | `DEBT-001` | Redis Caching | Add Redis caching get/set wrappers to `ProductService.get_products`.

 |
| **Milestone 3** | `DEBT-002` | Unit Tests | Fix `nativeElement` projection errors in 3 failing Jasmine unit tests.

 |
| **Milestone 3** | `OPS-001` | DevOps / CI | Configure automated build/lint GitHub Actions workflow and README badge.

 |
