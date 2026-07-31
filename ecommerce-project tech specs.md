The technical specifications for the **Enterprise E-Commerce Platform** define a production-grade environment optimized for maintainability and scalability through a **Modular Monolith** architecture and **Clean Architecture** principles.

### **Core Architecture & Engineering Principles**
*   **Architectural Pattern:** **Modular Monolith** utilizing **Clean Architecture** layers (Routers → Services → Repositories → Models).
*   **Design Patterns:** Strict adherence to **SOLID principles**, the **Repository Pattern** (persistence only), and a dedicated **Service Layer** for all business logic.
*   **Engineering Standards:** Implementation of **Historical Integrity** through a **Snapshot Strategy**, where `order_items` duplicate product names and prices at the time of purchase to prevent historical data drift.

### **Backend Technical Stack**
*   **Language & Framework:** **Python 3.12** and **FastAPI** using Pydantic v2 for DTO synchronization and validation.
*   **ORM & Persistence:** **SQLAlchemy 2.x (Synchronous)** sessions and **Alembic** for linearized database migration management.
*   **Security:** **JWT Authentication** with **Refresh Tokens** and **Role-Based Access Control (RBAC)** supporting roles such as Admin, Customer, Vendor, and Accountant.

### **Frontend Technical Stack**
*   **Framework:** **Angular 19** utilizing a **Standalone Component** architecture.
*   **State Management:** **Angular Signals** for reactive data binding and state handling.
*   **Performance:** **OnPush Change Detection** and lazy-loaded feature chunks to optimize bundle sizes.
*   **Design System:** **Angular Material 3** with a customized **Enterprise Design System** (e.g., `AppCard`, `StatusChip`, `LoadingSkeleton`).

### **Local Development & Infrastructure**
*   **Operating System:** **WSL2 Ubuntu** local setup.
*   **Containerization:** **Docker Compose** orchestrating Backend, **PostgreSQL 17**, and **Redis 8** services.
*   **Local Configuration:** Docker storage is relocated to a dedicated **D: drive** to stabilize the WSL environment.
*   **Development Tools:** VS Code, **Codex CLI** for implementation, and **Continue + Ollama** as a local coding assistant.

### **Database & Caching**
*   **Primary Database:** **PostgreSQL 17** with a schema supporting complex relational structures for Users, Products, Inventory, and Orders.
*   **Caching Layer:** **Redis 8** for high-performance product discovery and search caching.
*   **Data Seeding:** A professional **Bootstrap/Seed Framework** that populates the environment with realistic master data (30 products, 8 orders, 18 items).

### **Quality & Validation Tooling**
*   **Static Analysis:** **Ruff** for linting, **Black** for deterministic formatting, and **MyPy** for strict type checking (specifically for Decimal monetary types).
*   **Testing Suite:** **Pytest** for backend unit/integration tests and an **Enterprise Postman SIT (System Integration Testing)** suite for end-to-end API validation.
*   **CI/CD Foundation:** **GitHub Actions** for automated builds, linting, and regression testing.