---
title: "M3.3: Canonicalization & Anti-Evasion"
description: "Defeating Symlink and TOCTOU attacks with real-time path resolution."
sidebar:
  label: "M3.3: Anti-Evasion"
  order: 33
---

## Mission Objective
**See the Truth.**
Attackers use **Symlinks** and **Path Traversal** (`../../`) to fool security tools that rely on string matching.
* **Attack:** `ln -s /etc/shadow ./game_save`
* **Bypass:** The EDR sees `open("./game_save")` and allows it, unaware it is actually opening `/etc/shadow`.

## Engineering the Solution
We integrated `os.path.realpath` into the `SemanticContext` engine. Sentinel now resolves the **Canonical Path** (the absolute physical location) before applying any policy.

### The Transformation
| Raw Syscall Argument | Canonical Resolution | Policy Decision |
| :--- | :--- | :--- |
| `open("./game_save")` | `/etc/shadow` | **BLOCKED** |
| `open("../../bin/sh")` | `/bin/sh` | **ALERT (Shell)** |
| `open("/tmp/logs")` | `/tmp/logs` | **ALLOWED** |

## The TOCTOU Mitigation
Time-of-Check-Time-of-Use (TOCTOU) is a race condition where an attacker swaps a file between the check and the execution.
* **Sentinel's Defense:** We inspect the path **at the moment of the syscall**, halting the CPU. The kernel cannot proceed until we verify the *current* resolution of the path.

## Research Outcome
Sentinel M3.3 defeats the entire class of "Path Confusion" attacks. It enforces security on the *object*, not the *name*.
