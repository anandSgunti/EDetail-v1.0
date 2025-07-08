import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/EDetail-v1.0/' : '/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
