import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/json-fg-linter/',
  build: {
    outDir: 'docs',
  },
});
