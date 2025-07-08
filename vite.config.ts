import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // If this is a project page under your org:
  base: '/EDetail-v1.0/',
  plugins: [react()],
});
