import { defineConfig } from 'vite';
import { resolve } from "path";
import vue from '@vitejs/plugin-vue';

export default defineConfig({
	plugins: [vue()],
	define: {
		APP_VERSION: JSON.stringify(process.env.npm_package_version),
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
});
