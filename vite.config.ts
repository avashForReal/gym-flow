import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate", // update SW in background
      workbox: {
        globPatterns: ["**/*"], // cache everything built in /dist
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: "GYMFLOW",
        short_name: "GYMFLOW",
        description: "GYMFLOW",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        start_url: "/",
        orientation: "portrait",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },
});
