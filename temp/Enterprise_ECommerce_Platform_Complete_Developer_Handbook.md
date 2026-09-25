# Enterprise E-Commerce Platform
## Complete Developer Handbook

**Portfolio Project • Skill Mastery • Interview Preparation • Offline Reference**

> **Reader goal:** By the end of this handbook, a junior developer should be able to explain what this project does, how the pieces fit together, why important engineering decisions were made, how checkout stays financially and technically correct, how the system is tested, and how to discuss the project confidently in an interview.

---

## How to Use This Handbook

This is the **consolidated learning/reference document** for the E-commerce portfolio project.

It intentionally combines the useful parts of the project's functional specifications, architecture material, API notes, developer cheatsheet, testing/runbooks, deployment material, vocabulary, and interview preparation into one readable flow.

The repository remains the final authority for exact current code signatures. This handbook is the place to understand the **system, engineering decisions, workflows, and interview story** without jumping between many source documents.

### Reading paths

**New to the project:** read Parts 1–6 in order.

**Preparing for an interview:** read Parts 1, 3, 6, 8, 10 and 11.

**Working on the code:** use Parts 4, 5, 7 and 9.

**Troubleshooting/testing:** jump to Parts 9 and 10.

---

# Part 1 — Meet the Project

## 1. Project Story

The Enterprise E-Commerce Platform is a full-stack shopping and administration application.

At the business level, it connects:

- product discovery
- search and filtering
- cart management
- checkout
- payment
- inventory
- customer order history
- administrator product and inventory management
- order fulfillment
- dashboard information

The interesting part is not simply creating CRUD endpoints. The project demonstrates how to keep **business data correct when real-world operations interact**.

For example:

> A customer buys a product while another customer is trying to buy the last unit at almost the same time.

A production-minded system cannot simply read the stock value, subtract one, and hope for the best.

The project therefore uses database transactions and row-level locking around inventory-sensitive operations.

### The central engineering story

```text
Customer
   ↓
Catalog
   ↓
Cart
   ↓
Checkout
   ↓
Payment
   ↓
Inventory + Order Transaction
   ↓
Order Confirmation
   ↓
Customer History
```

And for administrators:

```text
Admin
  ↓
Dashboard
  ↓
Catalog / Inventory
  ↓
Order Management
  ↓
Fulfillment Status
```

---

## 2. Why This Is a Valuable Portfolio Project

This project demonstrates more than framework knowledge.

It brings together:

- REST API development
- authentication and authorization
- relational database design
- ORM usage
- transactions
- concurrency control
- payment integration
- frontend state management
- testing
- end-to-end automation
- deployment and operations

A useful way to describe the project is:

> **A transaction-aware E-commerce system built to demonstrate full-stack engineering, not just UI and CRUD development.**

---

# Part 2 — Technology & Project Shape

## 3. Technology Stack

| Layer | Technology | Role |
|---|---|---|
| Frontend | Angular 19 | Customer/Admin SPA |
| UI | Angular Material | Consistent interface components |
| Frontend state | Signals + RxJS | Reactive application state |
| Backend | FastAPI | REST API |
| Language | Python | Backend implementation |
| Validation | Pydantic v2 | Request/response DTOs |
| ORM | SQLAlchemy 2.x | Database access |
| Database | PostgreSQL | Persistent relational data |
| Migration | Alembic | Schema versioning |
| Cache | Redis | Cache/coordination use cases |
| Payments | Razorpay | Payment gateway |
| Unit/integration tests | Pytest | Backend verification |
| E2E | Playwright | Browser workflow verification |
| Containers | Docker | Local/production environment consistency |
| Hosting described in project docs | Vercel + Render + Supabase | Frontend/backend/database hosting |

The master project reference describes Angular 19 with Material UI, Signals/RxJS, FastAPI with dependency injection and service/repository patterns, Supabase PostgreSQL managed by Alembic, Redis, and Razorpay. 

> **Important implementation baseline:** project documentation contains some alternative/proposed references to technologies such as Celery and different PostgreSQL/Redis versions. Those are not treated as implemented features here. The portfolio baseline for this handbook is **Angular 19 + FastAPI + PostgreSQL + Redis + Razorpay + FastAPI BackgroundTasks where background execution is needed; Celery is not presented as implemented.**

