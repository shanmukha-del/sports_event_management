import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 3002,
    open: false
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
});
