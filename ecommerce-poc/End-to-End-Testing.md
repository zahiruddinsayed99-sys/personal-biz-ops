## Instruction Here are the step-by-step instructions to manually test the entire application locally. You will need two terminal windows open—one for the backend and one for the frontend.
## Step 1: Start the Backend (FastAPI)
Open your terminal and navigate to the project root directory.
Change into the backend directory:
cd backend
Set up a virtual environment (optional but recommended) and install the dependencies:
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
Start the FastAPI server using Uvicorn:
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
(The backend API will now be running at http://localhost:8000)
## Step 2: Start the Frontend (Angular)
Open a second terminal window and navigate to the project root directory.
Change into the frontend directory:
cd frontend
Install the required Node.js packages:
npm install
Start the Angular development server:
npm start
(Wait for the build to finish. The frontend will be accessible at http://localhost:4200)
## Step 3: Execute the End-to-End Manual Testing Flow
Now, open your web browser and navigate to http://localhost:4200. Follow this journey to verify all 6 UX principles:

Catalog View (Contrast Effect & Loss Aversion):

Observe the product cards. You should see crossed-out original prices next to lower selling prices and prominent "% OFF" badges.
Look for the low-stock tag (e.g., "⚡ Only 2 left!") on certain products.
Product Detail View (The IKEA Effect):

Click the "Customize" button on any product.
On the Product Detail Page, find the "Custom Vanity Kit Builder".
Notice that the "Add Custom Kit to Cart" button is disabled. Select exactly 3 checkboxes.
Once 3 are selected, the button turns pink and enables. Click it to add the item to your cart.
Cart View (Goal Gradient, Reciprocity & Loss Aversion):

Timer: Look at the top right of the cart to see a 10-minute countdown timer ticking down (Loss Aversion).
Progress Bar: Look at the pink progress bar tracking how much more you need to spend to unlock a "Free Gift Pouch" (Goal Gradient Effect).
Voucher: Look at the order summary. You should see the FIRSTGLOW200 voucher automatically applied for a ₹200 discount (Reciprocity).
Click "Proceed to Checkout".
Checkout View (Smart Defaults):

Notice that the UPI / GPay payment method is already pre-selected.
Notice that the "Billing address same as shipping" checkbox is checked by default.
Click the primary "⚡ Express Guest Checkout" button.
Simulated Payment (Razorpay Modal):

A mock Razorpay modal will appear on the screen.
Click the "✅ Simulate Success" button to mock a successful transaction.
Order Confirmation (Reciprocity):

You should land on the Order Confirmed page.
Notice the Order ID.
Observe the large banner offering a "Free Mini Sample Kit on your next order" (Reciprocity).
Admin Dashboard:

Click the "Admin" link in the top navigation bar (or navigate to http://localhost:4200/admin).
You should see your recently placed order in the list with a status of "Placed" and payment as "Success".
Click "Mark Delivered" or "Cancel" to test the real-time status update functionality.
If all these steps behave as described, the full-stack application and all UX principles are working perfectly!
