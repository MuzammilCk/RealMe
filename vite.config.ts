import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
      '@ui': '/src/ui',
      '@scene': '/src/scene',
      '@lib': '/src/lib',
      '@styles': '/src/styles',
    },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        // Split the heavy 3D stack out of the main chunk so Layer B (and the
        // no-WebGL fallback) is not blocked by three.js / R3F download.
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
          gsap: ['gsap', '@gsap/react'],
          motion: ['framer-motion'],
        },
      },
    },
  },
  // Optimize deps for faster dev server startup
  optimizeDeps: {
    include: [
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'gsap',
      '@gsap/react',
      'framer-motion',
    ],
  },
  // GLSL shader support via import
  assetsInclude: ['**/*.glsl', '**/*.vs', '**/*.fs', '**/*.vert', '**/*.frag'],
});
