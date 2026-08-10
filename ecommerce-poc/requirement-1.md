Here is the adapted **Full-Stack Blueprint (Angular + Python / FastAPI)** specifically tailored for the **Indian Cosmetics, Makeup, and Grooming market** using Indian Rupee (₹/INR) metrics and localized product categories.

---

## 🛠️ Tech Stack & Architecture Spec

* **Frontend:** Angular (v16+) + Tailwind CSS + Angular Material
* **State Management:** RxJS BehaviorSubjects or Signals (for cart state, dynamic discounts, and timer countdowns)
* **Backend:** Python 3.11+ with **FastAPI** (In-memory mock API; no SQL database required)
* **Currency Format:** INR (`₹`) formatted with Indian numbering notation (e.g., `₹1,499`)

---

## 🛍️ E-Commerce Features (Mapped to 6 UX Principles)

| # | Psychological Principle | Feature Name | Angular (Frontend) UX Implementation | Python / FastAPI (Backend) API Response |
| --- | --- | --- | --- | --- |
| **1** | **Smart Defaults** | **Express Grooming Checkout** | • Pre-selects **"UPI / GPay"** as default payment method.<br>

<br>• Pre-checks "Billing same as Shipping".<br>

<br>• Pre-fills standard address lookup (e.g., *"Pincode: 400001 - Mumbai"*). | `GET /api/v1/checkout/defaults`<br>

<br>Returns INR default shipping charges (`₹0` for orders above `₹499`), pre-selected payment option (`UPI`), and PIN code fallback. |
| **2** | **Goal Gradient Effect** | **Free Gift & Express Delivery Progress** | • Global header bar pre-filled at **30%** ("Welcome Kit Unlocked").<br>

<br>• Dynamic tracker: *"Add ₹150 more to unlock Free Nykaa/Beardo Trial Pouch!"* | `GET /api/v1/cart/progress`<br>

<br>Calculates percentage toward free express shipping / free gift threshold (`₹999`). |
| **3** | **Reciprocity** | **Instant Free Sample / First-Buy Voucher** | • Top floating bar automatically grants a **₹200 Instant Welcome Voucher** before asking for phone number/login. | `GET /api/v1/discounts/welcome`<br>

<br>Returns voucher code `FIRSTGLOW200` with instant price reduction breakdown in INR. |
| **4** | **The IKEA Effect** | **Shade Matcher & Custom Vanity Kit Builder** | • Interactive PDP where users build their own 3-piece makeup/grooming kit (e.g., *Lipstick shade + Kajal + Highlighter* or *Beard Oil + Trimmer + Wash*). | `POST /api/v1/products/customize`<br>

<br>Accepts custom selected shades/options and returns a customized product bundle payload. |
| **5** | **Loss Aversion** | **Flash Beauty Sale Reservation** | • Sticky 10-minute timer header (`09:59`): *"Your ₹200 discount and reserved shades expire in 09:59."*<br>

<br>• Low-stock warning: *"⚡ Only 3 units left in shade 'Peachy Affair'."* | `GET /api/v1/cart/reservation`<br>

<br>Returns cart lock expiry timestamp and item stock availability metrics. |
| **6** | **Contrast Effect** | **Anchored MRP vs. Selling Price** | • Displays high strike-through MRPs (e.g., ~~`₹1,499`~~ **`₹799`**) alongside a *"Save 46%"* badge.<br>

<br>• Default catalog sort set to **"Best Value / Highest Rated"**. | `GET /api/v1/products`<br>

<br>Returns catalog sorted by best value with `mrp_inr` and `selling_price_inr`. |

---

## 🔌 FastAPI Sample Implementation (`main.py`)

Here is the Python FastAPI backend providing sample Indian cosmetics and grooming data:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI(title="Indian Beauty & Grooming UX POC API")

