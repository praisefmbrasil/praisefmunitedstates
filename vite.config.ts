
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',

      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },

      // Registra o Service Worker sem bloquear a leitura inicial do HTML.
      injectRegister: 'script-defer',
      registerType: 'autoUpdate',

      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],

      manifest: {
        name: 'Praise FM USA',
        short_name: 'Praise FM',
        description: '24/7 Worship & Gospel Radio',
        theme_color: '#ff6600',
        background_color: '#121212',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],

  // Evita que o Vite empacote @vercel/og no contexto de SSR.
  ssr: {
    external: ['@vercel/og'],
  },

  build: {
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('react-router-dom')
            ) {
              return 'react'
            }

            if (
              id.includes('lucide-react') ||
              id.includes('swiper')
            ) {
              return 'ui'
            }

            return 'vendor'
          }
        },
      },
    },
  },
})
