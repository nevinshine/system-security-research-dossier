---
title: "Day 03: Network Sentry"
description: "Automating port auditing to detect unauthorized listening services and public exposure."
sidebar:
  order: 4
---

### // Objective
To build a surveillance script (`net_sentry.sh`) that identifies "Open Doors" in the system—specifically listening ports that could serve as entry vectors for attackers.

### // The Sentry Script (`net_sentry.sh`)

This script audits the network stack using `ss` (Socket Statistics), flagging dangerous protocols (Telnet) and global exposure (`0.0.0.0`).

```bash
#!/bin/bash

LOG_FILE="network_audit.txt"

echo "--- NETWORK PORT AUDIT ---" > $LOG_FILE
date >> $LOG_FILE
echo "--------------------------" >> $LOG_FILE

echo "[*] LISTENING PORTS (Open Windows):" >> $LOG_FILE
echo "FORMAT: Local_Address:Port  (Process_Name)" >> $LOG_FILE

# Command Breakdown:
# ss  -> Socket Statistics (Modern replacement for netstat)
# -l  -> Listening (Waiting for connection)
# -n  -> Numeric (Show IPs, not DNS names)
# -t  -> TCP (Most services)
# -u  -> UDP
# -p  -> Process (Show WHO opened the port - requires sudo)
sudo ss -lntup >> $LOG_FILE

echo "" >> $LOG_FILE
echo "[*] DANGEROUS PORT CHECK:" >> $LOG_FILE

# 1. Telnet Check (Port 23)
# Telnet transmits data in plaintext (including passwords). 
# It should NEVER exist on a modern secure system.
if grep -q ":23 " $LOG_FILE; then
    echo "⚠️  CRITICAL: TELNET DETECTED (Port 23)" >> $LOG_FILE
else
    echo "✅ No Telnet found." >> $LOG_FILE
fi

echo "" >> $LOG_FILE
echo "[*] PUBLIC EXPOSURE CHECK (0.0.0.0):" >> $LOG_FILE

# 2. Wildcard Interface Check (0.0.0.0)
# If a service listens on 0.0.0.0, it accepts traffic from ANYWHERE.
# Internal databases (MySQL/Redis) should usually bind to 127.0.0.1 (Localhost only).
if grep -q "0.0.0.0" $LOG_FILE; then
    echo "⚠️  WARNING: Some services are listening on ALL interfaces (0.0.0.0)!" >> $LOG_FILE
    echo "    Check the list above to ensure this is intentional." >> $LOG_FILE
else
    echo "✅ No services exposed to 0.0.0.0 (Good job)." >> $LOG_FILE
fi

echo "Scan Complete. View $LOG_FILE"

```

### // Findings & Analysis

* **0.0.0.0 vs 127.0.0.1**: The script successfully differentiates between local-only services and public-facing ones.
* **Process Identification**: The `-p` flag in `ss` is critical; without `sudo`, it cannot reveal which PID owns the port, leaving the auditor blind.

```