---

## 4. The Project in One Picture

```text
┌───────────────────────────────────────────────────────────┐
│                    Angular 19 SPA                         │
│  Standalone Components • Signals • RxJS • Material UI     │
└─────────────────────────────┬─────────────────────────────┘
                              │ HTTPS / REST + JWT
                              ▼
┌───────────────────────────────────────────────────────────┐
│                     FastAPI API                           │
│       Routers • Pydantic DTOs • Dependencies              │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│                    Service Layer                           │
│  Business Rules • Checkout • Payment • Order • Inventory  │
└───────────────┬───────────────────────────────┬───────────┘
                │                               │
                ▼                               ▼
┌───────────────────────────┐       ┌───────────────────────┐
│       Repositories        │       │        Redis          │
│   SQLAlchemy persistence  │       │ Cache / coordination  │
└───────────────┬───────────┘       └───────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────┐
│                    PostgreSQL                             │
│ Users • Products • Cart • Orders • Payments • Inventory   │
└───────────────────────────────────────────────────────────┘

                    External Integration
                            │
                            ▼
                       Razorpay
```

---

# Part 3 — Understand the Business

## 5. Main Actors

### Customer

A customer can:

1. register/login
2. browse products
3. search/filter products
4. view product details
5. add products to the cart
6. adjust quantities
7. checkout
8. complete payment
9. receive order confirmation
10. view order history
11. track order status

### Administrator / Merchant

An administrator can:

1. access the admin area
2. view dashboard metrics
3. manage products
4. manage stock
5. inspect orders
6. transition order statuses
7. support fulfillment operations

### Payment Gateway

Razorpay participates in payment processing and confirmation. The backend must validate the payment confirmation data before treating the payment as trusted.

---

## 6. Core Modules

```text
Authentication
      │
      ├── Customer
      └── Administrator
             │
             ▼
          Catalog
             │
             ▼
            Cart
             │
             ▼
          Checkout
             │
       ┌─────┴─────┐
       ▼           ▼
    Payment     Inventory
       │           │
       └─────┬─────┘
             ▼
           Order
             │
             ▼
      Order History
             │
             ▼
      Admin Fulfillment
```

---

## 7. Customer Journey

### Normal shopping flow

```text
Open Store
    ↓
Browse/Search
    ↓
Product Details
    ↓
Add to Cart
    ↓
Adjust Quantity
    ↓
Checkout
    ↓
Validate Cart + Stock
    ↓
Create/Process Order
    ↓
Payment
    ↓
Verify Payment
    ↓
Confirm Order
    ↓
View Order History
```

### What can go wrong?

A good developer thinks about failure paths as well:

- product no longer exists
- requested quantity exceeds stock
- authentication expires
- payment fails
- payment confirmation is invalid
- database transaction fails
- duplicate payment notification arrives
- another customer consumes the stock first

Those cases are where the project's engineering decisions become important.

---

# Part 4 — Architecture

## 8. Architectural Philosophy

The project follows a modular layered approach rather than spreading every concern across every layer.

The core idea is:

```text
Router
  ↓
Service
  ↓
Repository
  ↓
Database
```

### Router

Responsible for:

- HTTP endpoint
- authentication dependency
- request/response boundary
- calling the appropriate service

### Service

Responsible for:

- business rules
- validation that depends on business state
- checkout logic
- order creation
- payment workflow
- inventory rules
- transaction coordination

### Repository

Responsible for:

- persistence
- SQLAlchemy queries
- fetching/saving entities

> **Rule:** repositories should not become the place where business decisions are hidden.

---

## 9. DTOs and Entities

Pydantic DTOs provide a clean API boundary.

Conceptually:

```text
HTTP JSON
   ↓
Pydantic Request DTO
   ↓
Service
   ↓
SQLAlchemy Entity
   ↓
Repository / Database
   ↓
SQLAlchemy Entity
   ↓
Pydantic Response DTO
   ↓
HTTP JSON
```

