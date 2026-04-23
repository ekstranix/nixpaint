import { readFileSync } from "node:fs";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

export default defineConfig({
	plugins: [react()],
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version),
	},
});
