Ye rahe **Milestone 7 (Module 5: Centralised AI Platform)** ke charo GitHub Issues ka **friendly aur easy-to-understand Hinglish version**:

---

### **Issue 1: Row-Level pgvector Embedding Schema & Database Migrations Implement Karna**

* **Type:** 🛠️ Feature & Migration (Backend)


* **Track:** `track/7-ai-platform`

* **Summary:** Database me `organization_documents` table create karni hai jisme `pgvector` support ho, aur ye strict multi-tenant isolation rules follow kare taaki ek tenant ka data dusre ko kabhi na dikhe.



#### **Technical Scope & Specifications**

1. **Alembic Migration Setup:**
* PostgreSQL me `pgvector` extension enable karo (agar pehle se active nahi hai).


* `organization_documents` naam ki nayi table banao jisme ye columns hon:
* `id`: UUID PRIMARY KEY (`gen_random_uuid()` ke sath).


* `organization_id`: UUID (Foreign Key jo `organizations(id)` se linked ho with `ON DELETE CASCADE`).


* `title`: VARCHAR(255) (Not Null) aur `content`: TEXT (Not Null).


* `embedding`: Vector(1536) — *jo OpenAI ke `text-embedding-3-small` model ke standard size se match kare*.


* Standard audit timestamps (`created_at`, `updated_at`) aur soft delete (`deleted_at`) columns.






2. **Zero-Leakage Vector Search Scope:**
* SQLAlchemy 2.0 async syntax ka use karke ek async `OrganizationDocumentRepository` implement karo.


* Vector search similarity queries me ye rule hardcode/enforce karo ki system automatically query me `organization_id == current_tenant_id` aur `deleted_at IS NULL` attach kar de.


* Agar koi bina authenticated `organization_id` context ke search karne ki koshish kare, toh turant **`ERR_RBAC_001` (HTTP 403)** error throw karo.





#### **Definition of Done (DoD - Kab Complete Mana Jayega)**

* [ ] Database migration perfectly compile hona chahiye aur upgrade/downgrade routines bina kisi error ke chalne chahiye.


* [ ] Pytest integration tests ye prove karein ki cross-tenant vector searches zero results return karte hain, aur bina organization context ke aane wali requests par HTTP 403 error aata hai.



---

### **Issue 2: Centralised AI Gateway banana with Pre-Flight Atomic Metering aur Soft-Lock Checks**

* **Type:** 🔒 Security & Feature (Backend)


* **Track:** `track/7-ai-platform`

* **Dependencies:** Issue 1



#### **Summary**

Ek centralized AI Gateway layer banani hai jo asynchronous chat aur RAG prompts ko handle kare. Saath hi, har AI request se pehle ek security wrapper (pre-flight dependency) check karega ki organization soft-locked toh nahi hai aur credits atomically deduct karega.

#### **Technical Scope & Specifications**

1. **Core Gateway (`app/domain/ai/`):**
* OpenAI ya Gemini SDK ke saare calls sirf is centralized gateway service ke through hi hone chahiye. Kisi aur module me direct model initialize karna strictly allowed nahi hai.




2. **Soft-Lock & Pre-Flight Metering Dependency:**
* Ek dependency wrapper likho jo `/api/v1/ai/` ke under aane wale saare API endpoints ko intercept kare.


* Agar tenant ka `subscription_status` kisi **Soft-Lock Overage** state me hai (e.g., plan downgrade hua hai aur active users > 3 hain), toh request ko wahi block karke **`ERR_BILLING_001` (HTTP 402)** return karo.




3. **Atomic SQL Credit Deduction:**
* Credits deduct karne ke liye hamari single atomic SQL query use karo:


```sql
UPDATE organizations
SET ai_credits_used = ai_credits_used + :requested_credits
WHERE id = :org_id
  AND (subscription_tier = 'PRO' OR subscription_tier = 'ENTERPRISE' OR (ai_credits_used + :requested_credits <= 100 + bonus_ai_credits))
RETURNING id;

```


