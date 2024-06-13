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
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // split vendor modules into a separate chunk
          }
        }
      }
    }
  }
});
