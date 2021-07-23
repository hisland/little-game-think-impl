import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dirListPlugin from './vite2-plugin-dir-list.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), dirListPlugin()],
  server: {
    host: '0.0.0.0',
  },
  optimizeDeps: {
    entries: [],
  },
})
