import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { exec } from 'node:child_process';

// 1. Setup the Interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 2. Configuration
const TRACKS = {
    '1': { name: 'Sentinel (Host)', path: 'src/content/docs/sentinel/logs' },
    '2': { name: 'Hyperion (Network)', path: 'src/content/docs/hyperion/logs' },
    '3': { name: 'Telos (Agentic)', path: 'src/content/docs/telos/logs' },
    '9': { name: 'Field Notes (Side Research)', path: 'src/content/docs/notes' }
};

// 3. The Questions
console.log('\x1b[36m%s\x1b[0m', '\n SYSTEM SECURITY RESEARCH WIZARD');
console.log('-----------------------------------');
console.log('1: Sentinel');
console.log('2: Hyperion');
console.log('3: Telos');
console.log('9: Field Notes (Side Research)');

// Helper to promisify questions
const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

// 3. Main Flow
async function main() {
    const trackChoice = await ask('\n\x1b[33mWhere does this log belong? (1-3, 9):\x1b[0m ');
    const track = TRACKS[trackChoice.trim()];

    if (!track) {
        console.error('\x1b[31m%s\x1b[0m', ' Invalid choice. Exiting.');
        rl.close();
        return;
    }

    const title = await ask('\x1b[33mTitle of the Log:\x1b[0m ');
    const tldr = await ask('\x1b[33mTL;DR (One sentence summary):\x1b[0m ');

    // 4. Generate Filename (slug.md)
    const date = new Date().toISOString().split('T')[0];
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const filename = `${slug}.md`;
    const fullPath = path.join(process.cwd(), track.path, filename);

    // 5. Generate Content Template
    const content = `---
title: "${title}"
date: ${date}
tldr: "${tldr}"
---

## Overview
(Paste your content here...)

## Key Findings
- 
- 

## Next Steps
`;

    // 6. Write the File
    try {
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, content);

        console.log('\x1b[32m%s\x1b[0m', `\n Log created: ${filename}`);

        // 7. Auto-Open in VS Code
        exec(`code "${fullPath}"`);
        console.log('\x1b[36m%s\x1b[0m', ' Opening file...');

    } catch (err) {
        console.error('Failed to create file:', err);
    }

    rl.close();
}

main();
