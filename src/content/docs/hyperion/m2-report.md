---
title: "Field Report: M2 Stateful Tracking"
description: Implementing Flow State via eBPF Maps
---

## 1. Objective: The Memory Upgrade
* **Status:** M2 COMPLETE
* **Focus:** eBPF Maps (LRU Hash)

In M1, Hyperion was "amnesiac"—it treated every packet in isolation. M2 introduces **Kernel State**, allowing the firewall to "remember" traffic volume per IP address.

**Core Research Question:**
> *Can we detect and block a volumetric DoS attack (e.g., ICMP Flood) entirely in the driver, without allocating a single kernel socket buffer?*

---

## 2. Implementation Logic
We utilized a `BPF_MAP_TYPE_LRU_HASH` to create a high-speed key-value store directly in kernel memory.

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

1. **Extract** Source IP from the IPv4 header.
2. **Lookup** the current packet count in `flow_tracker`.
3. **Atomic Increment** the counter (`__sync_fetch_and_add`).
4. **Verdict:** If `count > THRESHOLD` (10), return .

---

## 3. Verification: The DDoS Simulation

We simulated a flood attack using `ping -f` to stress-test the state table.

**Test Vector:**

```bash
# Flood the loopback interface with ICMP packets
sudo ping -f -c 20 127.0.0.1

```

**Defense Telemetry:**
Live capture from `/sys/kernel/debug/tracing/trace_pipe`:

```text
bpf_trace_printk: Hyperion M2: DROP -> Flood from IP: 100007f (Count: 11)
bpf_trace_printk: Hyperion M2: DROP -> Flood from IP: 100007f (Count: 20)

```

**Result:**
The system successfully allowed the first 10 packets (benign traffic) and immediately severed the connection once the rate limit was exceeded.

---

## 4. Architecture Note

This milestone proves that **Hyperion** can act as a "Stateful Firewall" running directly on the Network Interface Card (NIC). By offloading the connection tracking table to XDP, we protect the host OS from memory exhaustion attacks.
