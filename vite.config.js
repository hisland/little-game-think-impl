import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dirListPlugin from './vite2-plugin-dir-list.js'
const { resolve } = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), dirListPlugin()],
  server: {
    host: '0.0.0.0',
  },
  optimizeDeps: {
    entries: [],
  },
  // root: resolve(__dirname, 'src/flash-dot'),
  // base: './',
  build: {
    rollupOptions: {
      input: {
        // 'mine-sweeper': resolve(__dirname, 'src/mine-sweeper/index.html'),
      },
    },
  },
})
