import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// The site is index.html, plus journal.html and 404.html for missing pages.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, "index.html"),
        404: resolve(import.meta.dirname, "404.html"), // Vercel serves it for any address that doesn't exist
        journal: resolve(import.meta.dirname, "journal.html"),
      },
    },
  },
});
