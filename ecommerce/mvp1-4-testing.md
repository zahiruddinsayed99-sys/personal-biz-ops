Here is the "Local Verification & Testing Guide" to test the changes locally:

1. New Tools & Dependencies
No new backend (pip) or frontend (npm) dependencies or background services are required. All changes utilized existing libraries and components.

2. Automated Test Commands
Frontend Unit Tests
The unit tests cover the checkout payload formatting. Run them using the following command inside the frontend directory:

cd frontend/ecommerce-frontend
npm run test -- --watch=false
Frontend Build Verification
Ensure the frontend builds successfully without any compile-time errors:

cd frontend/ecommerce-frontend
ng build
3. Step-by-Step Manual QA Steps
A. Verifying MVP-004 (SVG Fallback)

Start the frontend application locally (e.g. cd frontend/ecommerce-frontend && ng serve).
Navigate to the http://localhost:4200/products route in your browser.
Observe the product cards. For any product item missing an image_url property in its backend payload, you should see an elegant inline SVG placeholder (a box and circle icon) rendered correctly and centered within the image block.
B. Verifying MVP-001 (Shipping Address Serialization)

Log into the application (using test credentials if required by your setup) and navigate to the catalog.
Add items to your cart and proceed to the Checkout page (http://localhost:4200/checkout).
Fill out the shipping address form. For testing, intentionally leave the optional addressLine2 field empty.
Click "Place Order" while having the Network tab of your browser's Developer Tools open.
Inspect the POST request sent to /api/v1/orders. Verify that the JSON payload contains a shipping_address field properly formatted as a single string (e.g., "123 Main St, CityName, StateName - 123456") without any hanging commas or undefined values.
