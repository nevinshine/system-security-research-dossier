---
title: "Day 08: AI Anomaly Detection (DWN Research)"
description: "Exploring kernel-level anomaly detection using Differentiable Weightless Neural Networks (DWN)."
sidebar:
  order: 9
---

### // Objective
**To explore lightweight, behavior-based anomaly detection without deep neural networks.**

Modern AI security often depends on heavy deep-learning models (CNNs, LSTMs, Transformers) that require GPUs and large datasets.  
The objective of this day was to study and prototype a **Weightless Neural Network (WiSARD-style)** approach that can model *program behavior* using **binary representations** and run efficiently on **CPU-only systems**.

:::tip[Source Code]
The full research prototype and experiments are maintained here:
👉 **[Sentinel Sandbox – Research Repository](https://github.com/nevinshine/sentinel-sandbox)**
:::

---

### // The Architecture: Dynamic Weightless Network (DWN)

A **Weightless Neural Network (WNN)** does not rely on floating-point multiplications or learned weights.  
Instead, it operates using **lookup tables (RAM nodes)** that map binary input patterns to stored responses.

In this work, I explored a **Dynamic Weightless Network (DWN)** variant that allows training via gradient-based methods while preserving discrete, logic-based inference.

---

### // Key Engineering Decisions

#### 1. Thermometer Encoding
- **Problem:** Raw numerical values and frequency counts do not translate well into binary representations.
- **Solution:** Used **thermometer encoding**, where magnitude is represented by contiguous bits.

Example:
- Count = 3 → `11100`
- Count = 4 → `11110`

This preserves similarity in **Hamming space**, which is critical for weightless models.

---

#### 2. Behavioral Input Representation
Instead of raw sequences, behavior is summarized using:
- Sliding windows over system-call traces
- Bag-of-events (histogram-style aggregation)
- Binary encoding suitable for lookup-based learning

This makes the model robust to small variations while capturing statistical behavior.

---

#### 3. Differentiable Training via EFD
Lookup tables are discrete and non-differentiable by nature.  
To enable training, I implemented **Extended Finite Difference (EFD)**, which approximates gradients by considering the influence of nearby binary addresses in the lookup table.

This allows:
- Gradient-based optimization during training
- Pure lookup-table inference during deployment

---

### // Experimental Setup

- **Dataset:** UNSW-NB15 (used as an initial controlled benchmark)
- **Model:** Multi-discriminator DWN (Normal vs Attack)
- **Training Mode:** Normal-only behavioral learning
- **Hardware:** CPU-only (no GPU dependency)

The focus of this phase was **architecture validation**, not metric optimization.

---

### // Observations & Learnings

- Weightless models can learn **behavioral patterns** without deep neural networks.
- Binary encodings strongly influence model stability and learning quality.
- Training is fast and lightweight compared to traditional deep learning.
- Understanding *why* the system works is more important than raw accuracy at this stage.

---

### // Reflection (Honest)
> This work represents an **exploratory research phase**.  
> My understanding is currently **conceptual and surface-level**, but structured.  
> The main outcome is clarity on how kernel behavior, binary representations, and lightweight ML models connect.

---

### // Next Steps
- Integrate DWN input directly with **real Linux syscall traces** via `ptrace`
- Study anomaly scoring rather than classification accuracy
- Perform controlled experiments on normal vs abnormal program behavior

---
