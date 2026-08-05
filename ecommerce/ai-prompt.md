Here is the ready-to-use AI coding prompt for **Jules** to tackle **`RC1-FE-001` (Full-Stack Dashboard Live Metrics & Angular Signal Binding)**—the highest-priority logical starting point to eliminate mock data from your portfolio demo.

You can copy and paste the block below directly into your AI assistant or coding agent:

---

```markdown
# TASK: RC1-FE-001 — Full-Stack Dashboard Live Metrics & Angular Signal Binding

## 1. Context & Architecture
We are finalizing an Enterprise E-Commerce Platform currently at 98-99% completion in the RC1 Engineering Stabilization phase.
- **Backend:** Python 3.12, FastAPI, SQLAlchemy 2.x (Sync), PostgreSQL 17, Redis 8 (Modular Monolith / Clean Architecture: Routers -> Services -> Repositories).
- **Frontend:** Angular 19 using Standalone Components, Angular Signals for state management, and `OnPush` Change Detection.
- **Current Database State:** Seeded with 30 products, 8 orders, and 18 order items.

## 2. Objective
Conduct an end-to-end audit and implementation across both the backend and frontend to replace all remaining mock metrics on the Admin/User Dashboard with live data streams from our database. You must verify and fix both layers wherever needed.

## 3. Backend Responsibilities (FastAPI / SQLAlchemy / Redis)
1. **Audit Endpoints:** Inspect the dashboard/analytics router and corresponding service/repository layers.
2. **Verify Live Queries:** Ensure backend endpoints accurately query PostgreSQL (and utilize Redis caching where appropriate) to return real-time KPI metrics (e.g., total orders, total revenue, active products, and recent order counts) based on the seeded data (30 products, 8 orders, 18 order items).
3. **Fix Defects:** Remove any hardcoded or mock return values in the FastAPI service layer. Ensure response schemas (Pydantic models) are cleanly typed and formatted.

## 4. Frontend Responsibilities (Angular 19)
1. **Audit Dashboard Component:** Locate the Angular 19 Standalone Dashboard component and its corresponding data service.
2. **Bind Live Signals:** Replace all mock static variables with live `Signal` or `toSignal` bindings connected to the verified FastAPI dashboard endpoints.
3. **Preserve Performance:** Maintain strict `ChangeDetectionStrategy.OnPush` across the Dashboard component hierarchy.
4. **Error & Loading States:** Implement clean loading skeleton/spinner states and basic error handling if the API call fails.

## 5. Execution Steps & Definition of Done
- [ ] Step 1: Check and test backend dashboard API endpoints; fix any broken queries or mock responses.
- [ ] Step 2: Check Angular service HTTP calls and wire them to Angular Signals in the Dashboard component.
- [ ] Step 3: Verify end-to-end that the UI dynamically renders exact counts matching the database seeder (no mock numbers remaining).
- [ ] Step 4: Provide a brief summary of the files modified across both backend and frontend, along with the verification steps performed.

```

---

### **Why start with this prompt?**

* **Enforces Full-Stack Accountability:** It explicitly instructs the AI not to assume the backend is working, forcing it to inspect FastAPI routers, services, and repositories before touching the UI.


* **Protects Architectural Standards:** It mandates retaining **Angular 19 Standalone Components**, **Angular Signals**, and **OnPush Change Detection** so your portfolio code remains modern and clean.


* **Leverages Your Seed Data:** By referencing the exact **30 products, 8 orders, and 18 order items** already in your seeder, the AI can write precise assertion checks.
