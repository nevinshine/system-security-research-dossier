---
title: "Day 07: Operation Counter-Strike (Fail2Ban)"
description: "Automating intrusion prevention by banning IPs that exhibit malicious behavior."
sidebar:
  order: 8
---

### Mission
**Operation Counter-Strike:** Automate the defense loop. Instead of just blocking ports, we deploy an active sentry that bans IP addresses showing malicious intent.

### The Problem
Even with SSH Keys (Day 6), bots can flood the server with thousands of connection attempts per hour.
* **Resource Drain:** Each handshake consumes CPU/RAM.
* **Log Pollution:** Thousands of "Failed Password" lines make it hard to spot real attacks.

### The Solution: Fail2Ban
**Fail2Ban** is an Intrusion Prevention Framework that monitors log files in real-time and dynamically updates firewall rules to punish offenders.



### Configuration Strategy
Installed `fail2ban` and configured a local jail (`/etc/fail2ban/jail.local`) to override defaults without breaking updates.

| Setting | Value | Reason |
| :--- | :--- | :--- |
| `bantime` | `1h` | Banned IPs are locked out for 1 hour (Punishment). |
| `maxretry` | `3` | 3 failed attempts = Immediate Ban (Strike Limit). |
| `backend` | `systemd` | Monitors system logs efficiently. |
| `action` | `iptables-multiport` | Blocks the attacker on ALL ports, not just SSH. |

### The "Sniper" Logic
1.  **Surveillance:** Fail2Ban scans `/var/log/auth.log` (or journald) using regex.
2.  **Trigger:** It detects patterns like `Failed password for root from <IP>`.
3.  **Action:** Once the `maxretry` threshold (3) is hit, it executes a `ban` action.
4.  **Enforcement:** It injects a `REJECT` rule into `iptables` / `ufw` specifically for that IP.

### Verification Log
To prove the system works, we ran a manual simulation:

```bash
# 1. Manually ban a test IP (Simulation)
sudo fail2ban-client set sshd banip 1.2.3.4

# 2. Check the Status
sudo fail2ban-client status sshd

```

**Result:**

```text
Status for the jail: sshd
|- Filter
|  |- Currently failed: 0
|  `- Total failed:     0
`- Actions
   |- Currently banned: 1
   `- Banned IP list:   1.2.3.4

```

### Key Takeaway

> "Security automation is the only way to scale."

We cannot watch logs 24/7. Fail2Ban acts as the automated immune system, isolating threats before they consume resources.