This separation makes the API contract clearer and prevents raw request dictionaries from becoming the internal application model.

---

## 10. Request Lifecycle

A typical authenticated request looks like:

```text
Browser
  ↓
Angular Service
  ↓
HTTP Interceptor
  ↓
Bearer JWT
  ↓
FastAPI Router
  ↓
Dependency / Auth Check
  ↓
Pydantic Validation
  ↓
Service
  ↓
Repository
  ↓
PostgreSQL
  ↓
Response DTO
  ↓
Angular
```

This is one of the most useful diagrams to remember for interviews.

---

# Part 5 — Security

## 11. Authentication

The project uses JWT-based authentication.

A simplified flow:

```text
Login
  ↓
Credentials validated
  ↓
JWT issued
  ↓
Frontend stores/uses authentication state
  ↓
HTTP interceptor adds Authorization header
  ↓
Protected API validates token
```

### Junior mental model

A JWT is not the user's password.

It is a signed token that allows the backend to identify and authorize a request according to the configured authentication rules.

---

## 12. Authorization and RBAC

Authentication answers:

> **Who are you?**

Authorization answers:

> **What are you allowed to do?**

For example:

```text
Customer
  ├── Browse products
  ├── Manage own cart
  └── View own orders

Administrator
  ├── Manage products
  ├── Manage inventory
  └── Manage order status
```

Never rely only on hiding an Angular button. The backend must enforce authorization.

---

## 13. Security Checklist

Important areas include:

- validate request payloads
- protect privileged endpoints
- verify ownership of customer resources
- validate payment signatures
- never hardcode secrets
- use environment variables
- avoid exposing internal exceptions
- validate IDs and permissions server-side
- test unauthorized access
- test IDOR-style access attempts

---

# Part 6 — Data Layer

## 14. Core Data Model

The exact repository schema remains authoritative, but conceptually the platform revolves around:

```text
User
 │
 ├──────────────► Cart ─────► CartItem ─────► Product
 │
 └──────────────► Order ─────► OrderItem ────► Product snapshot
                         │
                         └──► Payment

Product ─────► Inventory / stock state
Product ─────► Category
```

---

## 15. Why PostgreSQL?

E-commerce has relationships and transactional requirements that fit a relational database naturally.

Important examples:

- one order has many order items
- one product can appear in many orders
- users own carts/orders
- inventory updates must be consistent
- payment/order state must remain coherent

PostgreSQL provides transactions, constraints, indexes, relational integrity and row-level locking.

---

## 16. SQLAlchemy and Repository Pattern

Instead of putting database code directly inside every route:

```python
@router.post("/orders")
def create_order(...):
    # 200 lines of SQL/database/business logic
```

the project separates responsibilities:

```text
Router
   ↓
OrderService
   ↓
OrderRepository
   ↓
SQLAlchemy
   ↓
PostgreSQL
```

This makes the code easier to test and maintain.

---

## 17. Alembic

Alembic manages database schema changes.

Common workflow:

```bash
alembic upgrade head
```

Rollback when appropriate:

```bash
alembic downgrade -1
```

A migration should describe a controlled schema change rather than requiring developers to manually edit production tables.

---

# Part 7 — E-commerce Core

## 18. Product Catalog

Catalog functionality includes:

- products
- categories
- SKU/product identity
- price
- product details
- images
- stock-related information
- search/filtering
- administration

### Typical lifecycle

```text
Admin creates product
       ↓
Product stored
       ↓
Customer discovers product
       ↓
Customer views details
       ↓
Customer adds product to cart
```

---

## 19. Cart

The cart is the bridge between browsing and checkout.

Conceptually:

```text
Product
  ↓
Add
  ↓
Cart Item
  ↓
Quantity
  ↓
Line Subtotal
  ↓
Cart Total
```

Angular Signals are useful for reactive cart state because changes can automatically propagate to dependent UI state.

Example mental model:

```text
cartItems
    ↓
computed subtotal
    ↓
computed total
    ↓
UI
```

---

## 20. Checkout

Checkout is where multiple modules meet.

A simplified sequence:

