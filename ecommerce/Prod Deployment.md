This is a very smart approach. Starting with the zero-cost PaaS setup allows you to get a live URL in your portfolio immediately, and saving the AWS setup for later gives you a great weekend project to level up your DevOps skills when you are ready.

Here are the complete, step-by-step guides for both deployment strategies. Bookmark or save this response for when you are ready to deploy.

---

## Strategy 2: The "Cold Start" PaaS (Zero Cost)

This strategy splits your application into three free services: Vercel (Frontend), Render (Backend & PostgreSQL), and Upstash/Render (Redis).

### Step 1: Deploy the Database & Redis

1. **PostgreSQL on Render:**
* Create an account on [Render.com](https://render.com).
* Click **New +** and select **PostgreSQL**.
* Name your database and select the **Free** instance type.
* Once created, copy the **Internal Database URL** (for the FastAPI service to use) and the **External Database URL** (if you need to inspect it via pgAdmin locally).


2. **Redis:**
* Render offers a free Redis tier. Click **New +**, select **Redis**, and choose the Free tier.
* Copy the **Internal Redis URL**.



### Step 2: Deploy the Backend (FastAPI on Render)

1. On Render, click **New +** and select **Web Service**.
2. Connect your GitHub account and select your `ecommerce-platform` repository.
3. Configure the service:
* **Root Directory:** `backend` (if your FastAPI code is in a backend folder).
* **Environment:** Python 3
* **Build Command:** `pip install -r requirements.txt`
* **Start Command:** `uvicorn main:app --host 0.0.0.0 --port 10000` (Render defaults to port 10000).
* **Instance Type:** Free.


4. Expand **Environment Variables** and add all your production keys:
* `DATABASE_URL`: (Paste the *Internal* PostgreSQL URL from Step 1)
* `REDIS_URL`: (Paste the *Internal* Redis URL from Step 1)
* `RAZORPAY_KEY_ID`: Your actual key.
* `RAZORPAY_KEY_SECRET`: Your actual secret.


5. Click **Create Web Service**. Render will build and deploy your API. Once finished, copy the live Render URL (e.g., `https://your-api.onrender.com`).

### Step 3: Deploy the Frontend (Angular on Vercel)

1. Create an account on [Vercel.com](https://vercel.com) and connect your GitHub.
2. Click **Add New -> Project** and import your `ecommerce-platform` repository.
3. Configure the project:
* **Framework Preset:** Angular
* **Root Directory:** `frontend/ecommerce-frontend`
* **Build Command:** `npm run build`
* **Output Directory:** `dist/ecommerce-frontend/browser` *(Note: Double-check your local `angular.json` for the exact output path).*


4. Expand **Environment Variables**:
* Add any variables your Angular app needs. Crucially, if you use process variables, make sure your API URL points to your new Render URL: `https://your-api.onrender.com/api`.


5. Click **Deploy**. Vercel will build the frontend and provide you with a live, SSL-secured URL you can put on your resume.

---

## Strategy 1: The AWS EC2 "Toggle Switch" (Maximum Resume Flex)

This strategy utilizes your existing `docker-compose.yml` to run the entire stack on a single AWS server.

### Step 1: Provision the Server

1. Create an [AWS Account](https://aws.amazon.com/) and navigate to the **EC2 Dashboard**.
2. Click **Launch Instance**.
3. **OS Image:** Select **Ubuntu Server 24.04 LTS** (Free tier eligible).
4. **Instance Type:** Select **t2.micro** or **t3.micro** (Free tier eligible).
5. **Key Pair:** Create a new key pair (e.g., `ecommerce-key.pem`), download it, and keep it safe. You need this to log into the server.
6. **Network Settings:** Check the boxes to **Allow SSH traffic** (Port 22), **Allow HTTP traffic** (Port 80), and **Allow HTTPS traffic** (Port 443).
7. Click **Launch Instance**.

### Step 2: Configure the Server

1. Open your local terminal, navigate to where you saved your `.pem` file, and set its permissions:
```bash
chmod 400 ecommerce-key.pem

```


2. SSH into your new server using the Public IPv4 address shown in the AWS console:
```bash
ssh -i "ecommerce-key.pem" ubuntu@<your-aws-public-ip>

```


3. Once inside the server, install Docker and Git:
```bash
sudo apt update
sudo apt install docker.io docker-compose git -y
sudo systemctl enable --now docker
sudo usermod -aG docker ubuntu

```


*(You may need to log out and log back in for the Docker permissions to take effect).*

### Step 3: Deploy the Stack

1. Clone your repository onto the server:
```bash
git clone https://github.com/zahiruddinsayed99-sys/ecommerce-platform.git
cd ecommerce-platform

```


2. Create your `.env` file directly on the server to hold your database passwords and Razorpay keys:
```bash
nano .env
# Paste your environment variables, then press Ctrl+X, Y, Enter to save.

```


3. Boot up the entire stack using your Docker Compose file:
```bash
docker-compose up -d --build

```


4. **Important:** By default, your frontend might be running on a specific port (like 4200). For a production setup, you would eventually want to add Nginx to your `docker-compose.yml` to route port 80 (HTTP) to your Angular container.

### Step 4: The "Toggle" Flow for Demos

* **To stop paying:** Go to your AWS EC2 Console, select your instance, click **Instance State**, and choose **Stop instance**. Your Docker containers will safely shut down, and AWS stops charging you for compute time.
* **To demo:** Go to the console and choose **Start instance**.
* *Note: Every time you stop and start an EC2 instance, AWS assigns it a new Public IP address (unless you pay for a static Elastic IP). You will need to access your app via the newly generated IP address in the console.*
