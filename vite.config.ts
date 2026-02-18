import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      "/api": {
        target: process.env.VITE_API_PROXY_TARGET ?? "https://teamsowa.com",
        changeOrigin: true,
        secure: true,
      },
      "/media": {
        target: process.env.VITE_API_PROXY_TARGET ?? "https://teamsowa.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
