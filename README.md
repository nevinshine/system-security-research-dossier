# Systems Security Research Dossier

![Version](https://img.shields.io/badge/version-v2.1-green)
![Status](https://img.shields.io/badge/status-active_research-blue)
![Stack](https://img.shields.io/badge/built_with-Astro_Starlight-orange)

**The unified laboratory notebook for Sentinel (Host), Hyperion (Network), and Telos (Agent) security runtimes.**

This repository hosts the static research site that documents the architecture, threat models, and kernel mechanics behind my Systems Security research. It prioritizes depth, architectural decision records (ADRs), and raw technical notes over chronological logging.

**Live Dossier:** [nevinshine.github.io/system-security-research-dossier](https://nevinshine.github.io/system-security-research-dossier/)

---

## Research Tracks

The dossier is divided into three distinct defense domains:

| Track | Name | Domain | Mechanism |
| :--- | :--- | :--- | :--- |
| **01** | **Sentinel** | Host / User Space | `ptrace` (Syscall) |
| **02** | **Hyperion** | Network / Driver | `XDP` + `eBPF` |
| **03** | **Telos** | AI Agent / Intent | `LSM` + `LLM` |

### Track 1: Sentinel Runtime
* **Focus:** Process-level anomaly detection and semantic enforcement.
* **Key Tech:** Recursive `ptrace` interception, Thermometer Encoding, Digital Weightless Networks (WiSARD).

### Track 2: Hyperion Network
* **Focus:** Pre-allocation packet filtering at the network driver level.
* **Key Tech:** eBPF (Extended Berkeley Packet Filter), XDP (Express Data Path).

### Track 3: Telos (AI Security)
* **Focus:** Intent-Action alignment for Autonomous AI Agents.
* **Key Tech:** `eBPF LSM` (Linux Security Modules), Split-Plane Architecture, Intent Verification.

### Field Notes (Side Research)
A collection of "Field Notes" covering emerging threats and technologies beyond the core engineering tracks (e.g., Post-Quantum Cryptography). The focus here is on **breadth** and academic exploration.

---

## The Research Wizard (CLI)

This dossier includes a custom CLI tool to streamline the creation of structured research logs and notes.

```bash
npm run new
```

**Options:**
1.  **Sentinel:** Create a new Host Security log entry.
2.  **Hyperion:** Create a new Network Security log entry.
3.  **Telos:** Create a new Agent Security log entry.
4.  **Field Notes:** Create a new "Side Research" note.

---

## Local Development

This project is built with **Astro Starlight**.

### Prerequisites
* Node.js v18+ (Recommended: v20 LTS)

### Installation

```bash
# Clone the repository
git clone https://github.com/nevinshine/system-security-research-dossier.git

# Install dependencies
npm install
npm install sharp
```

### Running the Lab

Start the local development server:

```bash
npm run dev
```

The site will be available at `http://localhost:4321/system-security-research-dossier/`.

---

## Related Projects

* **[Sentinel Runtime](https://github.com/nevinshine/sentinel-runtime)** – The active source code (C/Python) for Track 1.
* **[Hyperion Kernel](https://github.com/nevinshine/hyperion-xdp)** – The eBPF/XDP source code for Track 2.
* **[Telos Security](https://github.com/nevinshine/telos-runtime)** – The Source code for Track 3 (In Development).

---

*“Verba volant, scripta manent.”*
*(Spoken words fly away, written words remain.)*
