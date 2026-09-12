import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// `base: "./"` keeps asset URLs relative so the build works from any
// subfolder (GitHub Pages project sites included) without reconfiguration.
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