```text
Cart
 ↓
Validate authenticated user
 ↓
Validate products
 ↓
Validate quantities
 ↓
Validate inventory
 ↓
Calculate totals
 ↓
Create/process order
 ↓
Handle payment
 ↓
Confirm payment
 ↓
Finalize state
```

This is why checkout should not be implemented as one giant router function.

The router starts the operation; the service layer coordinates the business workflow.

---

# Part 8 — The Two Most Important Engineering Problems

## 21. Snapshot Pricing

### The problem

Suppose:

```text
Product price today = ₹999
```

Customer purchases it.

Later the administrator changes the catalog price:

```text
Product price tomorrow = ₹1,199
```

If the old order simply reads the current product price, historical order information becomes incorrect.

### The solution

At order creation, the purchased information is copied into the order item:

```text
Product
₹999
  ↓
Checkout
  ↓
OrderItem
₹999
```

Later:

```text
Product
₹1,199
```

The historical order still contains:

```text
OrderItem
₹999
```

### Interview explanation

> “I used snapshot pricing so historical orders preserve the price and relevant product information that existed at the time of purchase, independent of later catalog changes.”

This is a small design decision with a big business consequence.

---

## 22. Inventory Concurrency

This is one of the strongest technical topics in the project.

### Race condition

Suppose:

```text
Stock = 1
```

Two customers arrive at nearly the same time.

Without proper locking:

```text
Customer A reads stock = 1
Customer B reads stock = 1

A buys
B buys

Result:
stock may become invalid
two customers may believe they succeeded
```

### Row-level locking

The project documentation describes inventory deduction using SQLAlchemy's `with_for_update()` inside an ACID transaction.

Conceptually:

```text
BEGIN
  ↓
SELECT inventory/product row
FOR UPDATE
  ↓
Row locked
  ↓
Check stock
  ↓
Deduct stock
  ↓
Create/update order state
  ↓
COMMIT
```

The second transaction must wait for the locked row and then re-evaluate the current state.

### Why this matters

This is the difference between:

> “The application works when one user clicks.”

and:

> “The application remains correct when multiple users act at the same time.”

---

## 23. TOCTOU

TOCTOU means:

> **Time Of Check To Time Of Use**

Example:

```text
Check stock = 1
        ↓
[another request changes stock]
        ↓
Use stock = 1 assumption
```

The safer approach is to make the check and update part of one protected transaction.

---

# Part 9 — Payments & Orders

## 24. Razorpay Integration

The project integrates Razorpay for payment processing.

The conceptual flow is:

```text
Customer
   ↓
Checkout
   ↓
Backend creates payment/session data
   ↓
Razorpay
   ↓
Customer completes payment
   ↓
Confirmation / callback
   ↓
Backend verifies payment data
   ↓
Order/payment state updated
```

### Important rule

A browser saying:

> “Payment succeeded”

should not by itself be treated as authoritative.

The backend must validate the payment confirmation/signature according to the gateway integration.

---

## 25. Payment Failure

A robust payment flow considers:

```text
Payment started
      ↓
 ┌────┴────┐
 ▼         ▼
Success   Failure
 │         │
 ▼         ▼
Confirm   Keep failure state
Order     / allow retry
```

The system should avoid creating contradictory business state such as:

> payment failed but order permanently appears paid.

---

## 26. Idempotency Mindset

Payment callbacks or retries can result in the same logical event being delivered more than once.

The system should therefore be designed so repeated processing does not accidentally:

- create duplicate orders
- deduct inventory twice
- create duplicate payment records
- transition state incorrectly

Even when implementing a simple portfolio system, **thinking in terms of idempotency** demonstrates production engineering maturity.

---

## 27. Order Lifecycle

The documented customer-facing status flow includes:

```text
Pending
   ↓
Processing
   ↓
Shipped
   ↓
Delivered
```

Depending on the implemented workflow, cancellation/failure states may also exist.

The important design idea is that order status represents the lifecycle of the purchase after checkout.

---

## 28. Customer Order History

Customers should be able to see:

- order identity
- purchased items
- quantities
- historical prices
- totals
- status
- relevant payment/order information

This is another reason snapshot pricing matters.

