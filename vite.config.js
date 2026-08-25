import { defineConfig } from 'vitest/config';
import { resolve } from "path";
import vue from '@vitejs/plugin-vue';

export default defineConfig({
	plugins: [vue()],
	define: {
		APP_VERSION: JSON.stringify(process.env.npm_package_version || '0.0.0-test'),
	},
	resolve: {
		alias: {
			"@": resolve(import.meta.dirname, "./src"),
		},
	},
	test: {
		environment: 'jsdom',
		setupFiles: ['./tests/setup.js'],
		env: {
			TZ: 'UTC',
		},
	},
});
