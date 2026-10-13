#!/usr/bin/env node
/**
 * Gera a imagem padrão das prévias de link (s11): public/images/og-default.png.
 *
 * Sem texto, para servir aos quatro idiomas: o fundo escuro do site (o tema padrão)
 * com o logo NEAT no centro, maior que nos cards do site, para não parecer imagem
 * quebrada numa prévia pequena. Centralizado, sobrevive ao corte quadrado do WhatsApp.
 * As cores são as do tema escuro (core/styles/tokens.css), como no index.html.
 *
 *   node scripts/og-image.mjs     (depois de npx playwright install chromium)
 */
import { chromium } from '@playwright/test'
import { fileURLToPath } from 'node:url'

const OUT = fileURLToPath(new URL('../public/images/og-default.png', import.meta.url))
const WIDTH = 1200
const HEIGHT = 630
const CELL = 56

// p (roxo), b (azul), k (tinta), vazio: o mesmo desenho do NeatLogo.vue
const CELLS = ['', 'p', 'k', 'k', '', 'k', 'p', 'b', '']

const html = `<!doctype html>
<style>
  html, body { margin: 0; width: ${WIDTH}px; height: ${HEIGHT}px; background: #080711; }
  body { display: grid; place-items: center; }
  .logo { display: grid; grid-template-columns: repeat(3, ${CELL}px); grid-template-rows: repeat(3, ${CELL}px); }
  .p { background: #5d1de7; }
  .b { background: #3a31d8; }
  .k { background: #f8fafc; }
</style>
<div class="logo">${CELLS.map((c) => `<span class="${c}"></span>`).join('')}</div>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } })
await page.setContent(html)
await page.screenshot({ path: OUT })
await browser.close()
console.log(`og-image: ${OUT}`)
