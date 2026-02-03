import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    site: 'https://nevinshine.github.io',
    base: '/system-security-research-dossier',
    output: 'static',

    integrations: [
        react(),
        starlight({
            title: 'Systems Security Research Dossier',

            social: [
                {
                    label: 'GitHub',
                    href: 'https://github.com/nevinshine/sentinel-runtime',
                    icon: 'github',
                },
            ],

            customCss: ['./src/styles/custom.css'],

            sidebar: [
                {
                    label: 'Track 1: Sentinel (Host)',
                    items: [
                        // 1. The High-Level Overview
                        { label: 'Mission Brief', link: '/sentinel/mission' },
                        { label: 'System Architecture', link: '/sentinel/architecture' },

                        // 2. The New "Cognitive" Series (M3) - Highlighting your latest work
                        {
                            label: 'Phase 2: Cognitive Defense',
                            items: [
                                { label: 'M3.0: Semantic Mapping', link: '/sentinel/logs/m3-0-cognitive-engine' },
                                { label: 'M3.1: Exfiltration State', link: '/sentinel/logs/m3-1-exfiltration' },
                                { label: 'M3.3: Anti-Evasion', link: '/sentinel/logs/m3-3-evasion' },
                                { label: 'M3.4: Final Artifact', link: '/sentinel/logs/m3-4-final-artifact' },
                            ]
                        },

                        // 3. Threat Intelligence (MITRE Mapping)
                        {
                            label: 'Adversarial Engineering',
                            autogenerate: { directory: 'sentinel/threat-models' }
                        },

                        // 4. Technical Deep Dives (Collapsed to save space)
                        {
                            label: 'Technical Deep Dives',
                            collapsed: true,
                            items: [
                                { label: 'Kernel Internals', autogenerate: { directory: 'sentinel/kernel-internals' } },
                                { label: 'Ptrace Mechanics', autogenerate: { directory: 'sentinel/ptrace-mechanics' } },
                            ]
                        },

                        // 5. Research Updates
                        {
                            label: 'Milestones',
                            autogenerate: { directory: 'sentinel/milestones' }
                        },
                        {
                            label: 'Research Logs',
                            autogenerate: { directory: 'sentinel/logs' }
                        },
                    ],
                },
                {
                    label: 'Track 2: Hyperion (Network)',
                    items: [
                        { label: 'Mission Brief', link: '/hyperion/mission' },
                        { label: 'M1: Ingress Filter', link: '/hyperion/m1-report' },
                        { label: 'M2: Stateful Tracking', link: '/hyperion/m2-report' },
                        { label: 'M3: Deep Packet Inspection', link: '/hyperion/m3-report' },
                        { label: 'M4: Production-Grade Telemetry and Policy Injection', link: '/hyperion/m4-report' },
                        { label: 'M5: Flow Context & Stateful Tracking', link: '/hyperion/m5-report' },

                        // Research Updates
                        {
                            label: 'Milestones',
                            autogenerate: { directory: 'hyperion/milestones' }
                        },
                        {
                            label: 'Research Logs',
                            autogenerate: { directory: 'hyperion/logs' }
                        },

                    ],
                },
            ],
        }),
    ],
});

