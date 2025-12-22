---
title: "100 Days of DevSecOps"
description: "Building a hardened Linux environment, security tools, and automation scripts from scratch."
sidebar:
  order: 1
---

> **Goal:** Building a hardened Linux environment, security tools, and automation scripts from scratch.  
> **Tech Stack:** Linux (Ubuntu), Bash, UFW, OpenSSH, Python.  
> **Current Status:** <span style="color:#39FF14; font-weight:bold;">🟢 Active (Day 9/100)</span>

## 📂 Progress Log

| Day | Topic | Description | Status |
| :--- | :--- | :--- | :--- |
| **Day 09** | Research Consolidation | Sentinel Sandbox Architecture & Understanding | <span style="color:#39FF14; font-weight:bold;">Completed</span> |
| **Day 08** | AI Anomaly Detection | CPU-Optimized Weightless Neural Network | <span style="color:#39FF14; font-weight:bold;">Completed</span> |
| **Day 07** | Fail2Ban | Automated Intrusion Prevention System | <span style="color:#39FF14; font-weight:bold;">Completed</span> |
| **Day 06** | SSH Hardening | Disabling Passwords, Enforcing Key Auth |<span style="color:#39FF14; font-weight:bold;">Completed</span> |
| **Day 05** | File Integrity Monitor | SHA-256 Hashing & Baseline Comparison |  <span style="color:#39FF14; font-weight:bold;">Completed</span>|
| **Day 04** | Firewall Automation | UFW Configuration Script | <span style="color:#39FF14; font-weight:bold;">Completed</span> |
| **Day 03** | Net Sentry | Port Scanning & Intrusion Detection | <span style="color:#39FF14; font-weight:bold;">Completed</span>|
| **Day 02** | Process Management | Linux Lifecycle & Signal Handling | <span style="color:#39FF14; font-weight:bold;">Completed</span> |
| **Day 01** | Identity Audit | User & Root Account Auditing | <span style="color:#39FF14; font-weight:bold;">Completed</span> |

---

## Detailed Operations Log

### Day 9: Research Consolidation & System Understanding
- **Focus:** Reflection, documentation, and conceptual clarity after building Sentinel Sandbox.
- **Problem:**  
  After several days of intensive low-level systems and ML work, technical progress was outpacing conceptual understanding. Continuing without consolidation risked shallow learning and burnout.
- **What I Did:**
  - Reviewed the complete **Sentinel Sandbox pipeline** from kernel tracing → data representation → ML decision
  - Documented the system architecture, research intent, and limitations
  - Converted implementation work into **clear written explanations** (research dossier & project docs)
  - Refined README, architecture pages, and DevSecOps logs for accuracy and credibility
- **Key Learnings:**
  - Learning happens in phases: *exposure → confusion → clarity*
  - Surface-level familiarity is a valid and necessary research stage
  - Writing explanations reveals gaps faster than coding
  - Honest documentation is more valuable than exaggerated results
- **Outcome:**
  - Sentinel Sandbox documentation now accurately reflects the real system
  - Research work is better structured for future deep dives
  - Mental reset achieved before moving into anomaly scoring and experiments
- **Status:**  
  Consolidation complete. Ready to proceed with controlled experimentation.

> **Note:**  
> Day 9 was intentionally kept lightweight to allow concepts to settle before advancing further.


### Day 8: AI-Powered Intrusion Detection (Research)
- **Project Link:** [Sentinel Sandbox Source Code](https://github.com/nevinshine/sentinel-sandbox)

- **Problem:**  
  Kernel-level security systems require **low-latency and interpretable detection**, but traditional deep learning models (LSTMs, CNNs) are heavyweight and poorly suited for CPU-only environments.
- **Focus:**  
  Explore **behavior-based anomaly detection** using **Weightless Neural Networks (WiSARD-style)** instead of deep neural networks.
- **What I Built:**
  - A **ptrace-based syscall tracer** to observe real Linux program behavior
  - A data pipeline that converts syscall streams into:
    - Sliding windows
    - Bag-of-syscalls histograms
    - Thermometer-encoded binary vectors
  - A **Differentiable Weightless Neural Network (DWN)** trained using **Extended Finite Difference (EFD)**
- **Key Learnings:**
  - System calls represent ground-truth program behavior
  - Binary encoding strongly affects model stability
  - Weightless models can learn behavioral patterns without GPUs
  - Differentiable training enables learning while preserving lookup-based inference
- **Current Status:**
  - End-to-end pipeline validated on **real kernel syscall traces**
  - Normal-only behavioral learning demonstrated
  - Accuracy optimization and anomaly thresholding deferred to later experiments

> **Note:**  
> This day focused on **architecture validation and learning**, not production metrics or benchmark optimization.

### Day 7: Fail2Ban Intrusion Prevention
- **Problem:** Even with SSH keys, bots can flood the server with thousands of login attempts, wasting resources.
- **Solution:** Installed **Fail2Ban** to monitor `/var/log/auth.log` and automatically update Firewall rules.
- **Configuration:**
  - **Bantime:** 1 hour (Punishment duration)
  - **Maxretry:** 3 attempts (Strike limit)
  - **Action:** Immediate IP block via `iptables`/UFW.

### Day 6: SSH Hardening & Key Authentication
- **Problem:** Default SSH settings allow attackers to brute-force passwords and log in as `root`.
- **Solution:** Configured `/etc/ssh/sshd_config` to strictly enforce **Ed25519 SSH Keys**.
- **Hardening Steps:**
  - `PermitRootLogin no` (Stop God-mode login)
  - `PasswordAuthentication no` (Disable text passwords)
  - `PubkeyAuthentication yes` (Require cryptographic keys)

### Day 5: File Integrity Monitor (FIM)
- **Problem:** Attackers often modify system binaries or configs (like `/etc/shadow`) to maintain persistence.
- **Solution:** `tripwire.sh` - A script that creates SHA-256 baselines of critical files and alerts on modification.
- **Command:** `./tripwire.sh check`

### Day 4: Firewall Automation
- **Problem:** Leaving ports open is the #1 vulnerability.
- **Solution:** `setup_firewall.sh` - Automated UFW configuration to deny all incoming traffic except SSH.

### Day 3: Network Intrusion Detection
- **Problem:** Identifying unauthorized services listening on the network.
- **Solution:** `net_sentry.sh` - A scanner that detects listening ports and checks for public exposure (`0.0.0.0`).

### Day 2: Process Management
- **Topic:** Linux Process Lifecycle.
- **Artifact:** `proc_cheat_sheet.md` - Documentation on `top`, `ps aux`, and signal handling (`kill`).

### Day 1: Identity & Access Audit
- **Problem:** Unused accounts are potential backdoors.
- **Solution:** `user_audit.sh` - A script to list human users (Bash shells) and Root-privileged accounts (UID 0).

---
<small>Created by Nevin Shine as part of the 100 Days Challenge.</small>
