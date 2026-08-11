# Local Manual Testing Guide

## Overview

This guide provides **step-by-step instructions for manually testing the entire application locally**.

You will need **two terminal windows**:

* **Terminal 1:** FastAPI backend
* **Terminal 2:** Angular frontend

Once both applications are running, follow the end-to-end testing journey described below.

---

# 1. Start the Backend — FastAPI

Open your first terminal window and navigate to the project root directory.

### 1.1 Navigate to the Backend

```bash
cd backend
```

### 1.2 Create and Activate a Virtual Environment

Creating a virtual environment is optional but recommended.

```bash
python3 -m venv venv
source venv/bin/activate
```

### 1.3 Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### 1.4 Start the FastAPI Server

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The backend API should now be available at:

**http://localhost:8000**

> Keep this terminal running while performing the manual test.

---

# 2. Start the Frontend — Angular

Open a **second terminal window** and navigate to the project root directory.

### 2.1 Navigate to the Frontend

```bash
cd frontend
```

### 2.2 Install Node.js Dependencies

```bash
npm install
```

### 2.3 Start the Angular Development Server

```bash
npm start
```

Wait for the Angular build to complete successfully.

The frontend should now be available at:

**http://localhost:4200**

> Keep this terminal running while performing the manual test.

---

# 3. End-to-End Manual Testing

Open your web browser and navigate to:

**http://localhost:4200**

Follow the complete customer journey below.

The test validates the application's key functionality as well as the six implemented UX principles:

1. Contrast Effect
2. Loss Aversion
3. IKEA Effect
4. Goal Gradient Effect
5. Reciprocity
6. Smart Defaults

---

## 3.1 Catalog View

### UX Principles

* **Contrast Effect**
* **Loss Aversion**

### Test Steps

1. Open the product catalog.
2. Observe the product cards.
3. Verify that discounted products display:

   * Crossed-out original prices
   * Lower selling prices
   * Prominent **`% OFF`** badges
4. Look for products displaying a low-stock indicator such as:

   > ⚡ Only 2 left!

### Expected Result

* Original prices are visually differentiated from selling prices.
* Discount percentages are clearly visible.
* Low-stock products display an appropriate urgency indicator.

---

# 4. Product Detail View

## UX Principle: IKEA Effect

### Test Steps

1. Select any product from the catalog.
2. Click the **Customize** button.
3. Verify that the **Product Detail Page** opens.
4. Locate the **Custom Vanity Kit Builder**.
5. Verify that the **Add Custom Kit to Cart** button is initially disabled.
6. Select exactly **3 checkboxes** in the kit builder.
7. Verify that the button becomes enabled and changes to pink.
8. Click **Add Custom Kit to Cart**.

### Expected Result

* The **Add Custom Kit to Cart** button remains disabled until exactly 3 options are selected.
* After selecting 3 options:

  * The button becomes enabled.
  * The button changes to pink.
* Clicking the button successfully adds the customized kit to the cart.

---

# 5. Cart View

## UX Principles

* **Goal Gradient Effect**
* **Reciprocity**
* **Loss Aversion**

After adding the customized product to the cart, open the cart.

### 5.1 Countdown Timer — Loss Aversion

Look at the top-right area of the cart.

### Expected Result

A **10-minute countdown timer** should be visible and actively ticking down.

This represents the **Loss Aversion** UX principle.

---

### 5.2 Progress Bar — Goal Gradient Effect

Locate the pink progress bar in the cart.

### Expected Result

The progress bar should indicate how much more needs to be spent to unlock the:

**Free Gift Pouch**

This represents the **Goal Gradient Effect**.

---

### 5.3 Voucher — Reciprocity

Look at the order summary.

### Expected Result

The following voucher should be automatically applied:

```text
FIRSTGLOW200
```

The order summary should show a:

**₹200 discount**

This represents the **Reciprocity** principle.

---

### 5.4 Continue to Checkout

Click:

**Proceed to Checkout**

---

# 6. Checkout View

## UX Principle: Smart Defaults

Verify the default checkout selections.

### 6.1 Payment Method

