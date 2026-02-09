import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/New_Interview_UI/',
  build: {
    outDir: 'docs',
  },
})
