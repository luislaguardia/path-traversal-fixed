import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173,
    headers: {
      'X-Frame-Options': 'DENY',
      'Content-Security-Policy': 
        "default-src 'self'; " +
        "script-src 'self' 'strict-dynamic'; " +
        "style-src 'self' 'strict-dynamic'; " +
        "img-src 'self' data:; " +
        "connect-src 'self'; " +
        "frame-ancestors 'none';",
      'X-Content-Type-Options': 'nosniff', // ✅ Fix for ZAP alert
    },
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
    strictPort: true,
    fs: {
      strict: true,
    },
    build: {
      minify: 'esbuild',
    },
    define: {
      'process.env': {},
    },
    hmr: {
      overlay: false,
    },
  },
});
