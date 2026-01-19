import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://nevinshine.github.io',
	base: '/system-security-research-dossier',
	integrations: [
		starlight({
			title: 'System Security Research Dossier',
			social: [
				{
					label: 'GitHub',
					href: 'https://github.com/nevinshine/sentinel-runtime', // FIXED: The compiler demands 'href'
					icon: 'github',
				},
			],
			customCss: ['./src/styles/custom.css'],
			sidebar: [
				{
					label: 'Sentinel Architecture',
					autogenerate: { directory: 'sentinel-architecture' },
				},
				{
					label: 'Ptrace Mechanics',
					autogenerate: { directory: 'ptrace-mechanics' },
				},
				{
					label: 'Kernel Internals',
					autogenerate: { directory: 'kernel-internals' },
				},
				{
					label: 'Threat Models',
					autogenerate: { directory: 'threat-models' },
				},
				{
          			label: 'Research Log',
          			autogenerate: { directory: 'research-log' },
               },
			],
		}),
	],
});
