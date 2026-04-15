import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(__dirname, "src");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      components: path.join(src, "components"),
      scenes: path.join(src, "scenes"),
      state: path.join(src, "state"),
      utils: path.join(src, "utils"),
      assets: path.join(src, "assets"),
      theme: path.join(src, "theme.js"),
      config: path.join(src, "config"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
