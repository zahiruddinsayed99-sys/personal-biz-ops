Since I cannot physically reach through the screen and type in a credit card for your domain registration, let's jump straight into the fun part: sketching out the technical blueprint!

For the **Solvexa Playground**, your goal is to build these demos quickly and host them as cheaply as possible (ideally for $0). Because these are interactive demos and not production applications storing sensitive client data, we are going to use **SQLite** combined with **SQLAlchemy** (an ORM).

SQLite is brilliant here because it requires zero server setup—it's just a file in your project directory. When you eventually land a paying client, SQLAlchemy allows you to swap to a robust PostgreSQL database just by changing one line of code.

Here is the database architecture for your FastAPI backend.

---

### The Database Engine Setup

You will use Python, FastAPI, and SQLAlchemy. Your database will store the extracted data and cache responses so that if someone searches for the same company twice in the CRM tool, it loads instantly without costing you another API call.

### 1. Demo: The Zero-Typing Invoice Extractor

This table stores the history of uploaded documents and the JSON data returned by your AI model.

**Table Name:** `invoices`

* `id` (Integer, Primary Key)
* `filename` (String) — *e.g., "gst_bill_march.pdf"*
* `upload_date` (DateTime) — *Defaults to current time*
* `status` (String) — *'processing', 'completed', 'failed'*
* `extracted_data` (JSON) — *Stores the AI's output (Invoice number, amount, GSTIN, line items)*

> **Why this matters:** When the user uploads a file, your Angular frontend instantly creates a row with the status "processing." Once the AI finishes, it updates to "completed" and drops the parsed data into the `extracted_data` JSON column, which Angular then renders into a beautiful table.

### 2. Demo: The Instant CRM Profiler

To keep your LLM costs low, we will cache the results. If a user searches for a domain that has already been analyzed, we just serve it straight from the database.

**Table Name:** `crm_profiles`

* `id` (Integer, Primary Key)
* `website_url` (String, Unique) — *e.g., "stripe.com"*
* `mission_statement` (Text)
* `pain_points` (JSON) — *An array of 3 generated pain points*
* `cold_email_pitch` (Text)
* `created_at` (DateTime)

> **Why this matters:** This structure is incredibly fast. When a SaaS founder types in a URL, FastAPI checks this table first. If it exists, they get their result in 50 milliseconds. If not, it triggers the web scraper and LangChain pipeline, saves the result here, and then returns it.

### 3. Demo: The Smart Lead Catcher

This captures the intent and contact details from your smart chat widget.

**Table Name:** `captured_leads`

* `id` (Integer, Primary Key)
* `email` (String) — *Extracted from the chat*
* `requested_meeting_date` (Date) — *Extracted by the AI*
* `requested_time_slot` (String) — *e.g., "Afternoon"*
* `raw_chat_transcript` (JSON) — *Saves the conversation context*
* `created_at` (DateTime)

> **Why this matters:** This is the exact table structure you can pitch to local businesses to replace their messy "Contact Us" forms. It cleanly separates the actionable data (email and meeting time) from the conversational fluff.

---

### How this connects to FastAPI

Your FastAPI `main.py` will have three incredibly clean routes connecting to this architecture:

1. `POST /api/playground/invoice/upload`
2. `GET /api/playground/crm-profile?url={website_url}`
3. `POST /api/playground/lead-catcher/chat`

With this blueprint, you can build the entire backend logic in a single weekend without touching complex server provisioning.

Would you like me to write out the actual SQLAlchemy Python code for these models, or should we switch gears and outline exactly how to set up your free professional email using Cloudflare and Zoho?
