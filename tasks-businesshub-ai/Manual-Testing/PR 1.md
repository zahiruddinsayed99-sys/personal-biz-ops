This pull request implements the requested UI fixes for Milestone 4 (Issues #56, #57, #58):

Build Login Page & Token Interceptor: Added a login component mapped to /login to hit POST /api/v1/auth/login. On successful login, the access_token is stored securely in localStorage with SSR-safe checks. Created an HTTP interceptor to inject this token as an Authorization header on all subsequent API calls.
Build Invite Accept Page: Created an invite acceptance component mapped to /invite/accept. It extracts the token from the URL, collects the full_name and password, and submits to POST /api/v1/auth/invite/accept, redirecting to login on success.
Build Main App Layout: Created MainLayoutComponent which acts as the wrapper for all secure application pages (/crm, /ai, /lms-author, /lms-learner, /billing). It includes a sidebar navigation menu, a top bar displaying user welcome message, and a logout button that hits POST /api/v1/auth/logout and clears local storage.
App Routing & Guard: Re-organized app.routes.ts to implement nested routing within MainLayoutComponent, and added an authGuard to ensure only logged-in users (possessing a token) can access internal views. Non-authenticated users attempting to access secure pages are redirected to /login.
Local Verification & Testing Guide
Prerequisites:

Start the PostgreSQL and Redis containers: docker compose up -d db redis
Start the Backend API (Terminal 1):
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export PYTHONPATH=. 
export DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/app-db"
alembic upgrade head
uvicorn app.main:app --reload --port 8000
Automated Tests:

Frontend Unit Tests:
cd frontend
npm install
npx ng test --watch=false --browsers=ChromeHeadless
Backend Tests:
cd backend
pytest tests/
Manual QA Walkthrough:

Start the Frontend UI (Terminal 2):
cd frontend
npm install
npm run start
Open http://localhost:4200/ in a browser. You should be redirected to the /login page if you have no active token.
Observe the login form displaying fields for Email and Password. Test validation errors by entering invalid data.
Try navigating directly to http://localhost:4200/crm. The authGuard should immediately kick you back to /login.
Enter valid credentials (or seed them manually in your DB/cache for testing). Upon successful login, you should be routed to /crm.
Inside the application, observe the Sidebar with links to CRM, AI, LMS, and Billing. The Top bar should display a Logout button.
Click Logout. The token will be cleared from Local Storage, and you will be returned to the /login screen.
Navigate to http://localhost:4200/invite/accept?token=sample_token. Observe the Full Name and Password fields. Try filling them in and click Save. Expect a success message followed by a redirect to /login.
