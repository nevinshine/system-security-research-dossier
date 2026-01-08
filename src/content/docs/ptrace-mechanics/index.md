---
title: Ptrace Mechanics
description: Deep dive into the Linux ptrace API and Register Interception
---

## The Ptrace State Machine

`ptrace` is the primary mechanism for implementing debuggers and system call tracers on Linux.

### The Stop-Inspect-Resume Cycle

1.  **PTRACE_SYSCALL:** The tracer tells the kernel: *"Let the child run until it hits a syscall entry or exit."*
2.  **Wait:** The tracer calls `waitpid()` and sleeps.
3.  **Wake Up:** When the child makes a syscall, the kernel freezes it and wakes the tracer.
4.  **Inspect:** The tracer reads the CPU registers (`PTRACE_GETREGS`).

---

## The AMD64 Syscall ABI

On Linux x86_64, arguments are passed via specific registers. Understanding this map is critical for interception.

| Register | Usage | Example (openat) |
| :--- | :--- | :--- |
| **RAX** | Syscall Number | `257` (openat) |
| **RDI** | Argument 1 | `dirfd` (Directory File Descriptor) |
| **RSI** | Argument 2 | `*pathname` (Memory Address of string) |
| **RDX** | Argument 3 | `flags` (Read/Write mode) |
| **R10** | Argument 4 | `mode` (Permissions) |

> **Critical Note:** The return value of the syscall is placed in `RAX` *after* the syscall exits. On entry, `RAX` holds the ID.

---

## PTRACE_PEEKDATA (The Teleporter)

Reading memory from another process is not direct. You cannot dereference a pointer from the child.

```c
long data = ptrace(PTRACE_PEEKDATA, child_pid, addr, NULL);

```

* **Unit:** Reads 1 word (8 bytes on 64-bit).
* **Method:** To read a string, you must loop, reading 8 bytes at a time, and stitching them together until you find `\0`.

```