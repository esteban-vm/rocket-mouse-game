import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    VitePWA({
      manifest: {
        name: 'Rocket Mouse Game',
        short_name: 'Rocket Mouse',
        description: 'Rocket Mouse Game made with Phaser 3, Vite and TypeScript',
        display: 'fullscreen',
        orientation: 'landscape',
        start_url: '/',
        theme_color: '#89cfeb',
        icons: [
          {
            src: '/icons/manifest-icon-192.maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/manifest-icon-192.maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/icons/manifest-icon-512.maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/manifest-icon-512.maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      includeAssets: ['/characters/*.json', '/characters/*.png', '/house/*.png', '/sounds/*.mp3', '/fonts/*.ttf'],
      registerType: 'autoUpdate',
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1_500,
  },
})
