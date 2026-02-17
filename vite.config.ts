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
          // React Router (v7 ships all code under react-router/, not react-router-dom/)
          if (id.includes("node_modules/react-router")) {
            return "vendor-router";
          }
          // TanStack Query (exclude devtools — they get their own chunk)
          if (id.includes("node_modules/@tanstack/react-query-devtools")) {
            return "vendor-devtools";
          }
          if (id.includes("node_modules/@tanstack/react-query")) {
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
          // Zod
          if (id.includes("node_modules/zod/")) {
            return "vendor-zod";
          }
          // Radix UI primitives
          if (id.includes("node_modules/@radix-ui/")) {
            return "vendor-radix";
          }
          // Style utilities (cva, clsx, tailwind-merge)
          if (
            id.includes("node_modules/class-variance-authority/") ||
            id.includes("node_modules/clsx/") ||
            id.includes("node_modules/tailwind-merge/")
          ) {
            return "vendor-style";
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
