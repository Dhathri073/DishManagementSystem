import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy REST API calls to FastAPI
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      // Proxy WebSocket connection to FastAPI
      "/ws": {
        target: "ws://localhost:8000",
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
