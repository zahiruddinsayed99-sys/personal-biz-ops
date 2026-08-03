**Awesome!** Repo secure ho gayi hai aur branch protection rules bhi active hain. Ab aap basic tasks (issues) create karne ke liye ready ho.

Backlog aur branch naming rules ke hisaab se, aapko apne project board (jaise GitHub Issues) mein ye **4 issues ek-ek karke create karne hain**:

---

### 📌 Issue #1: Monorepo Foundation & Docker Infrastructure

* **Kya karna hai:** Repo ka basic structure aur local dev environment setup karna hai. `/backend` aur `/frontend` ke folders banane hain. Saath hi ek `docker-compose.yml` file banani hai jisse local computer par PostgreSQL 16 (pgvector ke saath), Redis 7, aur MinIO chal sakein.
* **Branch name:** `track/1-foundation-docker`

---

### 📌 Issue #2: Backend Core, Alembic & Tenant Middleware

* **Kya karna hai:** FastAPI application setup karni hai Clean Architecture ke saath. Database migrations ke liye SQLAlchemy 2.0 aur Alembic configure karna hai. `organizations` aur `users` tables ka database schema banana hai aur dhyaan rakhna hai ki multi-tenancy ke liye `organization_id` strictly use ho. Aakhri mein `TenantContextMiddleware` aur ek `/healthz` API endpoint banana hai.
* **Branch name:** `track/2-backend-tenant-core`

---

### 📌 Issue #3: Authentication, RBAC & API Response Standards

* **Kya karna hai:** JWT-based login system banana hai (short-lived access tokens aur HttpOnly cookies wale refresh tokens ke saath). Platform SuperAdmin, Tenant Owner, aur Tenant Admin ke liye Roles/Permissions (RBAC) middleware banana hai. System mein `audit_logs` table add karni hai. Saath hi saare API responses aur Error Codes (jaise `ERR_AUTH_001`) ko ek standard format mein set karna hai.
* **Branch name:** `track/3-auth-rbac-api`

---

### 📌 Issue #4: Angular App Shell & CI/CD Pipeline

* **Kya karna hai:** Angular 20+ frontend application ka basic structure banana hai (strictly **Standalone Components aur Signals** use karna hai, NgModules bilkul use nahi karna). Styling ke liye Angular Material aur Tailwind CSS integrate karna hai. Ek `tenant.interceptor.ts` file banani hai jo har request mein automatic JWT token aur Organization ID bhej sake. End mein, `.github/workflows/ci.yml` pipeline setup karni hai jo merge karne se pehle code testing aur checks run kare.
* **Branch name:** `track/4-frontend-cicd`

---

### 🚀 Next Steps (Ab aage kya karein):

1. **Pehle Issue #1 create karein.**
2. Phir apne system par `.env` file banakar Postgres, Redis, aur MinIO ke dummy values/passwords set kar lein.
3. Iske baad Milestone 1 ka prompt apne AI agent ko dein taaki wo kaam shuru karke pehla **Draft PR** review ke liye open kar sake!
