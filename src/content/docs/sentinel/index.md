---
title: Sentinel Sandbox
description: A runtime malware analysis environment utilizing ptrace for syscall interception and Weightless Neural Networks for anomaly detection.
sidebar:
  order: 1
---

### // Project Overview
**Sentinel Sandbox** is a custom-engineered intrusion detection system (IDS) designed to identify zero-day malware behaviors at the Linux kernel level.

Unlike traditional antivirus software that relies on static file signatures (hashes), Sentinel intercepts the **System Calls (syscalls)**—the fundamental requests a program makes to the operating system kernel.



### // Core Hypothesis
> "Malware functionality is defined by its interaction with the Kernel, not by its source code."

By mapping the sequence of syscalls (e.g., `socket` -> `connect` -> `execve`), we can identify malicious intent even if the binary is obfuscated or packed.

### // Technology Stack
| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Interceptor** | **C / ptrace** | Attaches to processes and halts execution at every syscall entry/exit. |
| **Analyzer** | **Python 3** | Parses registers (`RAX`, `RDI`, `RSI`) to extract arguments. |
| **Detection Engine** | **Weightless NN (WiSARD)** | A CPU-optimized neural network that learns benign behavioral patterns. |
| **Isolation** | **Docker / Namespaces** | Ensures malware detonation does not compromise the host. |

### // Research Goals
1.  **Zero Overhead:** Minimize the latency introduced by `ptrace` context switching.
2.  **Edge Deployment:** Prove that Weightless AI can run on low-power IoT CPUs without GPU acceleration.