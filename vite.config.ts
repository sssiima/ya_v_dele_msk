import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          telegram: ['@twa-dev/sdk'],
        },
        assetFileNames: (assetInfo) => {
          // Отделяем шрифты от других assets
          if (assetInfo.name.endsWith('.otf') || 
              assetInfo.name.endsWith('.ttf') ||
              assetInfo.name.endsWith('.woff') ||
              assetInfo.name.endsWith('.woff2')) {
            return 'fonts/[name][extname]'
          }
          return 'assets/[name][extname]'
        }
      },
    },
  },
})
