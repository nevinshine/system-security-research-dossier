---
title: "Day 04: Firewall Automation"
description: "Scripting a 'Default Deny' firewall policy using UFW to lock down network ingress."
sidebar:
  order: 5
---

### // Objective
To move from "Passive Observation" to "Active Defense" by implementing a **Default Deny** firewall policy. We automate `UFW` (Uncomplicated Firewall) to reject all unsolicited traffic while ensuring SSH access remains open.

### // The Hardening Script (`setup_firewall.sh`)

This script resets the firewall to a known safe state, denies all incoming connections by default, and automates the activation prompt using `echo`.

```bash
#!/bin/bash
# Automating the Day 4 Firewall Setup

echo "🛡️ Setting up UFW Firewall..."

# 1. Reset to defaults (Deny In / Allow Out)
# This acts as the "Base Shield" - blocking 100% of incoming traffic.
sudo ufw default deny incoming
sudo ufw default allow outgoing

# 2. Allow SSH (Port 22)
# Critical: Without this, enabling the firewall would lock us out of the server.
sudo ufw allow ssh

# 3. Enable the Shield
# We pipe "y" into the command to bypass the "Are you sure?" confirmation prompt
# for fully automated deployment.
echo "y" | sudo ufw enable

echo "✅ Firewall is active and secured."
sudo ufw status verbose

```

### // Technical Breakdown

1. **`default deny incoming`**: This is the core security layer. It ensures that even if a vulnerable service (like a test database) starts up on port 8080, it is unreachable from the internet because the firewall strictly blocks it.
2. **`echo "y" | sudo ufw enable`**: In automation (CI/CD pipelines), interactive prompts break the build. Piping `y` into the command allows this script to run unattended in a setup pipeline.

### // Verification

Run the script and check the verbose output:

```bash
chmod +x setup_firewall.sh
./setup_firewall.sh

```