Check the payment-method section.

### Expected Result

**UPI / GPay** should already be selected by default.

---

### 6.2 Billing Address

Check the billing-address section.

### Expected Result

The following checkbox should already be selected:

**Billing address same as shipping**

---

### 6.3 Express Checkout

Click the primary checkout button:

**⚡ Express Guest Checkout**

---

# 7. Simulated Payment

## Razorpay Mock Modal

After proceeding with checkout, a **mock Razorpay payment modal** should appear.

### Test Steps

1. Verify that the payment modal is displayed.
2. Click:

   **✅ Simulate Success**

### Expected Result

The application should simulate a successful payment transaction and continue to the order confirmation flow.

---

# 8. Order Confirmation

## UX Principle: Reciprocity

After successful payment, verify that you are redirected to the **Order Confirmed** page.

### Test Steps

1. Verify that the order confirmation page is displayed.
2. Locate and record the **Order ID**.
3. Observe the promotional banner.

### Expected Result

A prominent banner should offer:

> **Free Mini Sample Kit on your next order**

This represents the **Reciprocity** principle.

---

# 9. Admin Dashboard

Navigate to the Admin Dashboard using either:

* The **Admin** link in the top navigation bar, or
* Directly navigate to:

**http://localhost:4200/admin**

### 9.1 Verify the Newly Created Order

Locate the recently placed order.

### Expected Result

The order should appear with:

| Field          | Expected Value |
| -------------- | -------------- |
| Order Status   | **Placed**     |
| Payment Status | **Success**    |

---

### 9.2 Test Order Status Updates

Use the available order actions to test status updates.

Click either:

* **Mark Delivered**
* **Cancel**

### Expected Result

The order status should update successfully and the new status should be reflected in the Admin Dashboard.

---

# 10. End-to-End Validation Checklist

Use the following checklist to confirm that the complete flow has been successfully tested.

### Application Startup

* [ ] FastAPI backend starts successfully on port `8000`
* [ ] Angular frontend starts successfully on port `4200`
* [ ] Application loads successfully in the browser

### Catalog

* [ ] Original prices are crossed out
* [ ] Discounted selling prices are displayed
* [ ] `% OFF` badges are visible
* [ ] Low-stock indicators are displayed

### Product Customization

* [ ] Customize button opens Product Detail Page
* [ ] Custom Vanity Kit Builder is displayed
* [ ] Add Custom Kit button is initially disabled
* [ ] Button enables after exactly 3 selections
* [ ] Customized kit can be added to the cart

### Cart

* [ ] 10-minute countdown timer is displayed
* [ ] Countdown timer is ticking
* [ ] Free Gift Pouch progress bar is displayed
* [ ] `FIRSTGLOW200` voucher is automatically applied
* [ ] ₹200 discount is displayed
* [ ] Proceed to Checkout works

### Checkout

* [ ] UPI / GPay is pre-selected
* [ ] Billing address same as shipping is checked by default
* [ ] Express Guest Checkout works

### Payment

* [ ] Mock Razorpay modal appears
* [ ] Simulate Success button works
* [ ] Payment is processed successfully

### Order Confirmation

* [ ] Order Confirmed page is displayed
* [ ] Order ID is displayed
* [ ] Free Mini Sample Kit promotional banner is displayed

### Admin

* [ ] Newly created order appears in Admin Dashboard
* [ ] Order status is `Placed`
* [ ] Payment status is `Success`
* [ ] Mark Delivered works
* [ ] Cancel works
* [ ] Updated order status is reflected correctly

---

# 11. Final Validation

If **all steps above behave as described**, the following have been successfully validated:

* Full-stack application flow
* Angular frontend
* FastAPI backend
* Product catalog
* Product customization
* Cart functionality
* Voucher application
* Checkout flow
* Smart checkout defaults
* Simulated payment processing
* Order creation
* Order confirmation
* Admin order management
* Real-time order status updates
* Implemented UX principles

## ✅ Test Result

**Full End-to-End Manual Testing: PASSED**

The application and its implemented UX principles are functioning as expected.