* Agar database me koi row update nahi hoti (yaani credit limit exceed ho gayi hai), toh external AI model ko call karne se pehle hi **`ERR_BILLING_001` (HTTP 402)** throw kar do.





#### **Definition of Done (DoD)**

* [ ] Saare core AI endpoints soft-lock aur pre-flight credit deduction logic se fully protected hone chahiye.


* [ ] Concurrency tests ye verify karein ki credit khatam hote hi system downstream LLM API calls ko block kar deta hai.



---

### **Issue 3: Asynchronous Celery Document Ingestion Pipeline & Job Status API Banana**

* **Type:** ⚙️ Infrastructure & API (Backend)


* **Track:** `track/7-ai-platform`

* **Dependencies:** Issue 1



#### **Summary**

Document chunking aur embedding generation jaise heavy tasks ke liye **Celery background worker** setup karna hai. Isse FastAPI ke main server threads block nahi honge aur app fast rahega.

#### **Technical Scope & Specifications**

1. **Async Celery Task (`ai.process_document_embeddings`):**
* Worker uploaded document ko MinIO/R2 se fetch karega, text ko small chunks me todega, AI Gateway ke through embeddings generate karega, aur database me save karega.


* Isme pending background CRM task (`crm.calculate_lead_score`) ko bhi add karo.




2. **Idempotent Redis Lock:**
* Duplicate processing rokne ke liye Redis me `ai_lock:doc:{document_id}` lock lagao jisme **5-minute ka TTL** ho, taaki agar user galti se double-click kar de toh same file do baar process na ho.




3. **Transient Error Backoff:**
* Agar OpenAI rate-limiting (HTTP 429) error de, toh worker ke andar **exponential backoff retry policy** implement karo taaki job drop hone ke bajaye thodi der baad automatically retry ho jaye.




4. **Job Status Routing (`GET /api/v1/ai/jobs/{job_id}`):**
* Ek lightweight endpoint banao jo Redis/DB se task ka current status aur progress percentage frontend ko return kare.





#### **Definition of Done (DoD)**

* [ ] Celery document task asynchronously run hona chahiye aur pgvector records ko correct tenant boundaries ke andar save karna chahiye.


* [ ] Pytest suite verify kare ki API rate-limiting (HTTP 429) aane par system bina job fail kiye exponential backoff retries execute karta hai.



---

### **Issue 4: Standalone Angular Signals Document Ingestion & AI RAG Panel Banana**

* **Type:** 🎨 Feature (Frontend)


* **Track:** `track/7-ai-platform`

* **Dependencies:** Issue 3



#### **Summary**

Frontend par ek standalone Angular dashboard component banana hai jahan user documents upload kar sake, AI ke sath interactive RAG chat kar sake, aur background task ka real-time progress bar dekh sake.

#### **Technical Scope & Specifications**

1. **UI Layout & Aesthetics:**
* Glassmorphism-theme ka use karke ek clean RAG interface design karo jisme file upload widget aur chat box ho.




2. **Signal-Driven State & Standalone Architecture:**
* `ChangeDetectionStrategy.OnPush` aur modern `inject()` dependency syntax enforce karo.


* File upload progress aur active AI generation streams ko handle karne ke liye **Angular Signals** ka use karo.




3. **Reactive Job Polling Engine:**
* Jab file upload hone par backend se `job_id` (HTTP 202 Accepted) mile, toh `/api/v1/ai/jobs/{job_id}` endpoint par reactive RxJS interval stream chalao aur use Signal me convert karo.


* Screen par real-time progress percentages dikhao aur job complete hote hi UI ko smoothly update karo.





#### **Definition of Done (DoD)**

* [ ] Front-end standalone component bina kisi template ya stylesheet size error ke smoothly compile hona chahiye.


* [ ] End-to-end flow verify hona chahiye: file upload karne par progress bar dikhe, upload complete ho, aur user turant us document se related AI queries pooch sake.
