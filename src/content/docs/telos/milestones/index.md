---
title: "Telos Milestones"
description: "Research milestone summaries for Telos AI Security Runtime."
---

This section documents major milestones in Telos AI Security Runtime development.

## Milestone Overview

| Phase | Status | Description |
|-------|--------|-------------|
| **Phase 1** | ✅ Complete | Protocol Definition & Architecture - gRPC/protobuf messaging |
| **Phase 2** | 📋 Planned | Browser Eye Sensor - DOM taint detection |
| **Phase 3** | 📋 Planned | Kernel Core (eBPF LSM) - Syscall blocking |
| **Phase 4** | 📋 Planned | Network Edge (eBPF XDP) - Packet filtering |
| **Phase 5** | 📋 Planned | Cortex Integration - LLM intent verification |

## Key Artifacts

- `shared/protocol.proto` - Core protobuf definitions
- `TelosControl` service - Central decision engine
- `TaintReport` / `IntentRequest` - Semantic tracking messages

---

*Individual milestone reports will be added as phases are completed.*
