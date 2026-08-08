Since you are technical and comfortable configuring DNS records, you can bypass all the standard monthly subscriptions. The only mandatory cost to launch this business is the raw wholesale price of the domain name (roughly $1 to $10 per year). Everything else can be achieved using free tiers and technical workarounds.

Here is your ultra-low-cost, highly technical stack to get online.

---

## 1. Domain Registration (Cost: ~$1 – $10/year)

Do not use GoDaddy, Wix, or standard website builders to buy your domain—they heavily mark up renewal prices and charge for privacy.

* **Cloudflare Registrar:** They sell domains at wholesale cost with zero markup and include free WHOIS privacy.
* **Porkbun:** If Cloudflare doesn't support your desired TLD (like `.tech` or `.io`), Porkbun usually has the cheapest introductory rates and very low renewals.

## 2. Professional Email Workarounds (Cost: $0)

You need an email like `hello@yourdomain.com`. Instead of paying $6/month for Google Workspace, you have two excellent free workarounds:

**Option A: The Cloudflare + Gmail + Resend Hub (Best for using Gmail)**

1. **Receive:** Set up **Cloudflare Email Routing** (free). Add the required MX and TXT records to route incoming mail from `hello@yourdomain.com` directly to your personal `@gmail.com` inbox.
2. **Send:** To reply as your custom domain, create a free account on an SMTP relay service like **Resend** (3,000 free emails/month) or **Brevo**.
3. **Configure:** In your personal Gmail, go to Settings -> "Accounts and Import" -> "Send mail as." Add your custom domain and input the SMTP credentials from Resend/Brevo. Your personal Gmail is now a full business hub.

**Option B: Zoho Mail "Forever Free" Plan (Best for isolation)**
Zoho hides this plan well, but it still exists. It gives you 5 users and 5GB of storage per user on your custom domain for exactly $0.

* **The Catch:** It does not support IMAP/POP3. You cannot hook it up to desktop Outlook or Apple Mail. You must use the Zoho web browser interface or the official Zoho mobile app. If you are okay with that, it is a flawless, enterprise-grade free solution.

## 3. Website Hosting & Implementation (Cost: $0)

Since you are technical, you can easily bypass Squarespace and Wix subscriptions.

**Option A: Google Sites (The No-Code Route)**
Google Sites is 100% free and does not force ads onto your site.

* **The Workaround:** Build your site, then go to Google Search Console to verify domain ownership via a TXT record. Once verified, you can map your custom domain by pointing a CNAME record to `ghs.googlehosted.com`.

**Option B: Cloudflare Pages or GitHub Pages (The Developer Route)**
If you want a site that looks like a high-end agency (Framer quality) without the Framer price tag:

1. Find a free HTML5/Tailwind CSS portfolio template online (e.g., HTML5 UP, Cruip).
2. Customize the code with your services.
3. Push the code to a GitHub repository.
4. Connect the repo to **Cloudflare Pages** or **Netlify**. They will host the site on their global CDN, automatically provision a free SSL certificate, and let you map your custom domain for absolutely $0.

## 4. Free Operations & Freelance Stack (Cost: $0)

You don't need paid software to look incredibly professional to your first clients.

* **Scheduling:** Use **Cal.com**. It is open-source and their free tier allows unlimited bookings and calendar connections.
* **Invoicing & Accounting:** Use **Wave Apps**. The software is 100% free for generating professional invoices and tracking expenses. You only pay standard credit card processing fees if the client chooses to pay via credit card through the invoice.
* **Client Portals:** Use the free tier of **Notion**. You can create a dashboard page for each client, share the link with them, and track project status, share passwords securely, and store standard operating procedures.