---

# Part 10 — Angular 19

## 29. Angular 19 Application Structure

The frontend uses modern Angular concepts including:

- standalone components
- Angular Material
- Signals
- RxJS
- route guards
- HTTP interceptors
- OnPush change detection

The goal is to keep UI components focused while reusable services manage communication and state.

---

## 30. Signals

Signals provide reactive state.

A simplified mental model:

```text
Signal
  ↓
State changes
  ↓
Dependent computed values
  ↓
UI updates
```

For a cart:

```text
items signal
   ↓
subtotal computed
   ↓
total computed
   ↓
checkout UI
```

This makes Signals a natural topic to explain during an Angular interview.

---

## 31. HTTP Interceptor

A typical authentication interceptor:

```text
Angular API request
       ↓
HTTP Interceptor
       ↓
Attach Bearer token
       ↓
FastAPI
```

This avoids manually adding authentication headers in every service call.

---

## 32. Route Guards

A guard helps prevent navigation to protected pages.

For example:

```text
/customer/orders
/admin/dashboard
```

should not be accessible simply by typing the URL.

But remember:

> Angular guards improve UX and navigation control; backend authorization remains the security boundary.

---

# Part 11 — Testing & Quality

## 33. Testing Pyramid

The testing documentation describes a layered strategy:

```text
             ┌──────────────────────┐
             │   Playwright E2E     │
             │ Critical user flows  │
             └──────────┬───────────┘
                        │
             ┌──────────▼───────────┐
             │ Integration /        │
             │ Concurrency tests    │
             └──────────┬───────────┘
                        │
             ┌──────────▼───────────┐
             │ Unit / Service tests │
             └──────────────────────┘
```

The project places special attention on financial correctness, inventory concurrency and authentication.

---

## 34. Backend Tests

Important test areas:

- Pydantic validation
- service logic
- price snapshotting
- totals/tax calculations where implemented
- authentication
- authorization
- repository behavior
- order creation
- payment-related logic

---

## 35. Concurrency Test

A particularly useful test simulates multiple simultaneous checkout attempts against limited inventory.

Conceptually:

```text
Stock = 1

5 simultaneous checkout attempts
          ↓
     Row locking
          ↓
   ┌──────┴──────┐
   ▼             ▼
1 succeeds     4 conflict/fail
```

The test material describes a scenario where five simultaneous attempts are dispatched and the expected result is one successful order, four conflicts, and final stock of zero.

This is excellent evidence for the project's concurrency design.

---

## 36. Playwright E2E

A critical browser journey is:

```text
Login
 ↓
Product catalog
 ↓
Add to cart
 ↓
Reactive cart
 ↓
Checkout
 ↓
Order confirmation / history
```

Playwright verifies behavior from the user's perspective rather than only testing isolated functions.

Typical configuration can include:

- Chromium
- retries in CI
- screenshots on failure
- video on failure
- traces on retry
- configurable base URL

---

## 37. Manual QA

Manual QA should include both positive and negative paths.

### Positive

- valid login
- valid product search
- valid cart update
- valid checkout
- valid payment
- valid order history

### Negative

- invalid credentials
- unauthorized admin access
- invalid product ID
- insufficient inventory
- invalid quantity
- failed payment
- invalid payment signature
- another user attempting to access an order

---

# Part 12 — Developer Workflow & Operations

## 38. Local Development

The project documentation uses WSL + Docker for a Linux-compatible development environment.

Typical infrastructure:

```bash
docker-compose up -d postgres redis
```

Then run backend/frontend according to the project setup.

Backend example:

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

Frontend:

```bash
cd frontend
npm install
ng serve
```

Swagger is available through FastAPI's generated API documentation when the backend is running.

---

## 39. Environment Variables

Never hardcode:

- database passwords
- JWT secrets
- Razorpay secrets
- production credentials

Use `.env` / environment configuration.

Conceptually:

```text
Application
   ↓
Environment Variables
   ├── Database
   ├── Redis
   ├── JWT
   └── Razorpay
```

---

## 40. Git Workflow

A practical development lifecycle:

