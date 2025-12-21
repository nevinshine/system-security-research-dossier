---
title: System Architecture
description: Technical breakdown of the ptrace interception mechanism and data pipeline.
sidebar:
  order: 2
---

### // The Interception Pipeline

The core of Sentinel is the **Interceptor**, written in C to manage direct memory access via `ptrace`.

#### 1. The Attach Phase
The sandbox spawns the target malware as a child process. Before execution begins, it issues `PTRACE_TRACEME`, handing control to the parent (Sentinel).

```c
// Simplified C Logic
pid_t child = fork();
if (child == 0) {
    // Child Process (Malware)
    ptrace(PTRACE_TRACEME, 0, NULL, NULL);
    execv(target_malware, args);
} else {
    // Parent Process (Sentinel)
    wait(NULL); // Wait for child to stop at exec
    // Begin tracing loop...
}

```

#### 2. The Syscall Trap

We use `PTRACE_SYSCALL` to resume the child process but force it to stop whenever it enters a system call.

* **Entry Stop:** The CPU registers contain the syscall number (`RAX`) and arguments (`RDI`, `RSI`, `RDX`, etc.).
* **Exit Stop:** The CPU registers contain the return value (Success/Failure).

### // AI Integration Strategy (The "Brain")

Standard deep learning (LSTMs) is too slow for real-time blocking. We utilize **WiSARD (Weightless Neural Networks)**.

1. **Encoding:** Syscall sequences are converted into binary "thermometer" arrays.
2. **Lookup:** The network checks RAM addresses corresponding to these binary patterns.
3. **Decision:** If the pattern has zero hits in the "Benign Memory," it is flagged as an anomaly.

> **Research Note:** This architecture allows for *Online Learning*—the system can learn new safe behaviors instantly without re-training a massive matrix.

```

### **Step 4: Check Your Config**
Double-check `astro.config.mjs` to ensure the sidebar matches the folder name `sentinel`:

```javascript
// ... inside sidebar array:
{
  label: 'Sentinel Sandbox',
  autogenerate: { directory: 'sentinel' },
},

```