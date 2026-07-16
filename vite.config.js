import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { searchForWorkspaceRoot } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		sveltekit(),
		devtoolsJson(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			manifest: false, // Using our custom manifest in /static/manifest.json
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
			}
		})
	],
	server: {
		fs: {
			allow: [searchForWorkspaceRoot(process.cwd())]
		}
	}
});
