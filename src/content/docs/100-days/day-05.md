---
title: "Day 05: File Integrity Monitor (FIM)"
description: "Building a cryptographic tripwire script to detect unauthorized modifications to critical system files."
sidebar:
  order: 6
---

### Objective
To establish a "Chain of Custody" for system integrity. By generating SHA-256 hashes of critical configuration files, we can mathematically prove whether a file has been tampered with by an attacker (or a rogue admin).

### The Tripwire Script (`tripwire.sh`)

This script acts as a manual File Integrity Monitor (FIM). It has two modes:
1.  **`init`**: Creates the trusted "Baseline" (Gold Standard).
2.  **`check`**: Compares the current state against the baseline.

```bash
#!/bin/bash

# Define the "Vault" file where we store the secure hashes
HASH_FILE="file_signatures.txt"

# List of critical files to watch (The "Crown Jewels")
# /etc/passwd       -> User list (Attackers add users here)
# /etc/shadow       -> Password hashes (Super sensitive)
# /etc/group        -> User groups (Privilege escalation path)
# /etc/ssh/sshd_config -> SSH security settings (Backdoor entry)
CRITICAL_FILES="/etc/passwd /etc/shadow /etc/group /etc/ssh/sshd_config"

# Function to initialize the baseline (The "Wax Seal")
generate_baseline() {
    echo "🔒 Generating secure baseline..."
    
    # We use sudo because /etc/shadow is readable only by root
    # sha256sum generates the unique digital fingerprint
    sudo sha256sum $CRITICAL_FILES > $HASH_FILE
    
    echo "✅ Baseline saved to $HASH_FILE."
    echo "    (Keep this file safe! It is your reference point.)"
}

# Function to check against the baseline
check_integrity() {
    echo "🕵️  Checking file integrity..."

    if [ ! -f "$HASH_FILE" ]; then
        echo "⚠️  CRITICAL: No baseline found! Run './tripwire.sh init' first."
        exit 1
    fi

    # The -c flag automatically compares current files against the saved hashes
    # --quiet suppresses the 'OK' message for every file (cleaner output)
    sudo sha256sum -c $HASH_FILE --quiet

    # Check the exit status ($?) of the command
    # 0 = Success (Match), 1 = Failure (Mismatch)
    if [ $? -eq 0 ]; then
        echo "🟢 SYSTEM SECURE: No changes detected."
    else
        echo "🔴 WARNING: FILE MODIFICATION DETECTED!"
        echo "    Someone has tampered with your critical files."
    fi
}

# Simple Logic Controller
case "$1" in
    init)
        generate_baseline
        ;;
    check)
        check_integrity
        ;;
    *)
        echo "Usage: $0 {init|check}"
        exit 1
esac

```

### Technical Breakdown

1. **SHA-256 Hashing**: We use `sha256sum` because it is computationally infeasible to modify a file and keep the same hash (Collision Resistance). MD5 is considered broken and unsafe for this purpose.
2. **Exit Codes (`$?`)**: The script relies on the return code of the `sha256sum -c` command. In Linux automation, an exit code of `0` always means success, while anything else indicates an error (or in this case, a security breach).
3. **Critical Targets**:
* `/etc/shadow`: If this changes, someone changed a password.
* `/etc/ssh/sshd_config`: If this changes, someone might have enabled root login or password auth.



### Execution

```bash
chmod +x tripwire.sh

# Step 1: Create the baseline (Do this when the system is clean)
./tripwire.sh init

# Step 2: Run audits periodically (e.g., via Cron)
./tripwire.sh check

```
