import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ogc-checker/',
  build: {
    outDir: 'docs',
  },
  test: {
    environment: 'node',
    setupFiles: ['src/vitest-matchers.ts'],
    deps: {
      inline: ['@geonovum/standards-checker'],
      optimizer: {
        ssr: {
          include: ['@geonovum/standards-checker'],
        },
      },
    },
  },
});
