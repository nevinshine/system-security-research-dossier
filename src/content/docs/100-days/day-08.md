---
title: "Day 08: AI Anomaly Detection (DWN Research)"
description: "Engineering a CPU-optimized Weightless Neural Network (WiSARD) for zero-overhead intrusion detection."
sidebar:
  order: 9
---

### // Objective
**To break the dependency on GPUs for AI Security.**
Standard Deep Learning (CNNs/Transformers) is too heavy for standard Linux servers. My goal was to build a lightweight **Weightless Neural Network (WiSARD)** that can detect attacks on a CPU with negligible latency.

:::tip[Source Code]
The full implementation of this AI engine is hosted in the dedicated research repository:
👉 **[View Sentinel Sandbox Source Code](https://github.com/nevinshine/sentinel-sandbox)**
:::

### // The Architecture: Dynamic Weightless Network (DWN)

Unlike traditional neurons that multiply float values (requiring GPUs), a Weightless Neural Network uses **RAM-based lookup tables**. It "learns" by memorizing patterns in binary address spaces.



#### Key Engineering Decisions:
1.  **Thermometer Encoding:**
    * *Challenge:* How to convert continuous data (like "packet size = 1500") into binary for the network?
    * *Solution:* Implemented "Thermometer Encoding." A value of `3` becomes `11100`, while `5` becomes `11111`. This preserves the magnitude in a binary format.
2.  **Pure PyTorch Embeddings:**
    * Replaced the complex CUDA matrix multiplications with simple memory lookups using PyTorch's `EmbeddingBag` layers.

### // Experimental Results (UNSW-NB15)

I trained the model on the **UNSW-NB15** Network Intrusion Dataset, a modern benchmark for cyberattacks.

| Metric | Result | Analysis |
| :--- | :--- | :--- |
| **Accuracy** | **78.72%** | Strong baseline for a non-deep model. |
| **Training Time** | **< 2 min** | Extremely fast convergence compared to LSTMs. |
| **Hardware** | **CPU Only** | Verified zero GPU usage during inference. |

### // Findings
The **Dynamic Weightless Network (DWN)** successfully demonstrated that we can perform statistical anomaly detection on low-power edge devices (like IoT gateways or standard VPS instances) without expensive hardware acceleration.

### // Next Steps
* Integrate this Python model into the C-based `sentinel-sandbox` using the Python C API.
* Test against live `ptrace` data from the Linux Kernel.

```