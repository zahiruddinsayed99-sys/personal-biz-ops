# BusinessHub AI --- Offline Operations & Troubleshooting Companion

## 1. Purpose

This is an expanded operational companion derived from the supplied
Master Reference.

It organizes the stated operational practices into repeatable checks.

------------------------------------------------------------------------

## 2. Deployment Components

``` text
Frontend  → Vercel
Backend   → Render
Database  → Supabase PostgreSQL
Redis     → Render Redis
AI        → Google Gemini
```

------------------------------------------------------------------------

## 3. Health Check

Endpoint:

``` http
GET /api/v1/healthz
```

### Basic operational sequence

1.  Confirm the backend is reachable.
2.  Check the health endpoint.
3.  Inspect structured Render logs.
4.  If database-related failures appear, inspect PostgreSQL/Supabase
    status.
5.  If background operations are affected, inspect Redis coordination
    and AI job status.

------------------------------------------------------------------------

## 4. Migration Operations

### Upgrade

``` bash
alembic upgrade head
```

### Migration safety expectations

Before applying a schema change:

-   Review the migration script.
-   Confirm the target revision.
-   Verify upgrade operations.
-   Verify downgrade logic where applicable.
-   Test against a clean database when practical.
-   Confirm application models remain compatible.

The supplied reference specifically emphasizes reversible downgrade
routines.

------------------------------------------------------------------------

## 5. RAG Troubleshooting

### Symptom: Job remains pending

Check:

``` text
API request
  ↓
AiJob creation
  ↓
Background task started?
  ↓
Redis lock acquired?
  ↓
Gemini call succeeded?
  ↓
Vector persistence succeeded?
```

### Symptom: Job fails

Inspect:

-   job status
-   structured logs
-   Gemini integration errors
-   Redis lock behavior
-   database/vector persistence errors

The authoritative error details should come from the underlying
API/technical documentation.

------------------------------------------------------------------------

## 6. Redis Troubleshooting

Redis is used for operational coordination.

Potential areas to inspect:

-   lock acquisition
-   lock expiry
-   rate-limiting primitives
-   webhook coordination

Do not treat Redis as the durable business database.

------------------------------------------------------------------------

## 7. Stripe Webhook Troubleshooting

Expected endpoint:

``` http
POST /billing/webhooks
```

Expected security mechanism:

``` text
Stripe-Signature verification
```

Troubleshooting sequence:

``` text
Webhook received
     |
     v
Signature verified?
     |
  +--+--+
  |     |
 No    Yes
  |     |
Reject   Process event
        |
        v
 Update subscription state
```

------------------------------------------------------------------------

## 8. Tenant-Isolation Troubleshooting

If a user reports seeing incorrect organization data:

1.  Verify the authenticated identity.
2.  Verify `X-Organization-Id`.
3.  Verify tenant context resolution.
4.  Inspect the service/query that loaded the data.
5.  Confirm the database query includes organization scoping.
6.  Check authorization rules.

This is a security-sensitive investigation and should be handled
carefully.

------------------------------------------------------------------------

## 9. Logging

The reference identifies `structlog` and structured JSON logs.

A useful troubleshooting approach is to correlate:

``` text
Request
  ↓
Endpoint
  ↓
User / organization context
  ↓
Service operation
  ↓
External dependency
  ↓
Result / error
```

Exact log fields should be taken from the authoritative implementation
rather than assumed from this master reference.

------------------------------------------------------------------------

## 10. Disaster Recovery

The source identifies:

-   Supabase Point-in-Time Recovery (PITR)
-   Redis as ephemeral

The practical distinction is:

``` text
Database recovery
    → durable business state

Redis restart
    → ephemeral coordination state
```

Recovery procedures should follow the current provider configuration and
the authoritative production runbook.

------------------------------------------------------------------------

## 11. Free-Tier Operational Behavior

The supplied reference states:

-   Vercel uses serverless hosting.
-   Render may auto-spin-down on its free tier.
-   Supabase may auto-pause after inactivity.

These are environment/provider behaviors described by the source and
should be revalidated before relying on them operationally, because
provider policies can change.

------------------------------------------------------------------------

## 12. Operational Checklist

### Before deployment

-   [ ] Environment variables configured
-   [ ] Database migration reviewed
-   [ ] API health endpoint available
-   [ ] Redis configuration available
-   [ ] Gemini credentials configured
-   [ ] Stripe webhook configuration verified
-   [ ] CORS configuration reviewed
-   [ ] Tenant isolation tested
-   [ ] Logs accessible

### After deployment

-   [ ] `/api/v1/healthz` responds
-   [ ] Authentication works
-   [ ] Tenant header is enforced
-   [ ] AI job can be created
-   [ ] AI job status can be polled
-   [ ] Stripe webhook verification works
-   [ ] Logs are being emitted
-   [ ] Database migrations are at expected revision

------------------------------------------------------------------------

## 13. Incident Thinking

For production incidents, separate the problem into:

``` text
Availability
Security
Data integrity
External dependency
Background processing
Database
Frontend
```

Do not immediately change code. First identify which layer is failing
and preserve evidence from logs and status endpoints.

------------------------------------------------------------------------

## 14. Key Operational Commands

``` bash
# Apply database migrations
alembic upgrade head
```

Health endpoint:

``` text
GET /api/v1/healthz
```

AI job status:

``` text
GET /api/v1/ai/jobs/{job_id}
```

------------------------------------------------------------------------

## 15. Important Source Limitation

This companion is based on the supplied consolidated master reference.
It does not invent provider-specific CLI commands, secret names,
database credentials, or detailed rollback procedures that were not
present in the supplied material.

For destructive production operations, use the authoritative
`RUNBOOK.md`.
