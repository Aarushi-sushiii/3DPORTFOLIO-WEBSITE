import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true,
    watch: {
      usePolling: true,
      interval: 100
    }
  },
  publicDir: 'public',
  root: './',
  build: {
    watch: true,
    chunkSizeWarningLimit: 1000
  }
}); 