# Enable CORS for Angular local server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Sample In-Memory Data (INR Cosmetics & Grooming) ---
COSMETICS_PRODUCTS = [
    {
        "id": "cosm-01",
        "name": "Velvet Matte Liquid Lipstick & Liner Duo",
        "mrp_inr": 999.00,             # Contrast Effect: High Anchor MRP
        "selling_price_inr": 549.00,
        "stock_count": 3,               # Loss Aversion: Low stock
        "category": "Makeup",
        "is_customizable": True,
        "shades": ["Peachy Affair", "Ruby Red", "Plum Passion"],
        "badge": "Bestseller"
    },
    {
        "id": "groom-02",
        "name": "Precision Beard Trimmer & Styling Kit",
        "mrp_inr": 2199.00,            # Contrast Effect
        "selling_price_inr": 1199.00,
        "stock_count": 5,
        "category": "Grooming",
        "is_customizable": False,
        "badge": "46% OFF"
    },
    {
        "id": "cosm-03",
        "name": "Glow Contour & Highlighter Palette",
        "mrp_inr": 750.00,
        "selling_price_inr": 425.00,
        "stock_count": 2,
        "category": "Makeup",
        "is_customizable": True,
        "shades": ["Champagne Glow", "Rose Gold"],
        "badge": "Trending"
    }
]

@app.get("/api/v1/products")
def get_products():
    """Returns cosmetics/grooming catalog in INR with anchor MRPs."""
    return {"currency": "INR", "products": COSMETICS_PRODUCTS, "default_sort": "best_value"}

@app.get("/api/v1/checkout/defaults")
def get_checkout_defaults():
    """Smart Defaults: Pre-selected UPI and auto-detected Indian city."""
    return {
        "guest_checkout": True,
        "preferred_payment": "UPI / GPay",
        "billing_same_as_shipping": True,
        "shipping_fee_inr": 0,
        "suggested_city": "Mumbai, Maharashtra",
        "suggested_pincode": "400001"
    }

@app.get("/api/v1/discounts/welcome")
def get_welcome_discount():
    """Reciprocity: Automatic ₹200 Welcome Gift."""
    return {
        "voucher_code": "FIRSTGLOW200",
        "discount_amount_inr": 200.00,
        "min_order_inr": 499.00,
        "message": "Instant ₹200 Beauty Voucher Auto-Applied!"
    }

```

---

## 🚀 Prompt Template to Give Your AI Coding Agent

Copy and paste this prompt directly to your AI agent (Cursor, Claude, Bolt, etc.):

```text
Build a Proof of Concept (POC) E-commerce application for the Indian Beauty, Cosmetics, and Grooming market using Angular (v16+) for the frontend and Python FastAPI for the backend. Use INR (₹) currency formatting. No database required; use in-memory mock JSON data in FastAPI.

Backend Requirements (Python / FastAPI):
- Create API endpoints for:
  1. GET /api/v1/products (Returns catalog with mrp_inr and selling_price_inr for Anchoring/Contrast Effect).
  2. GET /api/v1/checkout/defaults (Smart Defaults: UPI pre-selected, pre-checked billing toggles, default ₹0 shipping).
  3. GET /api/v1/discounts/welcome (Reciprocity: auto-applied ₹200 FIRSTGLOW200 voucher).
  4. POST /api/v1/products/customize (The IKEA Effect: receives customized makeup/grooming kit choices and returns updated payload).

Frontend Requirements (Angular + Tailwind CSS):
- Global Header with a Free Express Delivery progress bar starting at 30% towards ₹999 (Goal Gradient Effect).
- Product Catalog displaying items like Liquid Lipsticks, Beard Trimmers, and Highlighter Palettes with strikethrough MRPs (e.g., ₹999 -> ₹549).
- Interactive "Build Your Own Beauty / Grooming Kit" component (The IKEA Effect) allowing users to pick lipstick shades or grooming attachments.
- Cart Drawer component featuring:
  - Auto-applied ₹200 voucher (Reciprocity).
  - 10-minute cart reservation countdown timer header (Loss Aversion).
  - Low stock warning badges ("Only 2 left in Peachy Affair").
- Checkout component using Smart Defaults (UPI pre-selected as default, Guest Checkout CTA).

Ensure modern styling with Tailwind CSS, clean INR currency formatting (₹), and smooth Angular RxJS/Signals state updates.

```
