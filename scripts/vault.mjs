/**
 * Leitura do vault (src/content) no Node, sem o Vite: monta o grafo a partir
 * do disco. Usado por content.mjs (validação, índice) e meta.mjs (prévias de link).
 *
 * Os assets ficam com o caminho relativo ao vault como url (ex.: projects/cicc/cover.jpg).
 */
import { readdir, readFile } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildGraph } from '../src/core/content/graph.ts'

export const ROOT = fileURLToPath(new URL('../src/content/', import.meta.url))

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else out.push(full)
  }
  return out
}

export async function load() {
  const files = []
  const assets = []
  for (const full of await walk(ROOT)) {
    const path = relative(ROOT, full).split(sep).join('/')
    if (path.endsWith('.md')) files.push({ path, raw: await readFile(full, 'utf-8') })
    else assets.push({ path, url: path })
  }
  return buildGraph(files, assets)
}
