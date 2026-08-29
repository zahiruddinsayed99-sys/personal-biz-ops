## Implement CI
This GitHub Actions workflow automates the testing requirements from Issue 4, provisioning a live test database and running your FastAPI and Angular suites on every pull request.

Create a `.github/workflows/ci.yaml` file in the root of your repository and paste this configuration:

```yaml
name: Platform CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  backend-tests:
    name: FastAPI & Pytest
    runs-on: ubuntu-latest
    
    # Provisions an ephemeral Postgres database specifically for your test suite
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_password
          POSTGRES_DB: businesshub_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Python 3.12
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
          cache: 'pip'

      - name: Install Backend Dependencies
        working-directory: ./backend
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Execute Pytest Suite
        working-directory: ./backend
        env:
          # Injects the ephemeral DB credentials and a mock API key
          DATABASE_URL: postgresql://test_user:test_password@localhost:5432/businesshub_test
          GEMINI_API_KEY: mock_key_for_ci_isolation
        run: pytest tests/

  frontend-tests:
    name: Angular Build & Lint
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install Frontend Dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Verify Production Build
        working-directory: ./frontend
        run: npm run build

  e2e-tests:
    name: E2E Critical Paths
    needs: [backend-tests, frontend-tests]
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
        
      - name: E2E Placeholder
        run: |
          echo "This job runs after backend and frontend pass."
          echo "Once Jules selects Cypress or Playwright (Issue 4), install the runner here."
          echo "You will spin up the backend + frontend in the background, then trigger the E2E test command."

```

### Critical Infrastructure Details

* **Service Containers:** The `backend-tests` job spins up a clean PostgreSQL 15 container before running any Python code. This ensures Jules's database rollback fixtures (from Issue 4) have a real, isolated database to test the RAG tenant logic against without requiring external hosting.
* **Mock Environment Variables:** The `GEMINI_API_KEY` is explicitly set to `mock_key_for_ci_isolation`. This guarantees that if Jules forgets to use `unittest.mock` to block live API calls, the tests will fail immediately rather than silently burning your actual Google API quota.
* **Job Dependencies:** The `e2e-tests` job uses `needs: [backend-tests, frontend-tests]`. It will not waste GitHub Action runner minutes spinning up headless browsers if a basic Python syntax error already failed the backend suite.

Once Jules commits this, every Pull Request will automatically block merging until the green checkmarks confirm both sides of the application are stable.

# Instructions
Tumhare existing setup aur infrastructure ke hisaab se `ci.yaml` ko check, update aur test karne ke liye ye steps follow karo:

1. **Folder aur File Setup Karo:** Apne project ke root (main) directory mein jao. Wahan `.github/workflows` naam ka naya folder banao. Uske andar ek naya file banao jiska naam `ci.yaml` ho, aur diya gaya YAML code usme paste kar do.
2. **Apne Setup ke Hisaab se YAML ko Update Karo:** Push karne se pehle, is file ki kuch lines apne local environment se match karke dekh lo aur agar zaroorat ho toh change karo:
* **Language Versions:** Code mein `python-version: '3.12'` aur `node-version: '20'` likha hai. Agar tum apne backend/frontend ke liye koi aur version use kar rahe ho (jaise Python 3.11 ya Node 18), toh in numbers ko YAML mein update kar do.
* **Folder ke Naam (Working Directory):** File mein `working-directory: ./backend` aur `./frontend` set kiya hua hai. Agar tumhare project mein folders ka naam alag hai (maan lo API ka folder `server` aur UI ka folder `client` hai), toh YAML file mein sabhi jagah `./backend` aur `./frontend` ko apne actual folder names se replace kar do.
* **Database Settings:** Postgres database `businesshub_test` aur user `test_user` ek isolated container mein chalega, isliye `DATABASE_URL` ko YAML mein change karne ki zaroorat nahi hai. Tumhara backend `DATABASE_URL` env variable ke through is naye DB se automatically connect ho jayega.


3. **Code GitHub Par Push Karo:** YAML file ko apne hisaab se update aur save karne ke baad, terminal open karo aur ye commands chalao:
* `git add .github/workflows/ci.yaml`
* `git commit -m "Add and configure CI pipeline"`
* `git push origin main`


4. **GitHub Par Test Run Check Karo:** Apne browser mein GitHub kholo aur apni repository par jao. Upar **"Actions"** naam ka tab dikhega, uspe click karo.
5. **Jobs ka Status Monitor Karo:** Wahan tumhe "Platform CI" ka workflow chalta hua dikhega. Us par click karke dekho ki `backend-tests` aur `frontend-tests` green (pass) ho rahe hain ya nahi. (Abhi `e2e-tests` bas ek text print karega aur pass ho jayega, kyunki asli tests Issue 4 mein likhe jayenge).
6. **Agar Kuch Fail (Red) Ho Jaye:** Agar koi step fail hota hai, toh us red cross par click karke details aur logs padho. Logs se exactly pata chal jayega ki kaunsa test ya configuration fail hua hai. Apne code mein us issue ko fix karo aur wapas code push kar do; GitHub Action apne aap naya test chala dega.
