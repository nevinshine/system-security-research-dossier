---
title: "Day 02: Process Management & Signal Handling"
description: "Reference guide for Linux process lifecycles, monitoring, and signal termination."
sidebar:
  order: 3
---

### // Objective
To master the **Linux Process Lifecycle**, understanding how to identify resource-hogging daemons and safely terminate rogue processes using proper UNIX signals.

### // Core Monitoring Tools

#### 1. Real-Time Telemetry (`top`)
The standard dashboard for system load.
- **Key Metrics:** PID (Process ID), %CPU, %MEM, NI (Niceness/Priority).
- **Interactive Commands:**
    - `k` : Kill a process (prompts for PID).
    - `u` : Filter by user.

#### 2. Advanced Visualization (`htop`)
A graphical ncurses-based viewer.
- Allows scrolling through the process tree.
- Visual bars for CPU/RAM usage per core.

### // Process Discovery (`ps`)
Understanding the "Process Snapshot" command (`ps`).

```bash
# List EVERY running process on the system
ps aux

# Filter for a specific target (e.g., SSH daemon)
ps aux | grep ssh

```

* **a** = all users
* **u** = user/owner column
* **x** = processes not attached to a terminal (daemons)

### // Termination Protocols (Signals)

In Linux, you don't "kill" a process; you send it a **signal**.

| Command | Signal Code | Description | Consequence |
| --- | --- | --- | --- |
| `kill <PID>` | **SIGTERM (15)** | The "Polite" Kill | Asks the process to stop. Allows it to save data and close files. |
| `kill -9 <PID>` | **SIGKILL (9)** | The "Force" Kill | The kernel immediately rips the process from memory. Risk of data corruption. |

### // Research Note

Always attempt **SIGTERM (15)** first. Only use **SIGKILL (9)** if a process is zombie/unresponsive.

```