```text
main
 ↓
feature branch
 ↓
implementation
 ↓
tests
 ↓
commit
 ↓
push
 ↓
pull request
 ↓
review
 ↓
merge
```

Use focused commits that explain what changed and why.

---

## 41. Production Operations

The project runbook covers practical operational concerns including:

- Docker deployment
- PostgreSQL backups
- Redis cache management
- container logs
- crash troubleshooting
- scaling considerations

Example PostgreSQL backup concept:

```bash
pg_dump ...
```

Example log investigation:

```bash
docker logs <backend-container> --tail 100 -f
```

### Redis

If stale cached dashboard information is the problem, cache inspection/clearing may be necessary.

> **Caution:** `FLUSHALL` is destructive to the Redis database. Use it only when you understand the environment and impact.

---

# Part 13 — Skill Mastery

## 42. What This Project Teaches

| Project Feature | Skill Demonstrated |
|---|---|
| JWT | Authentication |
| RBAC | Authorization |
| Product CRUD | REST/API development |
| Pydantic | DTO validation |
| Repository | Persistence separation |
| Service Layer | Business logic |
| SQLAlchemy | ORM/database engineering |
| PostgreSQL | Relational data |
| Alembic | Database migrations |
| Redis | Caching/coordination |
| Signals | Reactive Angular state |
| Cart | Frontend state management |
| Checkout | Business workflow |
| Snapshot pricing | Financial correctness |
| Row locking | Concurrency control |
| Razorpay | External integration |
| Pytest | Backend testing |
| Playwright | E2E testing |
| Docker | Environment consistency |
| Runbooks | Operational thinking |

---

## 43. Engineering Lessons

### Lesson 1 — CRUD is not enough

Real applications contain workflows where several entities must change consistently.

### Lesson 2 — The database participates in correctness

Transactions and locks are not just database theory. They protect real business outcomes.

### Lesson 3 — Historical data needs deliberate modeling

Snapshot pricing protects the meaning of old orders.

### Lesson 4 — External systems are untrusted boundaries

Payment confirmation must be verified.

### Lesson 5 — Frontend security is not backend security

Guards help the user experience. The API must still enforce authorization.

### Lesson 6 — Testing should target the risks

The most valuable tests are often the ones around concurrency, authorization, payment and financial calculations.

---

# Part 14 — Interview Preparation

## 44. 30-Second Project Introduction

> “I built a full-stack E-commerce platform using Angular 19 and FastAPI with PostgreSQL, SQLAlchemy, Redis and Razorpay. The platform supports customer shopping, cart, checkout, payment, order history and an admin workflow for products, inventory and order fulfillment. One of the main engineering challenges I focused on was transactional checkout correctness, especially snapshot pricing and inventory concurrency using database transactions and row-level locking.”

---

## 45. Two-Minute Explanation

A good expanded answer:

> “The application is structured as a layered modular monolith. Angular 19 handles the customer and admin experiences using standalone components, Signals, RxJS and Material UI. FastAPI provides the REST API, with Pydantic DTOs at the API boundary, a service layer for business logic and repositories for persistence.
>
> The core business flow is catalog → cart → checkout → payment → order. PostgreSQL provides relational persistence and transaction guarantees, while Redis is used for appropriate caching/coordination scenarios.
>
> Two areas I paid particular attention to were historical financial correctness and inventory concurrency. At checkout, purchased pricing is snapshotted into order items so later catalog price changes do not rewrite history. For limited inventory, the database row is locked during the transaction so simultaneous customers cannot oversell the same stock.
>
> The project is tested using Pytest and Playwright, including critical checkout journeys and concurrency scenarios.”

---

## 46. Common Interview Questions

### Q1. Why use a service layer?

Because business logic should not be tied to HTTP routes or persistence code. The service layer gives the application a clear place for workflows such as checkout and order creation.

### Q2. Why use repositories?

Repositories isolate database persistence from business logic and make data access easier to test and maintain.

### Q3. Why PostgreSQL?

The system has strongly related entities and transactional requirements. PostgreSQL provides relational integrity, transactions, constraints, indexes and row-level locking.

### Q4. Why snapshot pricing?

