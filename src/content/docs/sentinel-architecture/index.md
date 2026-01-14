---
title: Sentinel Architecture
description: Technical specification of the Sentinel Runtime Verification System
---

## System Overview

Sentinel is a lightweight **Runtime Verification System** for Linux. Unlike traditional EDRs (Endpoint Detection and Response) that rely on signature matching or static binary analysis, Sentinel operates on the **Semantic Level**.

It intercepts the communication between a process and the Linux Kernel to establish a "Behavioral Fingerprint" of execution.

### The Cybernetic Loop (Three-Layer Design)

Sentinel operates as a closed feedback loop between the Kernel and the Neural Network.

| Layer | Component | Language | Function |
| :--- | :--- | :--- | :--- |
| **0** | **Target** | Binary | The untrusted process (e.g., malware, web server). |
| **1** | **Interceptor** | C | **The Body.** Attaches via `ptrace`, pauses execution, extracts arguments. |
| **1.5** | **Bridge** | IPC | **The Nervous System.** A FIFO pipe (`/tmp/sentinel_ipc`) for high-speed telemetry. |
| **2** | **Brain** | Python | **The Mind.** A Weightless Neural Network (WiSARD) that outputs `BENIGN` or `ANOMALY`. |

---

## The Neural Bridge (v1.0-alpha)

As of **Day 20 (v1.0)**, Sentinel implements a synchronous decision loop.

### How It Works
1.  **Event:** The Target Process calls `mkdir("secret_folder")`.
2.  **Freeze:** The **Interceptor (C)** traps the syscall and pauses the CPU.
3.  **Transmit:** The Interceptor writes `SYSCALL:mkdir:secret_folder` to the IPC Bridge.
4.  **Inference:** The **Brain (Python)** reads the signal, encodes it, and queries the WiSARD memory.
5.  **Verdict:** The Brain outputs `✅ BENIGN` or `🚨 ANOMALY` in **< 1ms**.

---

## Active Defense (v0.7)

Sentinel is not just a passive monitor. It implements an **Active Policy Engine**.

### The Blocking Mechanism
When a malicious syscall is detected (e.g., `openat` on `/etc/passwd`), Sentinel does not kill the process. Instead, it performs a **Register Rewrite**:

1.  **Trap:** The process stops at Syscall Entry.
2.  **Inspect:** Sentinel reads `RDI/RSI` registers to see arguments.
3.  **Decide:** Policy Engine flags the arguments as `BANNED`.
4.  **Intervene:** Sentinel writes `-1` into the `ORIG_RAX` register.
5.  **Resume:** The kernel sees syscall `-1` (invalid), returns `ENOSYS`, and the process continues without accessing the file.

```c
// Code Snippet: The Neutralization Logic
if (is_malicious(path)) {
    regs.orig_rax = -1; // <--- The "Jedi Mind Trick"
    ptrace(PTRACE_SETREGS, child_pid, NULL, &regs);
}

```

---

## Deep Introspection (v0.8)

To understand *intent*, we must look beyond syscall numbers. Sentinel uses `PTRACE_PEEKDATA` to extract string arguments from the child's virtual memory space.

* **Challenge:** The child's memory is isolated.
* **Solution:** We read word-by-word (8 bytes) at the address found in `RSI` until we hit a `NULL` terminator.

### Current Capabilities

* [x] **Syscall Identity:** Tracking `RAX` numbers.
* [x] **Argument Extraction:** Reading file paths, network IPs.
* [x] **Live Inference:** Real-time AI verdicts (v1.0).

