---
title: "M3.5: Socket & Descriptor Resolution"
date: 2026-02-02
tldr: "Built the 'fdmap' engine to correlate Host PIDs with Network Sockets (Inode Mapping)."
---

## Overview
Before Sentinel can instruct the firewall (Hyperion) to block a connection, it needs to know *which* connection belongs to the malicious process. M3.5 implements the **Socket Resolution Engine** (`fdmap.c`).

Sentinel can now translate a generic `write(fd=4)` syscall into a specific network tuple `(TCP, 192.168.1.5:443)`.

**Mechanism:**
1.  **Inode Extraction:** When `connect()` or `accept()` is called, Sentinel pauses the process and inspects `/proc/[pid]/fd/[fd]` to retrieve the socket **Inode Number**.
2.  **ProcNet Parsing:** The system scans `/proc/net/tcp` (and `tcp6`) to find the matching Inode.
3.  **Tuple Reconstruction:** Once matched, it parses the hex-encoded source/dest IP and ports from the proc file.
4.  **Caching:** To avoid performance penalties, these mappings are cached in a hash map until the `close()` syscall is observed.

## Key Findings
-   **Race Conditions in /proc:** Reading `/proc/net/tcp` is slow and not atomic. Short-lived connections (like DNS UDP bursts) might appear and disappear before Sentinel can parse the file. (Solved by caching the state on `socket()` creation).
-   **IPv6 Complexity:** Parsing `/proc/net/tcp6` required a separate hex-decoder, as the address format differs significantly from IPv4.
-   **Overhead:** The lookup adds approximately **120 microseconds** to the `connect()` syscall. This is acceptable as `connect()` happens rarely compared to `read/write`.

## Next Steps
-   **M3.6 (The Bridge):** Use this tuple data to push drop rules to the XDP layer.
-   **Optimization:** Investigate `netlink_diag` sockets as a faster alternative to text-parsing `/proc`.