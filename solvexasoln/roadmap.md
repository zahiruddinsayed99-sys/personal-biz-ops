Here is your comprehensive, step-by-step master blueprint to launch **Solvexa**. This roadmap takes you from a blank slate to a fully operational, revenue-ready technical consultancy.

---

## Phase 1: Brand & Infrastructure Setup (Days 1-3)

Before writing any code, establish the professional foundation so you can accept communications and payments on day one.

1. **Domain & Email Setup:** Purchase your domain (e.g., `solvexa.com` or `solvexa.in`) through Cloudflare Registrar. Set up your free enterprise-grade email (`hello@solvexa.com`) using Zoho Mail's "Forever Free" plan.
2. **Payment Gateways:** Open a **Razorpay** or **Cashfree** account to generate UPI and credit card payment links for Indian SMBs. Simultaneously, open a **Wise Business** or **Payoneer** account to receive USD/EUR from global remote clients.
3. **Scheduling System:** Create a free **Cal.com** account. Set up two event types: a 15-minute "Quick Business Audit" (Phone/WhatsApp for local clients) and a 30-minute "Tech Discovery Call" (Zoom/Google Meet for global clients).
4. **Legal & Invoicing:** Sign up for **Wave Apps** (free) to generate branded invoices. Download a free Statement of Work (SOW) template to define project scopes and prevent feature creep.

---

## Phase 2: The "Proof of Work" Build (Days 4-10)

Since you have no past client portfolio, your "Playground" demos will act as your sales team.

1. **Build the API Backend:** Set up a single, clean FastAPI backend to handle all demo logic. Connect it to the free tier of the Gemini API for natural language and document processing.
2. **Demo 1 (Invoice Extractor):** Code the Document AI drag-and-drop tool for local accountants and business owners.
3. **Demo 2 (CRM Profiler):** Code the URL-scraping tool that generates a sales profile for global SaaS founders.
4. **Demo 3 (Lead Catcher):** Implement the simple intent-recognition chat widget.
5. **Containerize:** Wrap this FastAPI backend in Docker and deploy it to a low-cost virtual server (like DigitalOcean or Hetzner).

---

## Phase 3: The Digital Storefront (Days 11-14)

Now, build the face of Solvexa using the empathetic, problem-solving copy we outlined.

1. **Frontend Development:** Spin up an Angular 18+ static application using Tailwind CSS.
2. **Design Language:** Apply the warm, approachable color palette (slate grays, clean whites, soft blue/teal accents) and highly readable typography (like Nunito or Poppins).
3. **Integrate the Playground:** Create a dedicated `/playground` route where visitors can interact with the three demos you built in Phase 2.
4. **Deploy for Free:** Push your Angular code to GitHub and connect it to **Cloudflare Pages** for lightning-fast, zero-cost global hosting. Map your custom domain.

---

## Phase 4: The Client Experience (Days 15-16)

Set up the automated onboarding flow so that when a client says "yes," you look like a seasoned agency.

1. **The Welcome Kit:** Draft a standard welcome email template containing their SOW and the initial 50% advance invoice link.
2. **Client Portals:** Set up a free **Notion** workspace. Create a template page that acts as the client dashboard (tracking project milestones, storing uploaded assets, and housing standard operating procedures).
3. **Intake Forms:** Create a free Google Form or Tally.so link to collect their logos, domain passwords, and brand colors immediately after they pay the advance.

---

## Phase 5: Go-to-Market & Sales (Day 17+)

With the infrastructure running, activate your dual-engine outreach strategy.

**The Local Engine (Mornings/Afternoons):**

1. **Targeting:** Identify local coaching institutes, CA firms, and mid-sized distributors in your city or region.
2. **Outreach:** Drop a brief, friendly WhatsApp message or email. Do not pitch code. Pitch the result: *"I help local businesses automate their GST invoice entry and student fee tracking. Can I send you a 30-second video of how it works?"*
3. **Demonstration:** Send them the direct link to your Invoice Extractor demo.

**The Global Engine (Evenings):**

1. **Targeting:** Optimize your LinkedIn and Upwork profiles to highlight "FastAPI, Angular, and AI Agent Development."
2. **Outreach:** Search for startups looking to build MVPs or integrate AI workflows.
3. **Demonstration:** Point them to your CRM Profiler demo and your GitHub repositories. Highlight your ability to deliver secure, asynchronous backends and clean frontends.
