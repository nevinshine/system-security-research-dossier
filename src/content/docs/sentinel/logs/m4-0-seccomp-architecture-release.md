---
title: "M4.0: Seccomp Architecture Release"
date: 2026-02-05
tldr: "Transitioned from ptrace to Seccomp-BPF. Validated 1.3M OPS throughput and hardened against io_uring/eBPF threats. Published Technical Report."
---
## Overview

Released **Sentinel M4.0**, marking a complete architectural pivot from the legacy `ptrace`-based interception (M3) to a hybrid **Seccomp-BPF + User Notification** supervisor.

The previous M3 architecture suffered from a ~54x performance penalty because every system call triggered a context switch to the userspace tracer. M4 resolves this by installing a BPF filter that whitelists safe syscalls (like `read`, `write`, `getpid`) entirely within the kernel. Only control-plane violations (e.g., `execve`, `openat`, `connect`, or `bpf` loading) trigger a `SECCOMP_RET_USER_NOTIF`, waking the Python Brain for deep inspection.

## Key Findings

* **Performance Breakthrough:** Achieved **1,366,558 OPS** in micro-benchmarks (88% of native speed), compared to ~28,000 OPS in M3. The overhead for non-critical workloads is now negligible (<1%).
* **Ghost Tunnel Neutralized:** Hard-blocked the `io_uring` subsystem. Red Team validation confirmed that async I/O evasion attempts now instantly return `EPERM`.
* **Atomic Injection (Anti-TOCTOU):** Successfully implemented `SECCOMP_IOCTL_NOTIF_ADDFD` to mitigate `runc` container escape races (CVE-2025-31133). The supervisor now opens files on the host and injects the file descriptor safely, preventing path-swapping attacks.
* **The "Python Tax":** While throughput is high, macro-benchmarks (recursive `find`/`grep`) showed a latency increase (~2.3s vs 0.13s native). This confirms that while the "Fast Path" is solved, the "Slow Path" (Python inspection) still incurs a round-trip cost.

## Next Steps

* **Milestone 5 (Turbo Mode):** Investigate moving the "Allow List" logic (e.g., ignoring `/lib/*`) from Python down into **eBPF Maps** to reduce the "Slow Path" latency.
* **Broader Compatibility:** Test the atomic injection logic against other container runtimes beyond `runc` (e.g., `crun`, `gvisor`).