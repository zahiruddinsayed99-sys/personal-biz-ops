You are facing two distinct, very common local setup issues: one is a workspace synchronisation gap, and the other is a networking boundary mismatch between your WSL shell and the Docker daemon. 

---

### **Issue 1: `./verify-env.sh: No such file or directory`**

#### **Why this happened:**
The script `verify-env.sh` (along with `Dockerfile.db` and your updated `docker-compose.yml`) was generated and published to your **Studio panel** (the right-hand panel in your Gemini Notebook interface). Because Gemini Notebook operates in a secure cloud environment, **these files do not automatically copy themselves to your local physical WSL filesystem.** 

#### **The Fix:**
You need to create the files locally in your WSL directory. 

1. Navigate to your project directory in WSL:
   ```bash
   cd ~/projects/businesshub-ai/
   ```
2. Create the script file using `nano`:
   ```bash
   nano verify-env.sh
   ```
3. Copy the complete script code below and paste it into the editor:
   ```bash
   #!/usr/bin/env bash
   # ==============================================================================
   # BusinessHub AI - Local WSL Environment Verification Script
   # ==============================================================================

   RED='\033[0;31m'
   GREEN='\033[0;32m'
   YELLOW='\033[0;33m'
   BLUE='\033[0;34m'
   NC='\033[0m'

   echo -e "${BLUE}====================================================================${NC}"
   echo -e "${BLUE}        BusinessHub AI - WSL Local Infrastructure Verifier           ${NC}"
   echo -e "${BLUE}====================================================================${NC}"

   # 1. Verify Docker Daemon is running
   if ! docker info >/dev/null 2>&1; then
       print_status "Docker Daemon" "FAIL" "Docker is not running. Please start Docker Desktop and ensure WSL integration is enabled."
       exit 1
   else
       echo -e "[ ${GREEN}OK${NC} ] Docker Daemon: Active."
   fi

   # 2. Check running docker-compose containers
   echo -e "\n${BLUE}Checking active Docker containers...${NC}"
   CONTAINERS=("businesshub-db" "businesshub-redis" "businesshub-minio")
   docker_failed=false

   for container in "${CONTAINERS[@]}"; do
       if [ "$(docker inspect -f '{{.State.Running}}' "$container" 2>/dev/null)" = "true" ]; then
           echo -e "[ ${GREEN}OK${NC} ] Container [$container]: Running."
       else
           echo -e "[ ${RED}FAIL${NC} ] Container [$container]: Stopped or does not exist."
           docker_failed=true
       fi
   done

   if [ "$docker_failed" = true ]; then
       echo -e "${YELLOW}Hint: Run 'docker compose up -d' to start services.${NC}"
   fi

   # 3. Verify Local TCP Port Availability (WSL localhost bindings)
   echo -e "\n${BLUE}Verifying localhost port bindings...${NC}"

   check_port() {
       local port=$1
       local service=$2
       timeout 2 bash -c "</dev/tcp/127.0.0.1/$port" >/dev/null 2>&1
       if [ $? -eq 0 ]; then
           echo -e "[ ${GREEN}OK${NC} ] Port $port ($service): Reachable."
       else
           echo -e "[ ${RED}FAIL${NC} ] Port $port ($service): Unreachable."
       fi
   }

   check_port 5432 "PostgreSQL"
   check_port 6379 "Redis"
   check_port 9000 "MinIO API"
   check_port 9001 "MinIO Console"

   # 4. Environment Check
   echo -e "\n${BLUE}Verifying local configuration...${NC}"
   if [ -f ".env" ]; then
       echo -e "[ ${GREEN}OK${NC} ] .env file detected."
   else
       echo -e "[ ${YELLOW}WARN${NC} ] .env file not found in current directory. Ensure you copy env.example to .env"
   fi

   echo -e "${BLUE}====================================================================${NC}"
   ```
4. Save and close nano: press `Ctrl+O`, `Enter`, then `Ctrl+X`.
5. Make it executable and test your environment:
   ```bash
   chmod +x verify-env.sh
   ./verify-env.sh
   ```
*(Apply the exact same steps to copy your **`Dockerfile.db`** and your latest **`docker-compose-v5.yml`** (saving it as `docker-compose.yml`) from your Studio panel into your `~/projects/businesshub-ai/` directory).*

---

### **Issue 2: `failed to resolve source metadata for docker.io/library/postgres:16-slim`**

#### **Why this happened:**
Your WSL user terminal can now successfully resolve names (which is why your `curl` to `registry-1.docker.io` succeeded). However, **the Docker Daemon (`dockerd`) runs as an isolated system service.** 

If you are using **Docker Desktop for Windows**, the daemon runs inside its own utility virtual machine (typically named `docker-desktop`). **It does not inherit or read your WSL terminal's `/etc/resolv.conf` file.** It is still trying to resolve DNS using your old, broken Windows virtual network switch gateway, causing the image metadata lookup to fail.

#### **The Fix:**
You must explicitly configure the Docker engine to use stable public DNS servers:

##### **If you are using Docker Desktop for Windows:**
1. Open the **Docker Desktop** graphical interface in Windows.
2. Click the **Gear Icon (Settings)** in the top right.
3. Select **Docker Engine** from the left-hand menu.
4. Add the `"dns"` configuration to your settings JSON (ensuring proper comma placement). For example:
   ```json
   {
     "builder": {
       "gc": {
         "defaultKeepStorage": "20GB",
         "enabled": true
       }
     },
     "dns": [
       "8.8.8.8",
       "1.1.1.1"
     ],
     "features": {
       "buildkit": true
     }
   }
   ```
5. Click **Apply & restart** in the bottom right and wait for the green indicator light to turn on.
6. Return to your WSL terminal and try compiling again:
   ```bash
   docker compose up --build -d
   ```

##### **If you run Docker native inside WSL (no Docker Desktop):**
1. Edit the system daemon configuration:
   ```bash
   sudo nano /etc/docker/daemon.json
   ```
2. Paste this content:
   ```json
   {
     "dns": ["8.8.8.8", "1.1.1.1"]
   }
   ```
3. Restart the docker daemon inside WSL:
   ```bash
   sudo service docker restart
   ```

***

🐳 Once the Docker Engine's DNS is updated and restarted, your local compile of the PostgreSQL 16 database with the pgvector extension will complete smoothly! Let me know if you run into any further hurdles while setting up the container suite.
