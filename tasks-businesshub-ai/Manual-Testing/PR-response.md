# PR 2
Here is neat Markdown format for you. I make it easy to read.

### Features Added

* **Workspace Settings Page (`/settings`):** Have Company Profile. Check GSTIN is exactly 15 chars.
* **Team Invite Panel:** Inside Workspace Settings. Make invite URL with token. Use app origin dynamically.
* **Global `billingInterceptor`:** Catch `402 ERR_BILLING_001` error from backend. Route user to `/billing` page. Show soft-lock warning.
* **Manage Billing Button:** Wire "Manage Billing (Portal)" button in Billing Dashboard. Hit `POST /api/v1/billing/portal`.

---

### Local Verification & Testing Guide

#### 1. Install and Build

```bash
cd frontend
npm install
npx @angular/cli build

```

#### 2. Run Unit Tests

```bash
cd frontend
npx ng test --watch=false --browsers=ChromeHeadless

```

#### 3. Manual UI Verification

1. Start frontend server (`npm start`).
2. Go to `http://localhost:4200/settings`.
3. Fill Company Profile with good GSTIN (e.g., `12ABCDE3456F7Z8`) and State. Click Save. Check success toast.
4. Scroll to Team Invite section. Enter email, click "Create Invite". Ensure correct link show up and copy button work.
5. Try go to AI platforms or trigger overage to simulate `402 ERR_BILLING_001`. Check it redirect to `/billing` with locked alert message.
6. In `/billing`, click "Manage Billing (Portal)". Verify it hit Stripe API and redirect.
---

# 1

## Detailed Automated Test Coverage aur Reporting

Is PR mein humne BusinessHub AI platform ke FastAPI backend aur Angular frontend dono ke liye detailed automated testing add ki hai. Isme HTML test reports generate karne aur ek single execution script (run karne ka aasaan tareeka) ki saari requirements poori ki gayi hain.

### Main Changes (Key Changes)

* **Backend Pytest Setup:** `pytest.ini` aur `requirements.txt` ko update kiya gaya hai taaki `pytest-html` aur `pytest-cov` ka use karke HTML format mein test execution aur coverage reports banayi ja sake.
* **Frontend Jasmine/Karma Tests:** Naye unit tests banaye gaye hain jo CRM Kanban ke drag-and-drop, LMS Markdown player (jisme XSS security shamil hai), aur AI quiz generation ke RxJS polling logic ko check karte hain.
* **Frontend Test Reporting:** `angular.json` ko update kiya gaya hai aur `karma.conf.js` add kiya hai taaki `karma-htmlfile-reporter` aur `karma-coverage` ka use karke ek hi jagah par HTML reports generate ho sake.
* **Ek Single Execution Script:** Ek naya `run_all_tests.sh` script banaya gaya hai jisse saare tests ek saath run kiye ja sake. Yeh check karta hai ki PostgreSQL aur Redis apne default ports par chal rahe hain ya nahi, aur agar nahi chal rahe to script bina error diye gracefully ruk jaati hai.

### Local Verification aur Testing Guide

1. **Local Setup:**
Make sure karein ki apka local test database aur Redis chal raha ho. Aap inhe project ke main folder se docker-compose ka use karke start kar sakte hain:
```bash
docker compose up -d db redis

```


*Note: Agar aap bina docker ke chala rahe hain, to dhyaan rakhein ki Postgres port 5432 aur Redis port 6379 par chalna chahiye.*
2. **Unified Test Script Run Karein:**
Project ke main folder se nayi banayi gayi script ko run karein. Yeh script pehle database aur redis ko check karti hai, fir backend ke Pytest aur frontend ke Angular tests ko bina browser open kiye (headless mode mein) run karti hai, aur saari reports ko ek jagah jama karti hai.
```bash
./run_all_tests.sh

```


3. **Generated Reports Check Karein:**
Successfully run hone ke baad, script project folder mein ek `reports/` naam ka naya folder banayegi. Test results aur coverage check karne ke liye apne browser mein in files ko open karein:
* `reports/backend-test-report.html`
* `reports/backend-coverage/index.html`
* `reports/frontend-test-report.html`
* `reports/frontend-coverage/index.html`



---

# 2

## Frontend aur backend dono mein Testing Pyramid implement karna

* Backend mein Tier 1 (Unit) tests add kiye gaye (JWT, AI scoring, GST, Pydantic ke liye)
* Frontend mein Tier 1 (Unit) tests add kiye gaye (Kanban, marked ke saath LMS XSS, API Errors ke liye)
* Backend mein Tier 2 (Integration) tests add kiye gaye (Tenant Isolation, RBAC credits, Celery workers, Stripe webhooks ke liye)
* Important flows (critical paths) ke liye Playwright ke through Tier 3 (E2E - End to End) tests ka structure add kiya gaya
* Saare tests ko ek saath chalane ke liye `run_pyramid_tests.sh` add kiya gaya
* `gitignore` file mein playwright ki generated files ko ignore kiya gaya

### Local Verification aur Testing Guide

#### Environment Setup

Ensure karein ki Postgres (pgvector ke saath) aur Redis aapke system par locally chal rahe hain.

1. Backend:
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pip install pytest pytest-asyncio httpx stripe pgvector
export DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/app-db"
alembic upgrade head

```


2. Frontend:
```bash
cd frontend
npm install

```



#### Tests Execute Karna

Project ke root (main) folder mein ek unified execution script di gayi hai:

```bash
./run_pyramid_tests.sh

```

Yeh script yeh steps follow karegi:

* Pytest ke through Tier 1 backend unit tests chalayegi.
* Karma/ChromeHeadless ke through Tier 1 frontend unit tests chalayegi.
* Pytest ke through Tier 2 backend API aur integration tests chalayegi.
* Tier 3 E2E Playwright tests ko chalane ki koshish karegi (agar poora environment set nahi hai, to tests atakne se bachane ke liye khud hi skip kar degi).

#### Manual QA Guide (Walkthrough)

1. **Tier 1 Verification**: `backend/tests/test_tier1_unit.py` aur `frontend/src/app/tier1.spec.ts` files check karein:
* Backend ke tests mein JWT algorithms, AI Lead Scoring, Pydantic validations (jo `ERR_VALIDATION_001` error dete hain), aur GST calculation logic ko cover kiya gaya hai.
* Frontend ke tests seedhe UI components aur services ko test karte hain (jaise CRM deal updates aur markdown inputs ko secure karne ke liye DomPurify check).


2. **Tier 2 Verification**: `backend/tests/test_tier2_api.py` check karein.
* Tenant isolation yeh pakka karta hai ki agar koi dusre tenant ka data access karne ki koshish kare (cross-tenant IDOR attack), to 404 ya 403 error aaye.
* Stripe ke dummy (mocked) data bhej kar webhook logic ko backend par test kiya gaya hai.
* Background worker tests mein asyncio event loops ka use karke Celery functions ko manually execute kiya gaya hai.


3. **Tier 3 Verification**: `e2e/tests/critical_paths.spec.ts` check karein.
* Test script mein CRM, Onboarding/Billing, aur LMS execution ke raste (paths) cover kiye gaye hain. Playwright ka setup `playwright.config.ts` se hota hai. Agar external environments chal rahe hain aur aap UI ka real flow dekhna chahte hain, to `cd e2e && npx playwright test` command run karein.
