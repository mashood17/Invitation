import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import path from 'path';

// Why manualChunks matters here: framer-motion + gsap + swiper are the
// heaviest deps in this project. Splitting them means the loader screen
// and seal (section 1) can paint before the rest of the JS finishes
// downloading — critical for the "loads in under 1s" requirement.
export default defineConfig({
  plugins: [react(), ViteImageOptimizer()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ['framer-motion'],
          gsap: ['gsap'],
          swiper: ['swiper'],
        },
      },
    },
  },
});
