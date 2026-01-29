---
title: "Field Report: M4 Dynamic Engine"
description: Production-Grade Telemetry and Policy Injection
---

## 1. Objective: The "Zero-Downtime" Architecture
* **Status:** M4.6 STABLE
* **Focus:** Dynamic Maps & Ring Buffer

M3 proved DPI was possible; M4 makes it operational. We moved from a static C-hardcoded scanner to a **Split-Plane Architecture** where policy is injected from User Space at runtime.

**Key Capabilities:**
* **Dynamic Policy:** Signatures are loaded into `BPF_MAP_TYPE_ARRAY`.
* **High-Speed Telemetry:** Replaced slow `trace_pipe` with `BPF_MAP_TYPE_RINGBUF`.
* **Live Reload:** Updates rules via `SIGHUP` without restarting the firewall.

---

## 2. The Visual Controller (Go)
We developed a custom User Space Controller (`hyperion_ctrl`) using the `cilium/ebpf` library. It manages the lifecycle of the maps and renders a structured, color-coded dashboard.

![Hyperion M4.6 Dashboard](/system-security-research-dossier/assets/hyperion_demo.gif)

*Figure 1: The Hyperion M4.6 Controller handling a live reload event.*

---

## 3. Technical Implementation

### The Kernel Plane (Enforcer)
The XDP program no longer contains strings. It loops through a Map of active policies.

```c
/* M4 Logic: Dynamic Map Lookup */
struct policy_t *pol = bpf_map_lookup_elem(&policy_map, &key);
if (pol && pol->active) {
    // Scan payload against pol->signature...
}

```

### The Control Plane (Manager)

The Go controller handles the "Live Reload" logic using Linux Signals.

```go
/* M4 Logic: Zero-Downtime Update */
sig := <-sigChan
if sig == syscall.SIGHUP {
    fmt.Println("[!] Reloading signatures...")
    reloadMaps() // Updates Kernel Map atomically
}

```

---

## 4. Performance & Stability

M4.6 represents the **Production Candidate**.

1. **Safety:** Loops are bounded to 32 bytes to guarantee Verifier compliance on Kernel 5.4+.
2. **UX:** ASCII Art banners and ANSI-colored alerts provide immediate operator feedback.

**Next Phase:** M5 (Stateful Flow Tracking).
