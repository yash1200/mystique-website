import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// Pages are prerendered; unknown paths get the SPA shell (404.html), served by most static hosts.
			adapter: adapter({ fallback: '404.html' }),
			// GitHub Pages serves from /<repo>; the deploy workflow sets BASE_PATH. Empty locally.
			paths: { base: (process.env.BASE_PATH ?? '') as '' | `/${string}` }
		})
	]
});
