---
title: Hyperion M5 Report
description: Research Progress and Findings for M5 Phase
---

## M5: Flow Context & Stateful Tracking

### Overview
The M5 phase of Hyperion focuses on advanced stateful flow tracking and context reconstruction within the XDP datapath. This enables detection of sophisticated evasion techniques, such as split-packet attacks, by maintaining TCP stream context at wire speed.

### Key Changes in Hyperion-XDP
- **Stateful TCP Context:** Implementation of per-flow state tracking using eBPF maps, allowing for real-time reconstruction of TCP streams.
- **Split-Packet Evasion Detection:** New logic to identify and block attacks that attempt to evade detection by fragmenting malicious payloads across multiple packets.
- **Enhanced Telemetry:** Improved event logging and alerting via ring buffer, with integration to Go-based CLI for real-time monitoring.
- **Dynamic Policy Updates:** Support for live policy reloading and fine-grained rule management through user-space controller.

### Architecture Diagram
```
Attacker -> Network Interface -> XDP Hook -> Hyperion Engine
    |-> Policy Map (dynamic updates)
    |-> TCP Context Map (stateful tracking)
    |-> DPI Scanner (payload analysis)
    |-> Telemetry Ring Buffer (event logging)
```

### Research Outcomes
- Demonstrated wire-speed stateful flow tracking in XDP.
- Validated detection of split-packet evasion attacks.
- Achieved stable integration of telemetry and dynamic policy control.

### Next Steps
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
