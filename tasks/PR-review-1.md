This specific error—`dial tcp: lookup auth.docker.io on [::1]:53: read udp [::1]:43197->[::1]:53: read: connection refused`—is a known network-bridging issue in Windows WSL2. 

The error tells us that **Docker's build engine (BuildKit) is aggressively trying to resolve DNS via IPv6 loopback (`[::1]`)** instead of using IPv4, and failing because there is no IPv6 DNS server listening inside WSL.

As your Principal Architect, here are the three cleanest ways to fix this, ordered from the most common Docker-specific fix to a universal WSL-level override.

---

### **Method 1: Force the Docker Daemon to Use IPv4 DNS (Most Reliable)**
We can bypass WSL's dynamic DNS bridging entirely by telling the Docker daemon to explicitly use public IPv4 DNS servers (like Google and Cloudflare) when pulling images.

#### **If you are using Docker Desktop for Windows (with WSL2 Integration):**
1. Open the **Docker Desktop** dashboard in Windows.
2. Click the **Gear Icon (Settings)** in the top right.
3. Select **Docker Engine** from the left-hand menu.
4. In the JSON configuration editor, add `"dns": ["8.8.8.8", "1.1.1.1"]` to the root JSON object. For example:
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
5. Click **Apply & restart**.

#### **If you are running native Docker Engine directly in WSL (No Docker Desktop):**
1. Edit (or create) the daemon config file inside WSL:
   ```bash
   sudo nano /etc/docker/daemon.json
   ```
2. Paste the following configuration:
   ```json
   {
     "dns": ["8.8.8.8", "1.1.1.1"]
   }
   ```
3. Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X`), then restart the Docker service:
   ```bash
   sudo service docker restart
   ```

---

### **Method 2: Disable IPv6 Loopbacks in WSL2 (WSL Global Fix)**
If Windows has IPv6 enabled, WSL2 tries to bridge it, but Docker's internal container networking often breaks on the virtual switch. We can force WSL to operate strictly in IPv4.

1. On your **Windows host** (not inside WSL), open File Explorer and go to your User Profile folder:
   * Run (`Win + R`) and type: `%USERPROFILE%` (this takes you to `C:\Users\YourUsername`).
2. Check if a file named **`.wslconfig`** exists. If it does not, create a new text file and name it exactly `.wslconfig` (ensure there is no `.txt` extension).
3. Open it in Notepad and add the following lines to disable IPv6:
   ```ini
   [wsl2]
   ipv6=false
   ```
4. Save the file.
5. Open a **Windows PowerShell** or Command Prompt window and shut down your WSL subsystem to apply the new hardware boundaries:
   ```powershell
   wsl --shutdown
   ```
6. Reopen your WSL terminal, go back to your repository, and try building again:
   ```bash
   docker compose build --no-cache
   ```

---

### **Method 3: Quick Bypass—Disable BuildKit temporarily**
If you are in a rush to test and want to bypass BuildKit's isolated network namespace entirely, you can force Docker to use the legacy image builder, which inherits your host's network settings directly:

```bash
DOCKER_BUILDKIT=0 docker compose build --no-cache
```

***

🐳 Let me know if Method 1 or Method 2 successfully gets your database compiling in WSL! Once you get a successful build, we can green-light Jules to start scaffold operations.
