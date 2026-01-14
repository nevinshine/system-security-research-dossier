---
title: Experiments & Evaluation
description: Experimental evaluation of the Live Neural Defense system (v1.0-alpha).
---

## Overview

This document tracks the experimental validation of **Sentinel v1.0-alpha** (Day 20).

The core objective is to validate the **"Cybernetic Loop"**: Can a C-based Kernel Monitor successfully offload decision-making to a Python-based Neural Network in real-time (< 5ms)?

---

## Experimental Pipeline (v1.0)

The system is tested using a synchronous feedback loop:

1.  **Stimulus:** A target process executes a syscall (e.g., `mkdir`).
2.  **Interception:** The C Tracer pauses the process at the entry point.
3.  **Transmission:** Telemetry is streamed via **IPC Pipe** (`/tmp/sentinel_ipc`).
4.  **Inference:** The **WiSARD Brain** (Python) encodes the signal and outputs a verdict.
5.  **Response:** The verdict is printed to the console (Future: Enforced via `ptrace`).

---

## Experiment A: The "Red/Green" Test (Day 20)

**Objective:** Verify that the Brain can distinguish between known benign patterns and unknown anomalies in real-time.

### Setup
* **Model:** WiSARD (Weightless Neural Network).
* **Training Data:** `mkdir`, `access`, `openat` (One-Shot Learning).
* **Test Data:**
    * **Sample A (Benign):** `mkdir("test_folder")`
    * **Sample B (Anomaly):** `rootkit_install("/boot/vmlinuz")`

### Results

| Input Signal | Brain Prediction | Latency | Result |
| :--- | :--- | :--- | :--- |
| `mkdir` | `✅ BENIGN` | < 1ms | **PASS** |
| `rootkit_install` | `🚨 ANOMALY` | < 1ms | **PASS** |

**Conclusion:** The system successfully generalizes. It recognized the "Benign" pattern it was taught and correctly flagged the "Unknown" pattern as an anomaly without explicit negative training.

---

## Temporal Feature Engineering

Earlier experiments (Phase 1) proved that frequency-only histograms were insufficient.

We now utilize **Thermometer Encoding** to convert syscall strings into binary patterns for the WiSARD network.
* **Input:** "mkdir"
* **Hashing:** `sum(bytearray("mkdir"))`
* **Output:** `0010110...` (Sparse Binary Vector)

This allows the Neural Network to perform bitwise operations (RAM-based learning) instead of floating-point math, enabling the <1ms latency.

---

## Limitations & Next Steps

* **Blocking:** Currently, the verdict is printed to the console ("Soft Blocking"). The next phase will pipe this verdict *back* to C to enforce the block (`RAX = -1`).
* **Context:** The current v1.0 model looks at *single* syscalls. Phase 3 will re-introduce the **Sliding Window** to detect *sequences* of behavior.

---

## Status

**✅ Validated (v1.0-alpha)**
The feedback loop from Kernel Space (C) to User Space (Python) is operational and responsive.
