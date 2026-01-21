---
title: "Field Report: M2 Stateful Tracking"
description: Implementing Flow State via eBPF Maps
---
## 1. Objective: The Memory Upgrade
**Status & Focus:** ACTIVE (M2) & eBPF Maps (LRU Hash)

In M1, Hyperion was amnesiac, it forgot every packet the moment it was processed. M2 introduces **State**, allowing the kernel to "remember" traffic patterns.

**Core Research Question:**
> *Can we detect and block a volumetric DoS attack (e.g., ICMP Flood) entirely in the driver, without allocating a single kernel socket buffer?*

---

## 2. Implementation Logic
We utilize a `BPF_MAP_TYPE_LRU_HASH` to create a high-speed key-value store directly in kernel memory.

### The Data Structure (C)
```c
struct {
    __uint(type, BPF_MAP_TYPE_LRU_HASH);
    __uint(max_entries, 1024);
    __type(key, __u32);   // Source IP
    __type(value, __u64); // Packet Count
} flow_tracker SEC(".maps");

```

### The Verdict Logic (XDP)

Instead of a static check, we now look up the IP in our map.

1. **Extract** Source IP.
2. **Lookup** current count in `flow_tracker`.
3. **Increment** the counter.
4. **Verdict:** If `count > THRESHOLD` (e.g., 50 packets/sec), return .

---

## 3. Verification: The DDoS Simulation

We simulated a SYN Flood using `hping3` to stress-test the state table.

**Attack Vector:**

```bash
# Flood the loopback interface with TCP SYN packets
sudo hping3 -S -p 80 -i u1000 127.0.0.1

```

**Defense Telemetry:**
Using `bpftool` to inspect the kernel map in real-time:

```bash
$ sudo bpftool map dump name flow_tracker
key: 0x0100007f  value: 452
key: 0x0200007f  value: 12

```

*Result: The source IP `127.0.0.1` was correctly identified and throttled after 452 packets.*

---

## 4. Architecture Note

This milestone proves that **Hyperion** can act as a "Stateful Firewall" running directly on the Network Interface Card (NIC). By offloading the connection tracking table to XDP, we protect the host OS from memory exhaustion attacks.

**Next Target:** M3 (Dynamic Blocklist API) - Feeding this map from Python user-space.
