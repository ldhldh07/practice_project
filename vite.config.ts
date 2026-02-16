import path from "node:path";

import devServer from "@hono/vite-dev-server";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    devServer({
      entry: "./server/index.ts",
      exclude: [/^(?!\/api).*/],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@app": path.resolve(__dirname, "src/app"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@widgets": path.resolve(__dirname, "src/widgets"),
      "@features": path.resolve(__dirname, "src/features"),
      "@entities": path.resolve(__dirname, "src/entities"),
      "@shared": path.resolve(__dirname, "src/shared"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "vendor-react";
          }
          // TanStack Query
          if (id.includes("node_modules/@tanstack/react-query/")) {
            return "vendor-query";
          }
          // React Hook Form
          if (id.includes("node_modules/react-hook-form/") || id.includes("node_modules/@hookform/resolvers/")) {
            return "vendor-form";
          }
          // Jotai
          if (id.includes("node_modules/jotai/")) {
            return "vendor-jotai";
          }
          // React Router
          if (id.includes("node_modules/react-router-dom/")) {
            return "vendor-router";
          }
          // Zod
          if (id.includes("node_modules/zod/")) {
            return "vendor-zod";
          }
          // Lucide Icons
          if (id.includes("node_modules/lucide-react/")) {
            return "vendor-icons";
          }
          // Catch-all for remaining node_modules
          if (id.includes("node_modules/")) {
            return "vendor";
          }
        },
      },
    },
  },
});
