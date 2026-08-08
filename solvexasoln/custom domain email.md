### 1. Porkbun (The Best Overall Choice for `.in`)

Since Cloudflare is out, Porkbun is your absolute best option for a `.in` domain.

* **The Cost:** They consistently offer one of the lowest, most transparent prices for `.in` domains (usually around $4 to $6 for the first year, with very reasonable, transparent renewals).
* **The Perks:** They include free WHOIS privacy and free SSL, and their dashboard is incredibly easy to use. You can still manage your DNS through Cloudflare for free—you just use Porkbun as your registrar.

### 2. BigRock or GoDaddy (The "First Year Promo" Route)

If you want to spend the absolute minimum *right now* and are okay with paying more later, Indian registrars offer massive first-year discounts.

* **The Cost:** BigRock and GoDaddy frequently run promos where you can get a `.in` domain for ₹1 or ₹99 for the first year.
* **The Catch:** To get the ₹1 deal, you often have to commit to a 2 or 3-year term, and the subsequent years are billed at a much higher rate (around ₹899/year). They also charge extra for WHOIS privacy protection, which Porkbun includes for free.

### The Recommended Setup

To get the best of both worlds (cheap domain + enterprise features):

1. Buy your `.in` domain at **Porkbun** for transparent, low-cost pricing.
2. Change the nameservers in Porkbun to point to **Cloudflare**.
3. Manage all your DNS records inside Cloudflare for free, which will allow you to easily set up your zero-cost Zoho Mail and host your Angular frontend on Cloudflare Pages.
---

### Step 1: Claim the Zoho "Forever Free" Plan

Zoho hides this plan well because they want you to pay, but it is fully functional and perfect for starting out.

1. Go to the **Zoho Mail Pricing** page.
2. Scroll all the way to the bottom, past the paid tiers. Look for a small section that says **"Forever Free Plan"** (up to 5 users, 5GB per user, web-only access).
3. Click **Sign Up Now**.
4. Choose **"Sign up with a domain I already own"** and enter your domain name (e.g., `solvexa.in`).
5. Enter your registration details and complete the sign-up.

### Step 2: Verify Domain Ownership in Cloudflare

Zoho needs to know you actually own the domain before they let you send emails on its behalf.

1. Inside the Zoho Mail admin console, it will ask you to verify your domain. Select **"Others"** or **"Cloudflare"** from their dropdown list.
2. Zoho will generate a specific **TXT Record** (it usually looks like `zoho-verification=12345...`).
3. Open a new tab, log into your **Cloudflare Dashboard**, and go to the **DNS > Records** section of your domain.
4. Click **Add Record**:
* **Type:** `TXT`
* **Name:** `@` (This stands for your root domain)
* **Content:** Paste the verification code Zoho gave you.
* **Proxy status:** N/A (DNS only)


5. Save the record, go back to Zoho, and click **Verify**. It might take a minute or two to propagate.

### Step 3: Configure the Mail Routing (MX Records)

Now that Zoho knows you own the domain, you have to tell Cloudflare to route all incoming mail to Zoho's servers.

1. In Cloudflare's **DNS > Records** tab, delete any existing MX records you might see (they might be pointing to your registrar's default parking page).
2. Add the following three **MX Records** exactly as Zoho provides them:
* **Record 1:** Type: `MX`, Name: `@`, Mail Server: `mx.zoho.com`, Priority: `10`
* **Record 2:** Type: `MX`, Name: `@`, Mail Server: `mx2.zoho.com`, Priority: `20`
* **Record 3:** Type: `MX`, Name: `@`, Mail Server: `mx3.zoho.com`, Priority: `50`



### Step 4: The Spam-Blocker Setup (SPF, DKIM, DMARC)

*Do not skip this step.* Since you will be emailing small business owners and global founders, your emails cannot end up in their spam folders.

**1. SPF (Sender Policy Framework):**
This tells email providers (like Gmail) that Zoho is authorized to send emails for Solvexa.

* In Cloudflare, add a new record:
* **Type:** `TXT`
* **Name:** `@`
* **Content:** `v=spf1 include:zoho.com ~all`



**2. DKIM (DomainKeys Identified Mail):**
This adds a cryptographic signature to your emails so servers know they weren't tampered with.

* In the Zoho Mail admin panel, go to **Settings > Domains > Email Configuration > DKIM**.
* Click **Add Selector** (name it something simple like `zmail`).
* Zoho will generate a long TXT value.
* Go to Cloudflare, add a new record:
* **Type:** `TXT`
* **Name:** `zmail._domainkey` (or whatever selector name you chose + `._domainkey`)
* **Content:** Paste the long code Zoho provided.



**3. DMARC (Optional but highly recommended):**
This is the final layer of trust.

* In Cloudflare, add a new record:
* **Type:** `TXT`
* **Name:** `_dmarc`
* **Content:** `v=DMARC1; p=none;`



### Step 5: Finalize Your Inbox

1. Go back to the Zoho setup wizard and click through the final steps.
2. It will ask you to create your actual email address. Type in `hello`, `contact`, or your first name.
3. Skip the mobile app download and user-migration steps for now.
4. Click **Go to Workplace**.

You are officially live. You can now log into Zoho Mail and send a test email to your personal Gmail account. If you followed Step 4 correctly, it will land directly in your primary inbox, looking 100% professional!
