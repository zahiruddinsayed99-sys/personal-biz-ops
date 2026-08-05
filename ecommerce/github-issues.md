Below is a set of production-ready **GitHub Issues** formatted in Markdown. You can copy and paste these directly into your repository's issue tracker or use them as tasks in GitHub Projects.

---

## **1. `RC1-FE-001` — [RC1] Full-Stack Dashboard Live Metrics & Angular Signal Binding**

```markdown
### **Title**
[RC1] Full-Stack Dashboard Live Metrics & Angular Signal Binding (#RC1-FE-001)

### **Labels**
`priority: highest` `layer: full-stack` `rc1-blocker` `angular19` `fastapi`

### **Assignee**
Jules

### **User Story / Objective**
As an Admin/Customer, I want the Dashboard KPIs to display live metrics from the database so that the platform reflects real-time business activity without relying on mock data.

### **Technical Requirements**
1. **Backend (FastAPI / SQLAlchemy / Redis):**
   - Audit and verify analytics/dashboard endpoints (`routers`, `services`, `repositories`).
   - Ensure queries return accurate KPI aggregates (Total Orders, Total Revenue, Active Products, Recent Orders) querying PostgreSQL 17 and Redis 8.
   - Test against seeded records (30 products, 8 orders, 18 order items).
2. **Frontend (Angular 19):**
   - Bind live API responses to **Angular Signals** (`toSignal` or writable `Signal`) in the Standalone Dashboard Component.
   - Ensure `ChangeDetectionStrategy.OnPush` remains intact.
   - Implement loading skeletons and error state fallbacks.

### **Definition of Done (Acceptance Criteria)**
- [ ] Backend endpoints return 100% dynamic, database-backed KPI numbers.
- [ ] Frontend Dashboard renders live metrics without any static/mock fallbacks.
- [ ] End-to-end verification confirms KPI counts match seeded records.

```

---

## **2. `RC1-FE-002` — [RC1] Product Catalog Visuals (`image_url`) Integration**

```markdown
### **Title**
[RC1] Product Catalog Cards `image_url` UI Integration (#RC1-FE-002)

### **Labels**
`priority: high` `layer: frontend` `rc1-blocker` `ui/ux`

### **User Story / Objective**
As a Customer, I want to see actual product images on catalog cards so that I can visually browse and select products instead of seeing gray placeholder boxes.

### **Technical Requirements**
1. **Frontend (Angular 19):**
   - Update the Standalone Product Card component template to bind the existing backend `image_url` property.
   - Implement a CSS/HTML fallback (default placeholder image) if an image URL fails to load (`@error` event handling).
   - Maintain responsive card layout and aspect ratios across grid views.

### **Definition of Done (Acceptance Criteria)**
- [ ] Product cards render the image specified in the `image_url` payload from the catalog API.
- [ ] Broken or missing URLs gracefully fall back to a styled default image without breaking the layout.
- [ ] All 30 seeded catalog items display cleanly in desktop and mobile viewport sizes.

```

---

## **3. `RC1-FE-003` — [RC1] Checkout Shipping Address Reactive Form & Persistence**

```markdown
### **Title**
[RC1] Checkout Shipping Address Reactive Form & Backend Persistence (#RC1-FE-003)

### **Labels**
`priority: high` `layer: full-stack` `rc1-blocker` `orders-module`

### **User Story / Objective**
As a Customer placing an order, I want to input and validate my shipping address during checkout so that delivery metadata is permanently recorded with my order.

### **Technical Requirements**
1. **Frontend (Angular 19):**
   - Complete the **Reactive Form** implementation in the Checkout Component (fields: Street Address, City, State/Province, Postal Code, Country).
   - Add frontend validation (required fields, postal code pattern matching).
   - Include the validated address payload in the order creation API request.
2. **Backend (FastAPI / SQLAlchemy):**
   - Verify that the Order creation endpoint accepts and persists the shipping address JSON/relational metadata to PostgreSQL 17.

### **Definition of Done (Acceptance Criteria)**
- [ ] Users cannot submit an order without completing required shipping address fields.
- [ ] Created orders successfully store shipping address metadata in the database.
- [ ] Shipping address is visible when inspecting order details in the backend/order history.

```

---

## **4. `PAY-001` — [Portfolio MVP] Sandbox Payment Gateway Integration**

