import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    proxy: {
      '/watchman': {
        target: 'https://watchman-gazintech.azurewebsites.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/watchman/, '')
      }
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      devOptions: {
        enabled: true
      },
      includeAssets: ['/icon.png', '/apple-touch-icon.svg', '/mask-icon.png'],
      manifest: {
        lang: 'pt-BR',
        display: 'fullscreen',
        orientation: 'portrait',
        name: 'HMTIW Senior',
        short_name: 'HMTIW',
        description: 'HMTIW Senior',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/icon.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/mask-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})
