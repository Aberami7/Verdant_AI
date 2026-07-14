import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled via DISABLE_HMR environment variable when requested.
      // File watching is configured to prevent excessive file system operations.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to optimize CPU usage.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // Proxy API/image requests to the FastAPI backend during development.
      // The frontend calls relative paths like '/api/analyze' and
      // '/uploads/xxx.jpg' (see src/lib/api.ts), so this makes those resolve
      // to the backend instead of 404-ing against the Vite dev server.
      proxy: {
        '/api': {
          target: process.env.BACKEND_URL || 'http://localhost:8000',
          changeOrigin: true,
        },
        '/uploads': {
          target: process.env.BACKEND_URL || 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
  };
});