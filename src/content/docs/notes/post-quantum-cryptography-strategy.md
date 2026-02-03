---
title: "Post-Quantum Cryptography Strategy"
date: 2026-02-03
tldr: "Strategic analysis of Fraunhofer AISEC's post-quantum roadmap and implications for Telos."
tags: ["quantum", "cryptography", "future-threats"]
---

## Context
As quantum computing advances, traditional asymmetric encryption (RSA, ECC) faces existential threats from Shor's algorithm. This note analyzes the "Post-Quantum Security" roadmap published by Fraunhofer AISEC and applies its principles to the Sentinel/Telos architecture.

## Key Learnings
-   **The Threat:** Quantum computers will break current TLS handshakes used in the Telos Control Plane.
-   **The Solution (PQC):** Moving to Lattice-based cryptography (e.g., CRYSTALS-Kyber) is the industry standard for "Quantum-Resistant" key exchange.
-   **Crypto-Agility:** The most critical architectural requirement today is not implementing Kyber immediately, but designing protocols that can negotiate algorithms dynamically.

## Strategic Application (Telos)
Instead of hardcoding AES-256 or RSA-2048 in the protocol definitions:
1.  **Cipher Suite Negotiation:** Implemented a version handshake that allows the Cortex to dictate the encryption primitive to the Agent at runtime.
2.  **Long-Term Secrets:** Flagged all stored secrets (like API keys) for potential "Store Now, Decrypt Later" attacks.
3.  **Roadmap:** Plan to integrate liboqs (Open Quantum Safe) into the Telos Go daemon by Q4 2026.

## Source
* **Reference:** Fraunhofer AISEC Technical Blog / LinkedIn Insights.
* **Topic:** Post-Quantum Cryptography (PQC) & Secure Infrastructure.
