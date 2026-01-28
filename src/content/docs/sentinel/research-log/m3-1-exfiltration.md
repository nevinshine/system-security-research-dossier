---
title: "M3.1: Exfiltration State Machine"
description: "Defeating data laundering attacks using cross-process state tracking."
sidebar:
  label: "M3.1: Exfiltration State"
  order: 31
---

## Mission Objective
**Stop the Laundering.**
Sophisticated malware rarely writes sensitive data directly to the network. Instead, it "launders" the data through intermediate file descriptors (FDs) to break simple taint tracking rules.

* **Attack Vector:** `Read(File)` -> `Dup2(NewFD)` -> `Close(OldFD)` -> `Write(Socket)`
* **Goal:** Maintain the "Sensitive" tag across FD duplication.

## Engineering the Solution
We implemented a **Finite State Machine (FSM)** in the Cognitive Engine (`brain.py`) that tracks the *lineage* of every open file descriptor.

### The Logic (Python)
```python
# Simplified Logic from brain.py
if syscall == "dup2":
    old_fd = args[0]
    new_fd = args[1]
    
    # If the old FD held sensitive data, the new one does too.
    if state_table[pid][old_fd].is_sensitive:
        state_table[pid][new_fd].mark_sensitive()
        print(f"[ALERT] Taint Propagated: FD {old_fd} -> FD {new_fd}")

```

### Verification (The "Dup" Test)

We simulated a ransomware exfiltration attempt:

1. **Attacker:** Opens `id_rsa` (FD 3).
2. **Sentinel:** Tags FD 3 as `SENSITIVE`.
3. **Attacker:** Calls `dup2(3, 5)` to move the handle to FD 5.
4. **Sentinel:** Immediately tags FD 5 as `SENSITIVE`.
5. **Attacker:** Writes FD 5 to a network socket.
6. **Sentinel:** **BLOCKED**. (Reason: Writing sensitive data to network).

## Research Outcome

Sentinel moved beyond "Event-based" detection to "State-based" detection. It no longer matters *how* the attacker moves the handle; if the data is sensitive, the handle is radioactive.
