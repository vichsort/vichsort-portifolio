#!/usr/bin/env node
/**
 * Confere as prévias de link do build (a12): roda depois do `npm run build`.
 *
 * O meta.mjs grava um index.html por rota, e quem monta a prévia (LinkedIn,
 * WhatsApp) só lê o <head>. Um título vazio, uma imagem relativa ou uma capa
 * que não foi copiada não quebram o site, só a prévia: ninguém vê. Por rota:
 *
 * - a página existe (as fixas com preview e uma por projeto e por foto);
 * - um <title>, uma descrição e um og:title, sem "undefined" nem vazio;
 * - og:url e canonical iguais ao endereço da rota;
 * - og:image com URL absoluta, e o arquivo dentro do dist/.
 *
 * Sai com código 1 se algo falhar.
 */
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITE_URL } from '../src/core/config/profile.js'
import { PAGES } from '../src/core/router/pages.js'
import { load } from './vault.mjs'

const DIST = fileURLToPath(new URL('../dist/', import.meta.url))
const siteUrl = (process.env.SITE_URL || SITE_URL || '').replace(/\/$/, '')

const unescape = (value) => value.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&amp;/g, '&')

/** Valores de uma tag no <head>: <title> ou o content de um meta/link. */
function tagValues(html, name) {
  if (name === 'title') return [...html.matchAll(/<title>(.*?)<\/title>/g)].map((m) => unescape(m[1]))
  if (name === 'canonical') return [...html.matchAll(/<link rel="canonical" href="([^"]*)"/g)].map((m) => unescape(m[1]))
  const attr = name.startsWith('og:') ? 'property' : 'name'
  return [...html.matchAll(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`, 'g'))].map((m) => unescape(m[1]))
}

/** Problemas da prévia de uma rota, ou lista vazia. */
export function checkPage(html, path, { site, exists }) {
  const problems = []
  const one = (name) => {
    const values = tagValues(html, name)
    if (values.length !== 1) problems.push(`${name}: ${values.length} tags, esperado 1`)
    const [value = ''] = values
    if (!value.trim() || /\b(undefined|null)\b/.test(value)) problems.push(`${name}: "${value}"`)
    return value
  }

  one('title')
  one('description')
  one('og:title')
  one('og:description')

  const url = `${site}${path}`
  if (one('og:url') !== url) problems.push(`og:url diferente de ${url}`)
  if (one('canonical') !== url) problems.push(`canonical diferente de ${url}`)

  const image = one('og:image')
  if (!/^https?:\/\//.test(image)) problems.push(`og:image relativa: "${image}"`)
  else if (!image.startsWith(`${site}/`)) problems.push(`og:image fora do site: "${image}"`)
  else if (!exists(image.slice(site.length))) problems.push(`og:image sem o arquivo no dist: ${image.slice(site.length)}`)

  return problems
}

async function main() {
  if (!siteUrl) {
    console.log('ERRO  SITE_URL vazio: as prévias saem com URL relativa')
    process.exit(1)
  }

  const graph = await load()
  const ids = (type) => [...graph.nodes.values()].filter((n) => n.type === type).map((n) => n.id)
  const paths = [
    ...PAGES.filter((page) => page.preview).map((page) => page.path),
    ...ids('project').map((id) => `/projects/${id}`),
    ...ids('photo').map((id) => `/gallery/${id}`)
  ]

  const exists = (path) => existsSync(join(DIST, decodeURI(path)))
  let errors = 0
  for (const path of paths) {
    const file = join(DIST, path, 'index.html')
    const problems = existsSync(file) ? checkPage(await readFile(file, 'utf-8'), path, { site: siteUrl, exists }) : ['página não gerada']
    for (const problem of problems) console.log(`ERRO  ${path}: ${problem}`)
    errors += problems.length
  }

  console.log(`dist: ${paths.length} páginas com prévia · ${errors} erro(s)`)
  process.exit(errors ? 1 : 0)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main()
