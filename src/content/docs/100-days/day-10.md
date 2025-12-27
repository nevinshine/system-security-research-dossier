---
title: "Day 10: Temporal Feature Engineering for Syscall Anomaly Detection"
description: "Improving anomaly detection by introducing temporal structure into syscall representations."
sidebar:
  order: 11
---

### Objective
To improve anomaly detection performance by enhancing **feature representation**, without modifying the underlying ML model.

---

### Context
Previous experiments using frequency-only syscall histograms showed heavy overlap between normal and abnormal behavior distributions. This indicated that **syscall frequency alone is insufficient** to capture meaningful behavioral differences.

---

### // What I Did
- Analyzed anomaly score distributions from the baseline (frequency-only) model
- Identified lack of temporal information as the primary limitation
- Implemented **temporal bucketing** in the syscall processing pipeline:
  - Each syscall window is split into multiple ordered segments
  - Histograms are computed per segment and concatenated
- Retrained the Differentiable Weightless Neural Network (DWN) without changing:
  - Model architecture
  - Training method (EFD)
  - Loss formulation

---

### Key Results
- Input dimensionality increased from **2688 → 10752 bits**
- Model training remained stable and CPU-only
- Anomaly score distributions showed **clear separation**:
  - Normal behavior → strongly positive scores
  - Abnormal behavior → negative scores
- This confirmed that **temporal structure is critical** for syscall-based anomaly detection

---

### Key Insight
> Representation choice has a larger impact on anomaly detection performance than model complexity.

---

### Limitations
- Small sample size (prototype stage)
- No detection thresholds or accuracy metrics defined
- Results focus on architectural validation, not production readiness

---

### Status
<span style="color:#39FF14; font-weight:bold;">Completed</span>
