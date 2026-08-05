Here is the comprehensive Testing Guide for the Milestone 4 deliverables. You can use these instructions to independently verify the unified onboarding API locally.

1. Automated Testing Command
Ensure your local testing environment has the necessary infrastructure running (Database and Redis). From the project root, start the infrastructure and execute the automated integration suite:

# 1. Start local database and Redis infrastructure (if not already running)
docker compose up -d db redis

# 2. Navigate to the backend directory and activate your virtual environment
cd backend
source venv/bin/activate  # Or your equivalent environment activation command

# 3. Apply the latest database migrations
alembic upgrade head

# 4. Run the robust integration test suite for the onboarding pipeline
pytest -v tests/test_onboarding.py
Expected Output: All three tests (test_onboarding_success, test_onboarding_validation_error, and test_onboarding_rollback_on_duplicate) should pass.

2. Manual API Testing (cURL)
To manually test, first start the FastAPI development server:

uvicorn app.main:app --reload --port 8000
Alternatively, you can use the Swagger UI natively at http://localhost:8000/docs.

A. Valid Request Payload (Expected: 201 Created)

curl -i -X POST "http://localhost:8000/api/v1/auth/onboard" \
-H "Content-Type: application/json" \
-d '{
    "name": "Acme Corporation",
    "slug": "acme-corp",
    "email": "admin@acmecorp.com",
    "password": "SecurePassword123!",
    "full_name": "Jane Doe"
}'
Expected Response Body:

{
  "status": "success",
  "data": {
    "organization_id": "a1b2c3d4-...",
    "user_id": "e5f6g7h8-...",
    "access_token": "eyJhbG...",
    "token_type": "bearer",
    "expires_in": 900
  }
}
B. Invalid Request Payload - Regex Failure (Expected: 422 ERR_VALIDATION_001) Testing the strict regex constraint on the slug field (no uppercase or special characters allowed):

curl -i -X POST "http://localhost:8000/api/v1/auth/onboard" \
-H "Content-Type: application/json" \
-d '{
    "name": "Bad Slug Org",
    "slug": "Invalid_Slug_Format!", 
    "email": "test@badslug.com",
    "password": "SecurePassword123!",
    "full_name": "John Doe"
}'
Expected Response: HTTP 422 Unprocessable Entity with {"code": "ERR_VALIDATION_001", "detail": [...]}

C. Duplicate Payload - Conflict (Expected: 409 Conflict) Run the exact same cURL request from A a second time. Expected Response: HTTP 409 Conflict with {"detail": "Email already registered"} (or slug taken).

3. Session & Cookie Verification
A. Cookie Verification When executing the successful cURL command (A) with the -i flag, check the returned HTTP Headers. You should see the Refresh Token set securely: Set-Cookie: refresh_token=eyJhbG...; HttpOnly; Max-Age=604800; Path=/; SameSite=strict

B. RS256 Access Token Verification Copy the access_token returned in the JSON response payload. You can decode this token using a tool like jwt.io. You will see the RS256 algorithm and the claims payload including the user_id, email, and the assigned role: "roles": ["TENANT_OWNER"].

C. Redis Session Verification Verify that a stateful 7-day TTL session was successfully registered in Redis. Assuming you decode the jti (token_id) from the JWT:

# Connect to your local Redis instance
redis-cli 

# Find the session key (pattern: sess:{user_id}:{token_id})
> KEYS sess:*
1) "sess:e5f6g7h8-...:b5c4d3..."

# Verify the TTL is approx 7 days (604800 seconds)
> TTL "sess:e5f6g7h8-...:b5c4d3..."
(integer) 604750
4. Database Rollback Check
To verify that atomic transactions successfully roll back and leave no orphaned records when a request fails (e.g., duplicate slug but unique email), query the database directly.

If you are using Docker for the DB:

# Connect to the PostgreSQL database
docker exec -it <db_container_name> psql -U postgres -d businesshub_db
SQL Queries to check for orphaned records: Assuming you attempted to create a user with email orphaned@test.com and a slug acme-corp (which already exists, triggering a 409 Conflict rollback):

-- 1. Verify the organization wasn't partially created
SELECT * FROM organizations WHERE slug = 'acme-corp' AND name = 'Failed Org Name';

-- 2. Verify the user was safely rolled back and doesn't exist
SELECT * FROM users WHERE email = 'orphaned@test.com';

-- 3. Verify no orphaned roles exist for the user ID (if you grabbed the UUID during debugging)
SELECT * FROM user_roles WHERE user_id = '<user_uuid>';
Expected Result: All above queries should return 0 rows, confirming the async with db.begin(): block successfully rolled back the entire transaction upon failure.
