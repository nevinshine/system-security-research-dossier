---
title: Hyperion Mission Brief
description: Datapath Security at the Network Driver
---

## Research Motivation
**Hyperion** explores the unification of process-level and packet-level defense. It serves as the **Network Satellite** to the Sentinel Runtime.

> **The Research Question:** *Can we inspect packet payloads for malicious signatures at wire speed, retaining temporal context, before the Operating System commits resources?*

---


## System Design (M5.0 Architecture)

Hyperion M5.0 introduces advanced stateful flow tracking and context reconstruction within the XDP datapath, enabling detection of sophisticated evasion techniques such as split-packet attacks.

```
Attacker -> Network Interface -> XDP Hook -> Hyperion Engine
    |-> Policy Map (dynamic updates)
    |-> TCP Context Map (stateful tracking)
    |-> DPI Scanner (payload analysis)
    |-> Telemetry Ring Buffer (event logging)
```

**Key Features:**
- Stateful TCP context tracking using eBPF maps for real-time TCP stream reconstruction.
- Split-packet evasion detection logic to block fragmented malicious payloads.
- Enhanced telemetry and event logging via ring buffer, integrated with Go-based CLI.
- Dynamic policy updates and fine-grained rule management through user-space controller.

**Research Outcomes:**
- Demonstrated wire-speed stateful flow tracking in XDP.
- Validated detection of split-packet evasion attacks.
- Achieved stable integration of telemetry and dynamic policy control.

**Next Steps:**
- Expand protocol support beyond TCP.
- Integrate with Sentinel for unified host-network defense.
- Publish benchmarks and case studies.

---

## Video Demonstrations
[![asciicast](https://asciinema.org/a/777577.svg)](https://asciinema.org/a/777577)

## Benchmarks
| Metric                | Value (Baseline) | Value (DPI) | Value (Header) | Description                       |
|----------------------|------------------|-------------|---------------|-----------------------------------|
| Throughput (Gbps)    | 64.3             | 65.3        | 63.4          | Packets processed per second      |
| Latency (mean RTT ns)| 67               | 136         | 69            | Processing latency (nanoseconds)  |
| Detection Accuracy   | 0.70             | 0.75        | 0.60          | Calculated from sample dataset    |
| CPU Utilization (%)  | 184.9            | 171.9       | 174.9         | Resource usage during operation   |

---

## Research Roadmap

We define success through distinct capability milestones.

### [Phase M1] Stateless Filtering (Complete)

* **Goal:** High-performance dropping based on L3/L4 headers.

### [Phase M2] Stateful Tracking (Complete)

* **Goal:** Volumetric DoS mitigation using `LRU_HASH` maps.

### [Phase M3] Deep Packet Inspection (Complete)

* **Goal:** Layer 7 Payload Analysis (Static).
* **Outcome:** Validated "Static Scanner" against hardcoded signatures.

### [Phase M4] Dynamic Policy (Complete)

* **Goal:** Production-grade Controller & Telemetry.
* **Status:** **vM4.6 Stable**. Features `RingBuf` logging, `SIGHUP` reloading, and Go-based CLI.

### [Phase M5] Flow Context (Current Research)

* **Goal:** Thesis-level research into **Stateful Flow Tracking**.
* **Objective:** Detect "Split-Packet" evasion attacks by reconstructing TCP context in XDP.

