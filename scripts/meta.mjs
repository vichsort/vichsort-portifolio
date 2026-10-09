#!/usr/bin/env node
/**
 * Prévias de link (s10): roda depois do `vite build`.
 *
 * Quem monta a prévia (LinkedIn, WhatsApp, Slack, Google) lê só o <head> do
 * HTML, sem rodar JavaScript. Por isso, para cada rota, este script grava uma
 * cópia do dist/index.html com título, descrição e imagem próprios:
 * dist/projects/plante/index.html etc. O app sobe igual em todas.
 *
 * - Idioma: inglês (os robôs não dizem o idioma; conteúdo sem en cai no pt).
 * - Imagem: a capa do nó, copiada para dist/og/; sem capa, o hero
 *   (public/images/og-default.jpg).
 * - URL absoluta: SITE_URL do ambiente ou de core/config/profile.js.
 */
import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createBuildQueries } from '../src/core/content/render.ts'
import { DEFAULT_COVER, SITE_URL } from '../src/core/config/profile.js'
import { PAGES as ROUTES, SITE_TITLE, pageTitle } from '../src/core/router/pages.js'
import { ROOT, load } from './vault.mjs'

const LANG = 'en'
const DIST = fileURLToPath(new URL('../dist/', import.meta.url))
const SRC = fileURLToPath(new URL('../src/', import.meta.url))
const DEFAULT_IMAGE = DEFAULT_COVER

const SITE_DESCRIPTION = 'Portfolio of Vitor Mignoni: web and app development, data science and software architecture.'

// Páginas fixas com prévia própria (preview na tabela de páginas); as de detalhe saem do grafo
const PAGES = ROUTES.filter((page) => page.preview)

const siteUrl = (process.env.SITE_URL || SITE_URL || '').replace(/\/$/, '')

/** Dicionário de interface em inglês: core + módulos, mesclados como no i18n do app. */
async function messages() {
  const merge = (target, source) => {
    for (const [key, value] of Object.entries(source)) {
      if (value && typeof value === 'object') merge((target[key] ??= {}), value)
      else target[key] = value
    }
    return target
  }
  const dict = JSON.parse(await readFile(join(SRC, `core/i18n/locales/${LANG}.json`), 'utf-8'))
  for (const mod of await readdir(join(SRC, 'modules'))) {
    const file = join(SRC, 'modules', mod, 'locales', `${LANG}.json`)
    if (existsSync(file)) merge(dict, JSON.parse(await readFile(file, 'utf-8')))
  }
  return (key) => key?.split('.').reduce((node, part) => node?.[part], dict)
}

/** Copia a capa do nó para dist/og/<pasta>/<id>.<ext> e devolve o caminho público. */
async function coverImage(content, id, folder) {
  const cover = content.cover(id)
  if (!cover) return DEFAULT_IMAGE
  const target = `/og/${folder}/${id}${extname(cover)}`
  await mkdir(join(DIST, 'og', folder), { recursive: true })
  await copyFile(join(ROOT, cover), join(DIST, target))
  return target
}

const escape = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function headTags({ path, title, description, image }) {
  const absolute = (p) => `${siteUrl}${p}`
  const url = absolute(path)
  return [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}" />`,
    `<link rel="canonical" href="${escape(url)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:site_name" content="${escape(SITE_TITLE)}" />`,
    `<meta property="og:url" content="${escape(url)}" />`,
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    `<meta property="og:image" content="${escape(absolute(image))}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escape(title)}" />`,
    `<meta name="twitter:description" content="${escape(description)}" />`,
    `<meta name="twitter:image" content="${escape(absolute(image))}" />`
  ].join('\n    ')
}

// Tags que o script reescreve: as do index.html saem e as da rota entram no lugar
const SEO_TAG = /^[ \t]*(<title>.*<\/title>|<meta (name|property)="(description|og:[^"]+|twitter:[^"]+)"[^>]*>|<link rel="canonical"[^>]*>)\s*\n/gm

async function writePage(template, page) {
  const html = template.replace(SEO_TAG, '').replace(/[ \t]*<\/head>/, `    ${headTags(page)}\n  </head>`)
  const file = page.path === '/' ? join(DIST, 'index.html') : join(DIST, page.path, 'index.html')
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, html)
}

const template = await readFile(join(DIST, 'index.html'), 'utf-8')
const t = await messages()
const content = createBuildQueries(await load())
const pages = PAGES.map((page) => ({
  path: page.path,
  title: pageTitle(t(page.titleKey), page.name),
  description: t(page.descriptionKey) || SITE_DESCRIPTION,
  image: DEFAULT_IMAGE
}))

for (const node of content.ofType('project')) {
  const text = content.text(node.id, LANG)
  pages.push({
    path: `/projects/${node.id}`,
    title: pageTitle(text.title || node.id),
    description: text.summary || SITE_DESCRIPTION,
    image: await coverImage(content, node.id, 'projects')
  })
}

for (const node of content.ofType('photo')) {
  const text = content.text(node.id, LANG)
  pages.push({
    path: `/gallery/${node.id}`,
    title: pageTitle(text.title || node.id),
    description: text.caption || t('gallery_page.subtitle') || SITE_DESCRIPTION,
    image: await coverImage(content, node.id, 'gallery')
  })
}

for (const page of pages) await writePage(template, page)

console.log(`meta: ${pages.length} páginas com prévia de link`)
if (!siteUrl) console.warn('meta: SITE_URL vazio; og:image e og:url saem relativos, e várias plataformas ignoram a imagem assim')
