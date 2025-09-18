import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/Ecommerceweb/", // 🔥 important: match your repo name
});
