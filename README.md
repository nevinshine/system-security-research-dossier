# Systems Security Research Dossier

![Version](https://img.shields.io/badge/version-v2.1-green)
![Status](https://img.shields.io/badge/status-active_research-blue)
![Stack](https://img.shields.io/badge/built_with-Astro_Starlight-orange)

**The central laboratory notebook for the Sentinel (Host) and Hyperion (Network) security runtimes.**

This repository hosts the static research site that documents the architecture, threat models, and kernel mechanics behind my Systems Security research. It prioritizes depth, architectural decision records (ADRs), and raw technical notes over chronological logging.

**Live Dossier:** [nevinshine.github.io/system-security-research-dossier](https://nevinshine.github.io/system-security-research-dossier/)

---

## Research Tracks

The dossier is divided into two distinct defense domains:

| Track | Name | Domain | Mechanism |
| :--- | :--- | :--- | :--- |
| **01** | **Sentinel** | Host / User Space | `ptrace` (Syscall) |
| **02** | **Hyperion** | Network / Driver | `XDP` + `eBPF` |

### Track 1: Sentinel Runtime
* **Focus:** Process-level anomaly detection and semantic enforcement.
* **Key Tech:** Recursive `ptrace` interception, Thermometer Encoding, Digital Weightless Networks (WiSARD).

### Track 2: Hyperion Network
* **Focus:** Pre-allocation packet filtering at the network driver level.
* **Key Tech:** eBPF (Extended Berkeley Packet Filter), XDP (Express Data Path).
* 
---

## Local Development

This project is built with **Astro Starlight**.

### Prerequisites
* Node.js v18+ (Recommended: v20 LTS)

### Installation

```bash
# Clone the repository
git clone [https://github.com/nevinshine/system-security-research-dossier.git](https://github.com/nevinshine/system-security-research-dossier.git)

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

---

*“Verba volant, scripta manent.”*
*(Spoken words fly away, written words remain.)*
