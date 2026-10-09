import { fileURLToPath, URL } from 'node:url'
import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { contentPlugin } from './scripts/contentPlugin.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Bibliotecas que toda página usa: num arquivo à parte, o cache do navegador sobrevive aos deploys
const VENDOR = /\/node_modules\/(vue|@vue|vue-router|vue-i18n|@intlify|@vueuse)\//

/**
 * Divisão dos arquivos do build (a13): bibliotecas, um dicionário por idioma (os de todos
 * os módulos juntos) e o conteúdo de cada idioma (scripts/contentPlugin.mjs).
 */
function chunkOf(id) {
  if (VENDOR.test(id)) return 'vendor'
  const locale = id.match(/\/locales\/(\w+)\.json$/)
  if (locale) return `i18n-${locale[1]}`
  const content = id.match(/^\0virtual:content\/(texts|html|plain)\/(\w+)$/)
  if (content) return content[1] === 'texts' ? `content-${content[2]}` : `content-${content[2]}-${content[1]}`
}

export default defineConfig({
  plugins: [
    vue(),
    VueI18nPlugin({
      include: [
        resolve(__dirname, './src/core/i18n/locales/**'),
        resolve(__dirname, './src/modules/**/locales/**')
      ],
      strictMessage: false,
      // Os dicionários chegam compilados pelo plugin: o compilador de mensagens não vai para o site
      dropMessageCompiler: true
    }),
    contentPlugin()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: chunkOf
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})