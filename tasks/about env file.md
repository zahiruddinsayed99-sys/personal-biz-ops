Maine aapke project ki architecture, technology stack aur local Docker Compose environment ko dhyan mein rakhte hue ek **production-grade `env.example`** file prepare ki hai.

Ye file aapke **Studio** panel mein available hai. Isse is tarah design kiya gaya hai ki ye dono scenarios support kare:

* **Local WSL Development** (jahan PostgreSQL, Redis aur MinIO Docker containers mein chalenge)
* **Direct WSL Execution** (jahan FastAPI, pytest ya uvicorn directly WSL terminal se run honge)
---
Recommended approach:

✅ businesshub-ai/.env.example → GitHub mein commit karein (template)
✅ businesshub-ai/.env → Is template ko copy karke banayein aur apni actual secrets bharein (GitHub par commit na karein)
✅ .gitignore mein .env add karein taaki secrets accidentally repository mein na chale jaayen.

Ye industry-standard practice hai aur development, CI/CD aur production sab ke liye best rahegi.
---
## Is `env.example` mein kya-kya include hai?

### 1. Security (RS256 JWT)

Project ki security requirements ke hisaab se **RS256** token signing configure ki gayi hai.

Ismein placeholders diye gaye hain:

* RSA Private Key
* RSA Public Key
* Base64 Encoded Keys (future deployment ke liye, jaise Render)

---

### 2. Token Expiry

SRS ke hisaab se token expiry pehle se define ki gayi hai.

* Access Token → **15 Minutes**
* Refresh Token → **7 Days**

---

### 3. Database Configuration

Async SQLAlchemy ke liye proper connection string diya gaya hai.

`postgresql+asyncpg://...`

Ye FastAPI ke native async runtime ke saath compatible hai.

---

### 4. Storage Configuration

Ek `STORAGE_PROVIDER` option diya gaya hai.

Development mein:

* **MinIO**

Production mein:

* **Cloudflare R2**

Sirf provider change karke storage switch kiya ja sakta hai.

---

### 5. Redis & Celery Configuration

Redis ko alag-alag purposes ke liye divide kiya gaya hai:

* **Redis DB 0** → Cache aur Rate Limiting
* **Redis DB 1** → Celery Message Broker
* **Redis DB 2** → Celery Task Results

Isse background jobs aur cache ke beech conflict nahi hota.

---

### 6. AI Gateway Configuration

OpenAI aur Gemini ki API Keys centrally define ki gayi hain.

Isse project ke alag-alag modules direct AI services ko call nahi karenge. Sab requests ek shared AI Gateway ke through jayengi.

---

### 7. Logging & Monitoring

Production-grade monitoring ke liye configuration include hai.

* Structured JSON Logging (`structlog`)
* Sentry Error Monitoring

Ye debugging aur production monitoring mein help karega.
