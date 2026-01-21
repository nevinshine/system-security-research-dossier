import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
    site: 'https://nevinshine.github.io',
    base: '/system-security-research-dossier',

    integrations: [
        starlight({
            title: 'Systems Security Research Dossier',
            
            social: [
                {
                    label: 'GitHub',
                    // FIXED: The error explicitly asked for 'href'
                    href: 'https://github.com/nevinshine/sentinel-runtime',
                    icon: 'github',
                },
            ],
            
            customCss: ['./src/styles/custom.css'],
            
            sidebar: [
                {
                    label: 'Track 1: Sentinel (Host)',
                    items: [
                        // The High-Level Overview
                        { label: 'Mission Brief', link: '/sentinel/mission' },
                        { label: 'System Architecture', link: '/sentinel/architecture' },
                        
                        // The "Missing" Deep Dives (restored)
                        { 
                            label: 'Kernel Internals', 
                            autogenerate: { directory: 'sentinel/kernel-internals' } 
                        },
                        { 
                            label: 'Ptrace Mechanics', 
                            autogenerate: { directory: 'sentinel/ptrace-mechanics' } 
                        },
                        { 
                            label: 'Research Log', 
                            autogenerate: { directory: 'sentinel/research-log' } 
                        },
                    ],
                },
                {
                    label: 'Track 2: Hyperion (Network)',
                    items: [
                        { label: 'Mission Brief', link: '/hyperion/mission' },
                        { label: 'M1: Ingress Filter', link: '/hyperion/m1-report' },
                        { label: 'M2: Stateful Tracking', link: '/hyperion/m2-report' },
                    ],
                },
            ],
        }),
    ],
});



