---
title: "Day 06: SSH Hardening (Operation Bolted Door)"
description: "Disabling password-based logins and enforcing Ed25519 Cryptographic Key Authentication."
sidebar:
  order: 7
---

### Mission
**Operation Bolted Door:** Secure the Linux server by eliminating "knowledge-based" authentication (passwords) and enforcing "possession-based" authentication (Cryptographic Keys).

### The Vulnerability Landscape
By default, SSH (Port 22) allows password logins. This exposes the infrastructure to:
1.  **Brute Force Campaigns:** Botnets testing billions of common passwords per second.
2.  **Root Compromise:** If the `root` account has a weak password, a single breach grants total system control.

### Execution Log

#### 1. Cryptography Upgrade (Client-Side)
We generated an **Ed25519** key pair.
* *Why Ed25519?* It is an Elliptic Curve algorithm that is faster and more secure than legacy RSA-4096 keys.

```bash
# Generate the key pair with a comment
ssh-keygen -t ed25519 -C "nevin_devsecops"

```

#### 2. Key Installation

Transferred the public lock (`.pub` file) to the server's `authorized_keys` whitelist.

```powershell
# (Windows PowerShell Command)
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh nevin@192.168.234.128 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

```

#### 3. Daemon Hardening (`/etc/ssh/sshd_config`)

Modified the SSH daemon configuration to ban unsafe practices.

| Setting | Value | Reason |
| --- | --- | --- |
| `PermitRootLogin` | `no` | Prevents direct login as the 'God' user. Attackers must breach a low-privilege user first. |
| `PasswordAuthentication` | `no` | **CRITICAL:** Disables text passwords entirely. Brute force is now mathematically impossible. |
| `PubkeyAuthentication` | `yes` | Forces the use of SSH Keys. |
| `PermitEmptyPasswords` | `no` | Basic security hygiene. |

#### 4. Verification

* **Test:** Initiated `ssh nevin@192.168.234.128` from a fresh terminal.
* **Result:** Authenticated instantly without a password prompt.

### Security Philosophy

> "Security is not about making things impossible to break, but making them too expensive to break."

By removing passwords, we force attackers to steal a physical private key file rather than just guessing a string of characters.

