---
title: "Field Report: M3 Deep Packet Inspection"
description: Layer 7 Payload Analysis in the Kernel
---

## 1. Objective: The Semantic Gap
**Status:** $\text{\color{green}M3 COMPLETE}$
**Focus:** $\text{\color{orange}Payload Scanning (Static)}$

Milestones M1 and M2 operated on **metadata** (IP headers). M3 addresses the critical "Semantic Gap"—the ability to inspect the **content** of a packet (Layer 7) at the driver level.

**Core Research Question:**
> *Can we execute string matching on a TCP payload inside the XDP hook without violating the eBPF Verifier's complexity limits?*

---

## 2. Implementation Logic
We implemented a **Bounded Loop Scanner** in `hyperion_core.c`. To satisfy the verifier (which forbids infinite loops), we utilize `#pragma unroll` to flatten the scan logic into linear instructions.

```c
/* M3 Logic: Static Signature Scan ("hack") */
#pragma unroll
for (int i = 0; i < MAX_SCAN_LEN; i++) {
    // Boundary Check (Critical for Safety)
    if (payload + i + 4 > data_end) break;

    // Linear Match
    if (payload[i] == 'h' && payload[i+1] == 'a' && 
        payload[i+2] == 'c' && payload[i+3] == 'k') {
        return XDP_DROP;
    }
}

```

---

## 3. Verification: The Netcat Attack

We tested the engine against raw TCP payloads using `netcat`.

**Test Vector:**

```bash
# 1. Benign Traffic (Passed)
echo "hello" | nc 127.0.0.1 8080

# 2. Malicious Payload (Dropped)
echo "hack" | nc 127.0.0.1 8080

```

**Result:**
The malicious connection hung immediately (packet dropped), proving that Hyperion can enforce content policy before the kernel's TCP stack reassembles the stream.

---

## 4. Constraint Analysis

While successful, M3 highlighted the **"Recompilation Bottleneck."** Changing the signature required recompiling the kernel C code. This limitation motivated the architecture for **M4 (Dynamic Policy)**.
