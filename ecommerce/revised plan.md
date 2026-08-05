Treating this as a **portfolio project** changes the game entirely. Prospective employers, recruiters, and clients do not judge a portfolio by how many administrative sub-features it has; they judge it on **end-to-end user journeys, visual polish, and technical maturity**.

To complete "all pending items" with maximum speed and **minimum fluff for customer value**, you must apply a **Portfolio MVP (Minimum Viable Product) Cut**. Here is your fresh plan to finish the platform so it shines in a demo without getting trapped in low-ROI development.

---

## **1. The "Customer Value" Scope Trim (What to Build vs. What to Simplify)**

| Module / Feature | Original Scope

 | **Portfolio MVP Cut (What You Actually Need)** | Why It Matters for Your Portfolio |
| --- | --- | --- | --- |
| **Dashboard & Visuals** | Live Angular Signals & `image_url` on catalog cards.

 | **100% Complete as planned.**<br> | Broken images and mock metrics are immediate red flags in a portfolio demo.

 |
| **Shipping Address** | Checkout Reactive Form for address persistence.

 | **100% Complete as planned.**<br> | Proves full-stack data capture and form validation.

 |
| **Payment Gateway** | Stripe or Razorpay integration in test mode.

 | **Hosted Checkout Session (Stripe/Razorpay Sandbox).** | You only need a redirect to a sandbox payment page and a successful webhook/callback update to prove transactional logic.

 |
| **Admin Dashboard** | KPIs for low-stock, recent orders, and quick actions.

 | **Lite Admin Screen (Low-Stock + Recent Orders table only).**<br> | Demonstrates your **RBAC (Role-Based Access Control)** actually works by contrasting Admin vs. Customer views. Skip complex "quick actions".

 |
| **User Administration** | Managing customer lists and user status.

 | **Read-Only Customer Directory.** | A simple table listing registered customers is enough to show database relationship maturity. Skip ban/edit user workflows.

 |
| **CI/CD Automation** | Comprehensive regression testing, build, and linting pipelines.

 | **Simple GitHub Action Badge (Build + Lint only).**<br> | Hiring managers look for a green workflow badge on your README; they rarely inspect complex regression test suites.

 |

---

## **2. Your 4-Step Finish-Line Execution Plan**

### **Step 1: The Visual & Checkout Front Door (Days 1–2)**

*The goal is a seamless, visual e-commerce shopping experience from catalog to checkout.*

* **Task 1.1 (`image_url` Integration):** Wire up the product image URLs on the Angular catalog cards. Ensure fallback styling if an image link fails.


* **Task 1.2 (Shipping Reactive Form):** Finish the Checkout form so users can input and persist their shipping address to the backend.


* **Task 1.3 (`RC1-FE-001` Dashboard Signals):** Verify both FastAPI endpoints and Angular Standalone Components so the Dashboard shows live numbers from your seeder (30 products, 8 orders, 18 order items).



### **Step 2: The E-Commerce Transaction Proof (Day 3)**

*A catalog without payments is just a website; sandbox payments make it an enterprise platform.*

* **Task 2.1 (Sandbox Payment Gateway):** Integrate Stripe or Razorpay Checkout in test mode.


* **Task 2.2 (Order Status Update):** When the sandbox checkout succeeds, update the order status lifecycle from `Pending` to `Processing`.



### **Step 3: The Role-Based Access Proof (Day 4)**

Showcase your clean backend architecture and JWT/RBAC security by adding a minimal admin area.

* **Task 3.1 (Lite Admin Dashboard):** Build a simple admin screen displaying two components: a table of **Recent Orders** and a **Low-Stock Alert** list (querying products where stock is below a threshold).


* **Task 3.2 (Customer Directory):** Add a basic read-only view for admins to list registered customers.



### **Step 4: Portfolio Polish & Green Badge (Day 5)**

*Make the GitHub repository look production-ready.*

* **Task 4.1 (Lite CI/CD):** Add a `.github/workflows/main.yml` that runs a Docker build check or a basic Python linting/test script.


* **Task 4.2 (README Documentation):** Document your Clean Architecture (Routers/Services/Repositories), Docker Compose instructions, and a short GIF/screenshot of the working payment flow.



---

Which payment gateway sandbox—Stripe or Razorpay—would you like to prioritize so we can draft the simplest, highest-value integration steps for it first?
