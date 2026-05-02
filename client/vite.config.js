import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [react(), tailwindcss()],
	build: {
		sourcemap: false,
	},
	server: {
		proxy: {
			'/server/': {
				target: 'http://localhost:13928',
				changeOrigin: true,
			},
		},
	},
});
