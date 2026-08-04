The permissions of `-rw-r--r--` are perfect, and your terminal output proves that the user `zahsay` can successfully read the file. 

The diagnostic data reveals a clear picture: **Your network routing is perfectly fine (which is why `ping 8.8.8.8` works), but outbound UDP Port 53 (DNS traffic) directly to the public internet is being dropped.** 

This is incredibly common in local environments. Your local ISP, router, or Windows Defender Firewall is blocking virtual machines from sending DNS requests directly to public servers like `8.8.8.8` or `1.1.1.1`. Instead, the network forces all machines to resolve DNS through your **Windows host's internal gateway**.

Here are the target actions to route around this block and get your connection restored immediately:

---

### **Action 1: Route DNS through your Windows Host Gateway**

Since WSL cannot talk to Google's DNS servers directly, we need to point `/etc/resolv.conf` back to your Windows host's virtual network card. Windows will intercept these queries and resolve them using its own active, working connection.

1.  **Find your Windows Host Gateway IP** by running this command in WSL:
    ```bash
    ip route show | grep default | awk '{print $3}'
    ```
    *(This will print an IP address, typically something like `172.22.16.1` or `192.168.1.1` depending on your WSL switch configuration).*

2.  **Unlock your resolv file:**
    ```bash
    sudo chattr -i /etc/resolv.conf
    ```

3.  **Overwrite `/etc/resolv.conf`** using the Gateway IP you found in Step 1:
    ```bash
    sudo sh -c 'echo "nameserver <REPLACE_WITH_YOUR_WSL_GATEWAY_IP>" > /etc/resolv.conf'
    ```

4.  **Relock the file** to prevent WSL from overwriting it:
    ```bash
    sudo chattr +i /etc/resolv.conf
    ```

5.  **Test name resolution:**
    ```bash
    curl -I https://registry-1.docker.io
    ```

---

### **Action 2: Double-Check the Location of `.wslconfig`**

If you configured **Mirrored Networking** in the previous step, it should have bypassed this port block entirely by tunneling DNS through Windows APIs. If it didn't, the `.wslconfig` file is likely in the wrong directory and is being ignored.

*   **.wslconfig is a Windows-level configuration file.** It must **not** be placed inside WSL (`/etc/` or `/home/zahsay`).
*   It must live in your **Windows User Profile folder**: `C:\Users\<YourWindowsUsername>\.wslconfig`.

To verify or create it correctly from inside your WSL terminal:
1.  Open the file directly on your Windows host mount (replace `<YourWindowsUsername>` with your actual Windows profile folder name):
    ```bash
    nano /mnt/c/Users/<YourWindowsUsername>/.wslconfig
    ```
2.  Ensure it contains exactly these lines:
    ```ini
    [wsl2]
    networkingMode=mirrored
    dnsTunneling=true
    firewall=true
    ipv6=false
    ```
3.  Save the file (`Ctrl+O`, `Enter`, `Ctrl+X`).
4.  Open **Windows PowerShell** (as Administrator) and force-kill WSL to apply the changes:
    ```powershell
    wsl --shutdown
    ```
5.  Reopen WSL and run your `curl` check.

---

### **Action 3: Verify `/etc/nsswitch.conf`**

If the Linux system's lookup configuration got altered, it might be ignoring DNS entirely.
Run:
```bash
cat /etc/nsswitch.conf | grep hosts
```
It should output:
```text
hosts:          files dns
```
If `dns` is missing from that line, edit the file (`sudo nano /etc/nsswitch.conf`) to add it back, as this tells Linux to use `/etc/resolv.conf` for looking up hostnames.

***

🌐 Try **Action 1** first (it's the most immediate bypass for local UDP port blocking), and let me know if your name resolution finally returns a clean HTTP response header!
