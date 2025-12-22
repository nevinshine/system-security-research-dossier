---
title: System Architecture
description: Technical breakdown of the ptrace-based syscall interception and data processing pipeline.
sidebar:
  order: 2
---

### // The Interception Pipeline

At the core of Sentinel Sandbox is a **user-space syscall interceptor**, implemented in C using the Linux `ptrace` API.  
The interceptor observes **runtime behavior** by pausing a program at system call boundaries and recording syscall identifiers.

---

### 1. Process Attachment & Control

Sentinel launches the target program as a **child process** and establishes tracing control before execution begins.

```c
// Simplified C Logic
pid_t child = fork();

if (child == 0) {
    // Child Process (Target Program)
    ptrace(PTRACE_TRACEME, 0, NULL, NULL);
    raise(SIGSTOP);              // Synchronize with parent
    execvp(target_program, args);
} else {
    // Parent Process (Sentinel)
    waitpid(child, &status, 0);  // Wait for child to stop
    ptrace(PTRACE_SETOPTIONS, child, 0, PTRACE_O_TRACESYSGOOD);
    // Begin tracing loop
}
````

Key properties:

* Tracing is performed **entirely in user space**
* No kernel modules are required
* The target program executes normally, with execution paused only at syscall boundaries

---

### 2. Syscall Interception Loop

Sentinel resumes the traced process using `PTRACE_SYSCALL`, which causes the child to stop **twice per system call**:

1. **Syscall Entry**
2. **Syscall Exit**

To preserve semantic correctness, Sentinel logs **only syscall entry events**.

```c
ptrace(PTRACE_SYSCALL, child_pid, 0, 0);
waitpid(child_pid, &status, 0);

if (WIFSTOPPED(status) && WSTOPSIG(status) == (SIGTRAP | 0x80)) {
    if (!in_syscall) {
        ptrace(PTRACE_GETREGS, child_pid, 0, &regs);
        syscall_nr = regs.orig_rax;  // x86_64 syscall identifier
        log(syscall_nr);
        in_syscall = 1;
    } else {
        in_syscall = 0;  // Exit stop (ignored)
    }
}
```

* **`orig_rax`** is used to obtain the syscall number at entry
* Exit stops are ignored to prevent double-counting
* The output is a clean, ordered syscall trace

---

### 3. Data Output

The interceptor produces a minimal CSV log:

```csv
pid,syscall_nr
6460,59
6460,12
6460,158
...
```

This file represents the **ground-truth behavioral trace** of a program.

---

## // Behavior Processing Pipeline

Raw syscall sequences are not directly suitable for machine learning. Sentinel applies a deterministic transformation pipeline to convert syscall traces into structured inputs.

### 4. Windowing & Aggregation

* Syscall streams are segmented into **fixed-length sliding windows**
* Each window is converted into a **bag-of-syscalls histogram**
* This captures *statistical behavior* while tolerating minor ordering variations

---

### 5. Binary Encoding (Thermometer Encoding)

Histogram counts are transformed into **thermometer-encoded binary vectors**:

* Preserves magnitude similarity
* Ensures small behavioral changes correspond to small Hamming distances
* Produces stable binary input suitable for weightless learning

---

## // AI Integration Strategy (The “Brain”)

Sentinel uses a **Weightless Neural Network (WiSARD-style)** architecture rather than deep learning.

### Why Weightless Networks?

* No matrix multiplications
* No GPUs
* Memory-based inference
* Interpretable behavior modeling

---

### 6. Differentiable Weightless Neural Network (DWN)

To enable training, Sentinel implements a **Differentiable Weightless Neural Network (DWN)** using **Extended Finite Difference (EFD)**:

* **Training:**
  Gradients are approximated over discrete lookup tables using EFD
* **Inference:**
  Pure lookup-table execution (no arithmetic operations)

Each class is represented by an independent **discriminator**, allowing the system to learn *normal behavior* and compare it against deviations.

---

### 7. Decision Logic

The model produces **raw response scores**:

* High normal score → expected behavior
* Low normal score / higher alternative response → anomalous behavior

This framing supports **one-class anomaly detection**, where only benign behavior must be learned initially.

---

### // Architectural Intent

This architecture prioritizes:

* Behavioral fidelity over signature matching
* Lightweight execution over deep learning complexity
* Research clarity over production hardening

Sentinel Sandbox is intentionally designed as a **research platform** for studying kernel-level behavior and lightweight anomaly detection.

---

