---
title: Sentinel Mission Brief
description: Host-Based Runtime Security (Active Defense)
---

### Project Metadata
* **Status:** Research Artifact (Active)
* **Current Capability:** M3.4 (Persistence + Canonicalization)
* **Target:** CISPA / Saarland MSc Application

---

### Abstract

**Sentinel Runtime** is a Linux host-based defense system focused on syscall-level monitoring and cross-process taint tracking. By establishing a closed-loop control system via `ptrace`, Sentinel connects a high-speed C interception engine to a Python-based **Cognitive Engine** to enforce security policies in real-time.

> **[Read the MITRE Mapping](https://www.google.com/search?q=docs/MITRE_MAPPING.md)** - A technical deep-dive into how Sentinel aligns with the ATT&CK framework.

### M2.1: Universal Active Defense (Live Demo)

Demonstration of Sentinel Runtime operating in **"X-Ray Mode."** It actively tracks modern shell behavior (**vfork**) and enforces a **Block-on-Intent** policy.

* **Scenario:** A user attempts to delete a protected file (**unlink** syscall).
* **Result:** Sentinel intercepts the syscall, consults the Policy Engine, and injects a block verdict (**EPERM**) before the kernel executes the deletion.

---

### Capability Milestone Status

* **Deep Introspection (M0.8):** [COMPLETE] Argument extraction via **PTRACE_PEEKDATA**.
* **Online Inference Loop (M1.0):** [COMPLETE] Real-time decision pipeline via **Named Pipes (IPC)**.
* **Recursive Process Tracking (M2.0):** [COMPLETE] Tracing dynamic trees via **PTRACE_O_TRACEFORK**.
* **Universal Extraction (M2.1):** [OPERATIONAL] The Universal Eye. Map-based extraction for **unlink**, **openat**, **execve**.
* **Stealth Tracking (M2.1):** [OPERATIONAL] **VFORK** Support. Detecting optimized shell spawns (**dash/sh**).
* **Semantic Bucketing (M3.0):** [IN PROGRESS] Converting raw paths into semantic concepts (e.g., "Ransomware Activity").

---

## Architecture (Refactored M2.1)

Sentinel operates as a modular closed-loop runtime control system:

### 1. Systems Layer (C / Kernel Space)

* **Interception Engine (main.c):** A recursive **ptrace** monitor supporting **FORK**, **CLONE**, and **VFORK**.
* **Universal Map (syscall_map.h):** A research artifact defining the "DNA" of syscalls (Registers, Types, Names).
* **Visualization (logger.c):** Real-time tree hierarchy rendering.

### 2. Analysis Layer (Python / Data Space)

* **Neural Engine (brain.py):** The decision center. Parses **SYSCALL:verb:arg** signals and issues Block/Allow verdicts.
* **Mock Brain (mock_brain.py):** Lightweight testing tool for engine validation.

---

## [ 0x04 ] EXECUTION CONTROL LOOP (M3.4)

**Terminal 1 (The Brain):**

```bash
$ python3 src/analysis/brain.py
+ [INFO] Neural Engine Online.
+ [LOG] Action: execve | Path: /bin/sh
- [ALERT] BLOCKED THREAT: unlink -> protected.txt
```

**Terminal 2 (The Sentinel):**

```bash
# Syntax: ./bin/sentinel <trigger_word> <target_binary>
sudo ./bin/sentinel test /bin/sh
# Inside monitored session:
# rm protected.txt
rm: cannot remove 'protected.txt': Operation not permitted
```

**Live Demo (The Sentinel):**

![Sentinel Demo](../../../../public/assets/sentinel_evasion.gif)

