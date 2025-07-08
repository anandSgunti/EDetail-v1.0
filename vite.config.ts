import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',    // ← makes all asset URLs relative to index.html
  plugins: [react()],
})
