import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'development' ? '/' : 'http://hello.world/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1024,
    
  }
});
