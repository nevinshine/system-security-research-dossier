---
title: "M3.4: Final Research Artifact"
description: "The Golden Master release. Validated, Benchmarked, and Frozen."
sidebar:
  label: "M3.4: Final Artifact"
  order: 34
---

## Research Status: COMPLETE
**Date:** January 2026
**Version:** M3.4-final (Gold Master)

This log marks the conclusion of the active engineering phase. Sentinel Runtime has transitioned from a development prototype to a validated **Research Artifact** for the CISPA MSc Application.

## The Release Package
* **Codebase:** Clean separation of concerns (`src/` vs `tests/`).
* **Defense:** Full coverage for Ransomware, Exfiltration, and Rootkits.
* **Resilience:** New **Watchdog Orchestrator** (`scripts/watchdog.sh`) ensures the defense cannot be disabled via `SIGKILL`.

## Performance Benchmark (Final)
We conducted a final stress test to quantify the cost of "Active Defense."

| Metric | Result | Context |
| :--- | :--- | :--- |
| **Syscall Latency** | ~30x overhead | Unavoidable with `ptrace`. Acceptable for high-security modes. |
| **IPC Throughput** | 28,628 events/sec | Sufficient for standard desktop workloads. |
| **Memory Usage** | 110 MB | Stable (Python Runtime + TensorFlow Lite). |

## Evidence of Defense
The following immutable artifacts verify the system's efficacy.

**Sentinel Active Defense Demo:**
![Sentinel Runtime Demo](/system-security-research-dossier/assets/sentinel_evasion.gif)

* **Ransomware Block:** Immediate termination of encryption loop.
* **Exfiltration Block:** Detection of tainted data leak.
* **Persistence:** Automatic resurrection after `kill -9`.

## Download
[Sentinel Runtime M3.4 - Source Code](https://github.com/nevinshine/sentinel-runtime/releases/tag/M3.4-final)
