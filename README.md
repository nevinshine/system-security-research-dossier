# Runtime Security Dossier

![Version](https://img.shields.io/badge/version-v1.0-green)
![Status](https://img.shields.io/badge/status-active_research-blue)
![Stack](https://img.shields.io/badge/built_with-Astro_Starlight-orange)

**The central laboratory notebook for the Sentinel Runtime Verification System.**

This repository hosts the static research site that documents the architecture, threat models, and kernel mechanics behind Sentinel. It prioritizes depth, architectural decision records (ADRs), and raw technical notes over chronological logging.

🔗 **Live Dossier:** [nevinshine.github.io/runtime-security-dossier](https://nevinshine.github.io/runtime-security-dossier/)

---

## 📂 Research Domains

The documentation is structured into four core pillars:

| Domain | Description |
| :--- | :--- |
| **Sentinel Architecture** | Design specs for the Interception Pipeline (C), Policy Engine, and Anomaly Detection (Python). |
| **Ptrace Mechanics** | Low-level notes on the Linux `ptrace` API, register mapping (AMD64 ABI), and memory injection. |
| **Kernel Internals** | Documentation on `task_struct`, virtual memory management, and the User/Kernel boundary. |
| **Threat Models** | Analysis of runtime evasion techniques, code injection, and behavioral malware signatures. |

---

## 🛠️ Local Development

This project is built with **Astro Starlight**.

### Prerequisites
* Node.js v18+ (Recommended: v20 LTS)

### Installation

```bash
# Clone the repository
git clone [https://github.com/nevinshine/runtime-security-dossier.git](https://github.com/nevinshine/runtime-security-dossier.git)

# Install dependencies
npm install
npm install sharp

```

### Running the Lab

Start the local development server:

```bash
npm run dev

```

The site will be available at `http://localhost:4321/runtime-security-dossier/`.

---

## 🔗 Related Projects

* **[Sentinel Runtime](https://www.google.com/search?q=https://github.com/nevinshine/sentinel-runtime)** – The active source code (C/Python) described in this dossier.

---

*“Verba volant, scripta manent.”*
*(Spoken words fly away, written words remain.)*
