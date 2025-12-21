import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync } from 'fs'
import { join } from 'path'

// Plugin to copy index.html to 404.html for GitHub Pages SPA support
const copy404Plugin = () => {
  return {
    name: 'copy-404',
    closeBundle() {
      // After build, copy index.html to 404.html for GitHub Pages
      const distPath = join(process.cwd(), 'dist')
      try {
        copyFileSync(
          join(distPath, 'index.html'),
          join(distPath, '404.html')
        )
        console.log('✓ Copied index.html to 404.html for GitHub Pages support')
      } catch (error) {
        console.warn('Could not copy index.html to 404.html:', error.message)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), copy404Plugin()],
  base: '/',
  preview: {
    // Configure preview server to handle SPA routing
    // This ensures that refreshing on any route works in preview mode
    port: 4173,
    strictPort: false,
  },
  server: {
    // Configure dev server to handle SPA routing
    // This ensures that refreshing on any route works in dev mode
    port: 5173,
    strictPort: false,
  },
  build: {
    // Ensure proper handling of SPA routes in production build
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
