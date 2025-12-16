import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3006,
    open: true,
  },
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
      },
      // This makes SVG imports work with the ?react query parameter
      include: '**/*.svg?react',
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1600,
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
