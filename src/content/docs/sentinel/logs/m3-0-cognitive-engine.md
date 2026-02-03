---
title: "M3.0: Cognitive Defense"
description: "Bridging the Semantic Gap with High-Level Behavioral Analysis."
sidebar:
  label: "M3.0: Cognitive Engine"
  order: 4
---

**Date:** 2026-01-22  
**Status:** Operational (M3.0)  
**Focus:** Semantic Analysis / Behavioral Policy

## The "Semantic Gap" Problem
In previous milestones (M2.1), Sentinel was robust but "dumb." It could see that a process called `unlink("/etc/shadow")`, but it didn't understand the *significance* of that file. It treated `/etc/shadow` the same as `/tmp/junk`.

To build a true research-grade defense, the engine needed to move beyond **Signature Matching** (String Equality) to **Concept Understanding** (Semantic Tagging).

> **Research Goal:** Can we teach the engine to recognize *what* a file is, regardless of its specific path?

## The Engineering Solution

### 1. The Cognitive Engine (WiSARD Integration)
We introduced a "Knowledge Base" layer (`semantic.py`) that sits between the Kernel Interceptor and the Decision Logic. This layer translates raw syscall arguments into high-level security concepts.

**Architecture Shift:**
* **Old Way:** `if path == "/etc/shadow"` (Fragile)
* **New Way:** `if tag == CRITICAL_AUTH` (Robust)

### 2. Regex Taxonomy
We implemented a prioritized regex classification system to map the OS filesystem topology to security domains.

| Concept | Regex Pattern | Security Risk |
| :--- | :--- | :--- |
| **CRITICAL_AUTH** | `^/etc/(shadow\|passwd\|sudoers)` | 🔴 High (Block Destructive) |
| **SSH_KEYS** | `^/home/.*/\.ssh/.*` | 🔴 High (Block Read/Write) |
| **SYSTEM_BIN** | `^/usr/bin/.*` | 🟢 Safe (Allow Exec) |
| **TEMP_FILE** | `^/tmp/.*` | 🟢 Safe (Allow All) |

### 3. Implementation Logic
The Brain now queries the `SemanticMapper` before making any policy decision.

```python
# src/analysis/brain.py (Conceptual)
tag = mapper.classify(path)

if tag == "CRITICAL_AUTH" and verb in ["unlink", "rename"]:
    return BLOCK_VERDICT

```

## Live Verification

We tested the system's ability to distinguish between a benign temporary file and a sensitive user asset.

**Scenario:**

1. User runs `touch /tmp/testfile`
2. User runs `rm protected.txt`

**Telemetry Result:**

```text
[LOG]   Action: openat | Path: /tmp/testfile   | Tag: TEMP_FILE           -> ALLOW
[ALERT] Action: unlink | Path: protected.txt   | Tag: SENSITIVE_USER_FILE -> BLOCK

```

**Outcome:**
The system successfully applied different policies to the same syscall (`open`/`unlink`) based entirely on the **Semantic Tag** of the target.
