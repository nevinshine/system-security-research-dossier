---
title: MITRE ATT&CK Master Mapping
description: Framework alignment across Sentinel, Hyperion, and Telos research tracks.
sidebar:
  order: 101
---

This document maps the detection and prevention capabilities of each research track to the [MITRE ATT&CK Framework](https://attack.mitre.org/), providing a unified view of threat coverage.

---

## Coverage Matrix

| ATT&CK Technique | ID | Sentinel | Hyperion | Telos |
|------------------|-----|:--------:|:--------:|:-----:|
| Command & Scripting Interpreter | T1059 | ✅ | — | — |
| Data Destruction | T1485 | ✅ | — | — |
| Native API | T1106 | ✅ | — | — |
| Process Injection | T1055 | ✅ | — | — |
| Application Layer Protocol | T1071 | — | ✅ | — |
| Endpoint DoS | T1499 | — | ✅ | — |
| Exfiltration Over Alternative Protocol | T1048 | — | ✅ | ✅ |
| Phishing | T1566 | — | — | ✅ |
| Exploit Public-Facing Application | T1190 | — | ✅ | ✅ |
| User Execution | T1204 | ✅ | — | ✅ |

**Legend:** ✅ = Addressed | — = Not in scope

---

## Sentinel: Host-Based Detection

Sentinel operates at the syscall layer, intercepting process behavior before execution.

### T1059 — Command and Scripting Interpreter
**Technique:** Adversaries abuse command-line interpreters (bash, PowerShell) to execute malicious commands.

**Sentinel Detection:**
- Recursive process tracking via `PTRACE_O_TRACEFORK` captures all shell spawns
- `execve` interception identifies interpreter invocation
- Policy engine can block execution of suspicious scripts

### T1485 — Data Destruction
**Technique:** Adversaries delete or corrupt data to cause damage (ransomware, wipers).

**Sentinel Prevention:**
- `unlink` syscall interception blocks file deletion attempts
- Real-time verdict injection (`EPERM`) prevents kernel execution
- Protected zone configuration shields critical directories

### T1106 — Native API
**Technique:** Adversaries interact directly with OS APIs to evade higher-level detection.

**Sentinel Detection:**
- Universal Syscall Map normalizes all API calls regardless of architecture
- Every syscall passes through the interception engine
- Deep introspection via `PTRACE_PEEKDATA` extracts arguments

### T1055 — Process Injection
**Technique:** Adversaries inject code into other processes to evade defenses.

**Sentinel Detection:**
- Process tree evasion prevention (The Grandchild attack)
- Automatic security policy inheritance across forks
- Detection of orphaned processes attempting evasion

---

## Hyperion: Network-Based Detection

Hyperion operates at the network driver level via XDP, inspecting packets at wire speed.

### T1071 — Application Layer Protocol
**Technique:** Adversaries use application layer protocols (HTTP, DNS) for C2 communication.

**Hyperion Detection:**
- Deep Packet Inspection (DPI) scans Layer 7 payloads
- Split-packet evasion detection reconstructs fragmented payloads
- Signature matching against known C2 patterns

### T1499 — Endpoint Denial of Service
**Technique:** Adversaries exhaust system resources via volumetric attacks.

**Hyperion Prevention:**
- Stateful tracking via `LRU_HASH` maps detects anomalous connection patterns
- XDP drops malicious packets before kernel stack allocation
- Wire-speed operation (64+ Gbps) maintains availability under attack

### T1048 — Exfiltration Over Alternative Protocol
**Technique:** Adversaries steal data using non-standard protocols to evade detection.

**Hyperion Detection:**
- Protocol-agnostic payload inspection beyond TCP
- Telemetry logging via ring buffer for forensic analysis
- Dynamic policy updates can block emerging exfiltration channels

---

## Telos: Intent-Based Detection

Telos operates at the semantic layer, verifying AI agent intent before action.

### T1566 — Phishing (Indirect Prompt Injection)
**Technique:** Adversaries embed malicious instructions in web content to hijack AI agents.

**Telos Detection:**
- Browser Eye sensor detects hidden/invisible DOM elements
- Semantic Taint tracking follows malicious content from web to shell
- Taint levels (LOW → MEDIUM → CRITICAL) escalate threat responses

### T1190 — Exploit Public-Facing Application
**Technique:** Adversaries exploit vulnerabilities in internet-facing applications.

**Telos Prevention:**
- Intent-Action alignment blocks unauthorized agent behavior
- Just-in-Time allow-listing restricts permitted network destinations
- Cortex verification rejects actions that don't match declared intent

### T1204 — User Execution (Confused Deputy)
**Technique:** Adversaries trick users (or agents) into executing malicious payloads.

**Telos Prevention:**
- IntentRequest validation requires explicit goal declaration
- Planned actions must match natural language objectives
- The "Great Exfiltration" defense prevents agent privilege abuse

---

## Combined Defense Depth

```
                    ┌─────────────────────────────────────────┐
                    │         TELOS (Intent Layer)            │
                    │  "I want to download invoices"          │
                    │  ↓ Verified Intent                      │
                    └─────────────────────────────────────────┘
                                      │
                    ┌─────────────────────────────────────────┐
                    │        SENTINEL (Syscall Layer)         │
                    │  execve("/bin/curl") → ALLOWED          │
                    │  unlink("~/.ssh/id_rsa") → BLOCKED      │
                    └─────────────────────────────────────────┘
                                      │
                    ┌─────────────────────────────────────────┐
                    │        HYPERION (Network Layer)         │
                    │  connect(billing.com:443) → ALLOWED     │
                    │  connect(attacker.com:443) → DROPPED    │
                    └─────────────────────────────────────────┘
```

This layered approach ensures that even if one layer is bypassed, the others provide defense-in-depth. An attacker would need to:
1. Craft a prompt injection that passes Telos intent verification
2. Execute syscalls that evade Sentinel behavioral detection
3. Exfiltrate data through Hyperion's network inspection

---

## Future Coverage Expansion

| Technique | ID | Planned Coverage |
|-----------|-----|------------------|
| Credential Dumping | T1003 | Sentinel (memory access monitoring) |
| DNS Tunneling | T1572 | Hyperion (DNS payload inspection) |
| Supply Chain Compromise | T1195 | Telos (package verification) |
