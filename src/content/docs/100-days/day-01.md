---
title: "Day 01: Identity & Access Audit"
description: "Scripting a user audit tool to detect unauthorized shells and root-privileged accounts."
sidebar:
  order: 2
---

### // Objective
To establish a baseline for **Identity and Access Management (IAM)** by programmatically identifying all human-accessible accounts and verifying that only the `root` user possesses UID 0 privileges.

### // The Audit Script (`user_audit.sh`)

This script generates a `security_audit.txt` report listing all users with interactive shells and root-level access.

```bash
#!/bin/bash

# Define the output file name
OUTPUT="security_audit.txt"

echo "--- SECURITY AUDIT REPORT ---" > $OUTPUT
date >> $OUTPUT

echo "" >> $OUTPUT
echo "[*] CHECKING FOR USERS WITH BASH SHELL (Potential Humans):" >> $OUTPUT
# Explain: grep looks for users who have a login shell defined in /etc/passwd
# We filter for 'bash' or 'sh' to find interactive users.
cat /etc/passwd | grep -E "bash|sh" >> $OUTPUT

echo "" >> $OUTPUT
echo "[*] CHECKING FOR ROOT PRIVILEGES (UID 0):" >> $OUTPUT
# Explain: awk looks for User ID 0 in the 3rd field of /etc/passwd
# Any user with UID 0 has full root access, regardless of their username.
awk -F: '($3 == "0") {print}' /etc/passwd >> $OUTPUT

echo "" >> $OUTPUT
echo "[*] AUDIT COMPLETE. SAVED TO $OUTPUT"

```

### // Technical Breakdown

1. **Shell Detection (`grep -E "bash|sh"`)**:
* Attackers often create hidden users. However, service accounts (like `www-data` or `nobody`) usually have `/usr/sbin/nologin` or `/bin/false` as their shell.
* By filtering specifically for `/bin/bash` or `/bin/sh`, we isolate accounts that can actually log in and execute commands.


2. **UID 0 Check (`awk ... $3 == "0"`)**:
* In Linux, the username `root` is just a label. The kernel grants power based on the **User ID (UID)**.
* If an attacker changes a standard user's UID to `0` in `/etc/passwd`, they become a "stealth root." This script catches that anomaly immediately.



### // Execution

```bash
chmod +x user_audit.sh
./user_audit.sh
cat security_audit.txt

```

### // Findings

On a standard Ubuntu install, only `root` should appear in the UID 0 section. If any other user appears there, the system is compromised.

```