Because an order is historical financial data. Its price should represent what the customer purchased at that time.

### Q5. How do you prevent overselling?

Use a transaction and row-level locking around the inventory-sensitive operation, then validate and update stock while the row is protected.

### Q6. What is a race condition?

A race condition occurs when the outcome depends on the timing/interleaving of concurrent operations.

### Q7. Why isn't `stock -= 1` enough?

Because two transactions may read the same old stock before either writes the new value.

### Q8. What does `SELECT ... FOR UPDATE` do?

It locks the selected database rows for the current transaction so conflicting updates must wait until the transaction completes.

### Q9. Why use Angular Signals?

They provide a simple reactive state model that works well for UI state such as cart contents and derived totals.

### Q10. Why not trust the browser's payment-success message?

The browser is not a trusted authority. Payment confirmation must be verified through the payment integration/backend validation.

### Q11. Why Playwright?

It tests the application from the user's perspective across multiple frontend/backend interactions.

### Q12. Why not microservices?

For a portfolio-scale application, a modular monolith provides clear separation without introducing distributed transaction and operational complexity unnecessarily.

---

# Part 15 — “What Would You Improve?”

A strong interview answer does not claim the project is perfect.

Possible future improvements can be discussed as **future work**, not as implemented features:

- stronger payment idempotency infrastructure
- richer observability/metrics
- more extensive load testing
- distributed caching strategy
- asynchronous processing for suitable long-running work
- stronger deployment automation
- more advanced search
- inventory reservation expiry
- notification workflows
- more granular admin permissions

### Important distinction

Always say:

> “This is a potential next improvement.”

Do not present future architecture as something already implemented.

---

# Part 16 — Troubleshooting Quick Reference

| Problem | First place to investigate |
|---|---|
| Backend won't start | Python environment, dependencies, configuration |
| Database connection error | `DATABASE_URL`, PostgreSQL availability |
| Migration failure | Alembic revision history and schema state |
| Redis error | Redis availability/configuration |
| 401 | JWT/token/authentication |
| 403 | Authorization/RBAC |
| 404 | Resource/route/ownership |
| 422 | Pydantic/request validation |
| 500 | Backend stack trace/logs |
| Payment confirmation fails | Gateway credentials/signature configuration |
| Inventory behaves incorrectly | Transaction + row-lock implementation |
| Angular build fails | TypeScript/compiler/dependency errors |
| E2E fails | Browser app/API availability and Playwright trace |

---

# Part 17 — Consolidated Vocabulary

## A

**ACID** — Atomicity, Consistency, Isolation and Durability; core database transaction properties.

**API** — Application Programming Interface; the contract through which software components communicate.

**Alembic** — Database migration tool commonly used with SQLAlchemy.

**Angular Signals** — Angular's reactive state primitive for tracking state and dependent computations.

## C

**Cache** — Temporary stored data used to make repeated reads faster.

**Cart** — The customer's selected products and quantities before checkout.

**Concurrency** — Multiple operations happening during overlapping time periods.

**Controller/Router** — HTTP-facing layer that receives requests and calls application logic.

## D

**DTO** — Data Transfer Object; a defined structure for moving data across application boundaries.

**Dependency Injection** — Supplying a component's dependencies from outside rather than constructing them internally.

## E

**E2E** — End-to-End testing; validates complete application workflows.

**Entity** — Persistent domain/data object represented by the ORM.

## I

**Idempotency** — Processing the same logical request/event repeatedly without creating unintended additional effects.

**Inventory** — The available quantity of a product.

## J

**JWT** — JSON Web Token; a signed token commonly used for authentication/authorization.

## O

**OnPush** — Angular change-detection strategy that reduces unnecessary component checking.

**ORM** — Object-Relational Mapper; maps application objects to relational database structures.

## P

**Pessimistic Locking** — Locking a database row/resource before modifying it to prevent conflicting concurrent updates.

**Playwright** — Browser automation and end-to-end testing framework.

**PostgreSQL** — Relational database used for persistent application data.

**Pydantic** — Python validation/data-modeling library used by FastAPI.

## R