```markdown
### **Title**
[Portfolio MVP] Hosted Sandbox Payment Gateway Integration (#PAY-001)

### **Labels**
`priority: medium` `layer: full-stack` `portfolio-mvp` `integrations`

### **User Story / Objective**
As a Customer, I want to complete my purchase through a test payment gateway so that the platform demonstrates transactional e-commerce workflows.

### **Technical Requirements**
1. **Backend (FastAPI):**
   - Integrate **Stripe Checkout** (or Razorpay Sandbox) in test mode.
   - Create an endpoint to generate a checkout session URL for a given order ID.
   - Add a webhook/callback endpoint to verify payment success and transition order status from `Pending` to `Processing`.
2. **Frontend (Angular 19):**
   - Add a "Proceed to Payment" action on the Checkout confirmation screen that redirects users to the hosted test checkout session.
   - Handle success and cancellation redirect URLs cleanly.

### **Definition of Done (Acceptance Criteria)**
- [ ] Users can trigger a test checkout session from a pending order.
- [ ] Completing a test transaction updates the order status in PostgreSQL from `Pending` to `Processing`.
- [ ] Webhook signature verification or callback validation is implemented securely.

```

---

## **5. `ADM-001` — [Portfolio MVP] Lite Admin Dashboard (Low-Stock & Recent Orders)**

```markdown
### **Title**
[Portfolio MVP] Lite Admin Dashboard: Low-Stock Alerts & Recent Orders (#ADM-001)

### **Labels**
`priority: medium` `layer: full-stack` `portfolio-mvp` `rbac`

### **User Story / Objective**
As an Admin, I want to view a specialized dashboard showing low-stock products and recent orders so that I can monitor critical inventory and sales operations.

### **Technical Requirements**
1. **Backend (FastAPI):**
   - Protect endpoints using existing **RBAC (Admin Role only)**.
   - Add a lightweight query/endpoint for products where `stock_quantity <= threshold` (e.g., `< 10`).
   - Add a query/endpoint returning the 10 most recent orders with customer and status details.
2. **Frontend (Angular 19):**
   - Create a Standalone Admin View component accessible only via Admin JWT claims.
   - Display two clean, responsive data tables: "Low-Stock Alerts" and "Recent Orders".

### **Definition of Done (Acceptance Criteria)**
- [ ] Non-admin users are blocked from accessing the endpoints and UI route (`403 Forbidden`).
- [ ] Low-stock products and the 10 newest orders render accurately from live database queries.

```

---

## **6. `OPS-001` — [DevOps] CI/CD Build & Lint Workflow with Status Badge**

```markdown
### **Title**
[DevOps] Automated CI/CD Build & Lint Pipeline with README Badge (#OPS-001)

### **Labels**
`priority: normal` `layer: devops` `portfolio-mvp` `ci/cd`

### **User Story / Objective**
As a developer/recruiter inspecting the repository, I want automated CI checks and a visual build badge so that code quality and containerization integrity are continuously verified.

### **Technical Requirements**
1. **GitHub Actions Workflow (`.github/workflows/main.yml`):**
   - Configure jobs to run on `push` and `pull_request` to the `main` branch.
   - **Backend Job:** Set up Python 3.12, install dependencies, and run syntax/linting checks (e.g., `flake8` or `ruff`) and core unit tests.
   - **Frontend Job:** Set up Node.js, install Angular 19 dependencies, and execute a headless production build check (`ng build`).
2. **Documentation:**
   - Embed the GitHub Actions status badge at the top of `README.md`.

### **Definition of Done (Acceptance Criteria)**
- [ ] Pushing to the repository triggers backend and frontend pipeline jobs automatically.
- [ ] Pipeline passes cleanly on working code and fails on syntax/build errors.
- [ ] A green passing status badge is visible on the repository README.

```

---

### **Recommended Execution Order Table**

| Order | Issue ID | Module | Why Do This Next |
| --- | --- | --- | --- |
| **1** | `#RC1-FE-001` | Dashboard | Clears the highest-priority RC1 blocker and removes mock data. |
| **2** | `#RC1-FE-002` | Catalog Visuals | Immediately polishes the UI browsing experience for demos. |
| **3** | `#RC1-FE-003` | Checkout | Completes the core customer purchase flow and RC1 stabilization. |
| **4** | `#PAY-001` | Payments | Proves end-to-end e-commerce transactional readiness. |
| **5** | `#ADM-001` | Admin RBAC | Demonstrates role-based security and backend modularity. |
| **6** | `#OPS-001` | DevOps / CI | Provides the final presentation polish for portfolio reviewers. |
