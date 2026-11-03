import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { execSync } from "node:child_process";

// The footer's build stamp: the real commit and date of this build.
const commit = (() => { try { return execSync("git rev-parse --short HEAD").toString().trim(); } catch { return "local"; } })();

// The site is index.html, plus 404.html for missing pages.
export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_COMMIT__: JSON.stringify(commit),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, "index.html"),
        404: resolve(import.meta.dirname, "404.html"), // Vercel serves it for any address that doesn't exist
      },
    },
  },
});