**Race Condition** — A bug caused by unsafe interaction between concurrent operations.

**Razorpay** — Payment gateway integrated into the project.

**Redis** — In-memory data store used for caching and other coordination use cases.

**Repository Pattern** — Design pattern that separates persistence operations from business logic.

**REST** — Architectural style commonly used for HTTP APIs.

## S

**Service Layer** — Application layer containing business rules and workflows.

**Signal** — Reactive state value that notifies dependent Angular computations/UI when it changes.

**SKU** — Stock Keeping Unit; an identifier used to distinguish a product/stock item.

**Snapshot Pricing** — Copying the purchased price into the order so historical pricing remains stable.

## T

**TOCTOU** — Time Of Check To Time Of Use; a concurrency vulnerability where state changes between validation and use.

**Transaction** — A group of database operations treated as one unit of work.

## U

**Unit Test** — Test focused on a small isolated piece of behavior.

## W

**Webhook** — Server-to-server notification sent by an external service when an event occurs.

---

# Part 18 — Final Developer Cheat Sheet

## Architecture

```text
Angular 19
    ↓
FastAPI Router
    ↓
Pydantic DTO
    ↓
Service
    ↓
Repository
    ↓
SQLAlchemy
    ↓
PostgreSQL
```

## Checkout

```text
Cart
 ↓
Validate
 ↓
Calculate
 ↓
Inventory protection
 ↓
Order
 ↓
Payment
 ↓
Confirmation
```

## Inventory

```text
BEGIN
 ↓
FOR UPDATE
 ↓
Check stock
 ↓
Deduct
 ↓
Commit
```

## Authentication

```text
Login
 ↓
JWT
 ↓
Interceptor
 ↓
Protected API
 ↓
Authorization
```

## Testing

```text
Unit
 ↓
Integration
 ↓
Concurrency
 ↓
Playwright E2E
```

## Development

```bash
# Infrastructure
docker-compose up -d postgres redis

# Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000

# Database
alembic upgrade head

# Tests
pytest -v

# Frontend
cd frontend
npm install
ng serve

# E2E
npx playwright test
```

---

# Final Takeaway

If you remember only one thing about this project, remember this:

> **The project is not just an online store. It is a demonstration of how a full-stack application keeps business data correct while customers, payments, inventory and administrators interact with the same system.**

The most important engineering chain is:

```text
                         E-COMMERCE
                             │
             ┌───────────────┼────────────────┐
             │               │                │
          Customer         Admin           Payment
             │               │                │
             ▼               ▼                ▼
          Catalog         Inventory        Razorpay
             │               │                │
             └───────┬───────┴────────┬───────┘
                     ▼                ▼
                   Cart            Order
                     │                │
                     └───────┬────────┘
                             ▼
                          Checkout
                             │
                 ┌───────────┴───────────┐
                 ▼                       ▼
          Snapshot Pricing        Row-Level Locking
                 │                       │
                 └───────────┬───────────┘
                             ▼
                  Transactional Correctness
                             │
                             ▼
                     Reliable E-commerce
```

That is the story to carry into a portfolio review or interview.

---

## Source Reconciliation Note

The source set contains overlapping documents and a few alternative/proposed technical descriptions. This consolidated handbook intentionally avoids presenting every source statement as simultaneously implemented.

In particular:

- **Angular 19** is retained as the frontend baseline.
- **FastAPI + PostgreSQL + SQLAlchemy + Alembic + Redis + Razorpay** are retained as the core platform stack.
- **FastAPI BackgroundTasks** are used where lightweight background execution is part of the implemented approach.
- **Celery is not treated as implemented**.
- Where source documents describe different infrastructure/version details, the exact repository configuration should be checked before treating a version number as authoritative.
- Future improvements are clearly separated from implemented functionality.

This keeps the handbook useful as a portfolio learning document without turning proposed architecture into fictional implementation history.

---

# End of Handbook

**Portfolio Project:** Enterprise E-Commerce Platform  
**Primary Learning Themes:** Full-Stack Development • Transactions • Concurrency • Payments • Security • Testing • Operations  
**Recommended companion:** The BusinessHub AI Developer Handbook
