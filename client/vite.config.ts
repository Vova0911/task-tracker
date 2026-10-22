import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Проксі: запити на /api з фронту Vite перенаправляє на наш бекенд.
    // Тому у коді пишемо просто fetch('/api/...'), без localhost:4000
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
