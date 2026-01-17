import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  preview: {
    allowedHosts: ["https://suretrust-g29-socialmedia-backend-1.onrender.com"],
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 4173,
  },
});
