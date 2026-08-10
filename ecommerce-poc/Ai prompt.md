Here is the complete, master task prompt for **Jules**. You can copy and paste this directly into your Jules session:

---

### 🤖 Master Task Prompt for Jules

**Project Context & Goal:**
You are tasked with implementing a full-stack Proof of Concept (POC) E-Commerce Application for the Indian Beauty, Cosmetics & Grooming Market. The repository already contains the initial folder structure (`frontend/` for Angular and `backend/` for FastAPI).

The core objective is to showcase **6 Psychological UX Principles** across a complete end-to-end shopping journey (from catalog to simulated payment and admin order management). Currency must be formatted in Indian Rupees (`₹`). No SQL database is needed; state should be managed in Angular (Signals/RxJS) and synchronized with Python FastAPI in-memory mock endpoints.

---

### 1. Backend Specifications (`backend/main.py`)

Implement Python FastAPI endpoints with CORS enabled for `http://localhost:4200`:

* **`GET /api/v1/products`**: Return Indian cosmetics/grooming catalog items (e.g., Matte Liquid Lipsticks, Beard Trimmers, Highlighter Palettes) in INR (`₹`) with high anchor MRPs (`mrp_inr`) and discounted selling prices (`selling_price_inr`).
* **`GET /api/v1/checkout/defaults`**: Return pre-selected payment preference (`"UPI / GPay"`), default shipping fee (`0`), and address defaults (`pincode: "400001", city: "Mumbai"`).
* **`GET /api/v1/discounts/welcome`**: Return auto-applied voucher `FIRSTGLOW200` (`discount_amount_inr: 200`).
* **`POST /api/v1/products/customize`**: Accept custom shade or kit selections and return a customized product bundle payload.
* **`POST /api/v1/cart/checkout`**: Create an order with status `Placed` and return an `order_id` along with mock Razorpay transaction details.
* **`POST /api/v1/payment/verify-sandbox`**: Accept mock payment verification (`SUCCESS` or `FAILED`) and update order payment status.
* **`GET /api/v1/admin/orders`**: Return all created orders for the Admin Dashboard.
* **`PATCH /api/v1/admin/orders/{order_id}`**: Update order status (`Delivered` or `Cancelled`).

---

### 2. Frontend Specifications & 6 UX Principles (`frontend/`)

Build a responsive Angular (v16+) UI styled with Tailwind CSS enforcing these 6 behavioral design patterns:

1. **Contrast Effect (Catalog & Pricing UI):**
* Display product cards with crossed-out MRPs (e.g., ~~₹999~~ **₹549**) and prominent percentage-off badges (e.g., `45% OFF`).
* Default catalog sorting set to **"Best Value / Bestsellers"**.


2. **The IKEA Effect (Interactive Product Customizer PDP):**
* Build a "Custom Vanity Kit Builder" component on the Product Detail view allowing users to select 3 custom shades or grooming attachments before adding the kit to their cart.


3. **Reciprocity (Upfront & Post-Purchase Value):**
* Auto-apply the ₹200 voucher (`FIRSTGLOW200`) to the cart drawer on initial load without requiring user sign-in.
* On the Order Confirmation view, present an instant bonus offer (*"Claim your Free Mini Sample Kit on your next order"*).


4. **Goal Gradient Effect (Visual Progress Tracking):**
* Sticky top header progress bar pre-filled at **30%** ("Welcome Kit Unlocked").
* Dynamic cart progress bar: *"Add ₹150 more to reach ₹999 for Free Gift Pouch & Express Delivery"*.


5. **Loss Aversion (Scarcity & Reservation Urgency):**
* Active 10-minute cart reservation countdown timer (`09:59`) displayed in the cart drawer and checkout header.
* Low-stock urgency tags on PDP items (*"⚡ Only 2 left in Peachy Affair"*).


6. **Smart Defaults (Frictionless Checkout):**
* Pre-select **"UPI / GPay"** as the default payment option.
* Pre-check **"Billing address same as shipping"**.
* Provide a primary **"Express Guest Checkout"** CTA button.



---

### 3. Functional Completion Features

* **Razorpay / UPI Sandbox Modal:**
* When clicking "Pay with UPI / Razorpay", trigger a styled modal simulating the Razorpay checkout overlay.
* Pre-fill a test UPI handle (`success@razorpay`) and provide "Simulate Payment Success" and "Simulate Payment Failure" buttons.
* Successful payment advances the user to the **Order Confirmation Screen**.


* **Admin Order Dashboard (`/admin` or Header Navigation Toggle):**
* Provide an Admin view listing all placed orders.
* Display Order ID, Purchased Items, Total Amount (`₹`), Payment Status, and Order Status.
* Action controls: **"Mark as Delivered"** and **"Cancel Order"** buttons that update state in real time across the app.



---

### 4. Definition of Done

* All code generated in `backend/` and `frontend/` folders.
* Angular builds without TypeScript errors.
* FastAPI runs cleanly with Uvicorn.
* The full user path works end-to-end: **Catalog → Customizer → Cart (Voucher + Countdown) → Checkout → Razorpay Sandbox → Order Confirmation → Admin View (Mark Delivered/Cancelled)**.

---

### Quick Verification Commands

Once Jules completes the implementation, test the application locally:

1. **Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000

```


2. **Frontend:**
```bash
cd frontend
ng serve --open

```
