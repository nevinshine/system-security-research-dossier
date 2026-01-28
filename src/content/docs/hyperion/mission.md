---
title: Hyperion Mission Brief
description: Datapath Security at the Network Driver
---

## Research Motivation
**Hyperion** explores the unification of process-level and packet-level defense. It serves as the **Network Satellite** to the Sentinel Runtime.

> **The Research Question:** *Can we inspect packet payloads for malicious signatures at wire speed, retaining temporal context, before the Operating System commits resources?*

---

## System Design (M4.6 Architecture)

Hyperion M4.6 operates on a fully dynamic split-plane design.

```mermaid
graph TD
    A[Attacker] -->|Malicious Packet| B(Network Interface)
    B -->|XDP Hook| C{Hyperion Engine}
    
    %% Dynamic Policy Flow
    U[User Controller] -.->|Update Map| P[(Policy Map)]
    P -.->|Read Rule| C
    
    C -->|Parse L2-L4| D[Locate Payload]
    D -->|DPI Scan| E{Signature Match?}
    
    %% Decision Flow
    E -- Match --> F[XDP_DROP]
    E -- Clean --> G[XDP_PASS]
    
    %% Telemetry Flow
    F -.->|Push Event| R[(Ring Buffer)]
    R -.->|Poll & Decode| U
    U -->|ALERT LOG| L[Console Output]

```

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

