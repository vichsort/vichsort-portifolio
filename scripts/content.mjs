#!/usr/bin/env node
/**
 * Ferramentas do vault de conteúdo (src/content).
 *
 *   node scripts/content.mjs check   valida o grafo; sai com código 1 se houver erro
 *   node scripts/content.mjs index   regenera src/content/index.md
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildGraph } from '../src/core/content/graph.js'
import { validateGraph } from '../src/core/content/validate.js'
import { TYPES } from '../src/core/content/schema.js'

const ROOT = fileURLToPath(new URL('../src/content/', import.meta.url))
const INDEX = join(ROOT, 'index.md')

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

async function load() {
  const files = []
  const assets = []
  for (const full of await walk(ROOT)) {
    const path = relative(ROOT, full).split(sep).join('/')
    if (path.endsWith('.md')) files.push({ path, raw: await readFile(full, 'utf-8') })
    else assets.push({ path, url: path })
  }
  return buildGraph(files, assets)
}

function renderIndex(graph) {
  const lines = [
    '---',
    'generated: true',
    '---',
    '',
    '# Índice',
    '',
    '> Gerado por `npm run content:index`. Não edite à mão.',
    ''
  ]
  for (const [type, def] of Object.entries(TYPES)) {
    const ids = [...graph.nodes.values()].filter((n) => n.type === type).map((n) => n.id).sort()
    if (!ids.length) continue
    lines.push(`## ${def.folder}`, '', ...ids.map((id) => `- [[${id}]]`), '')
  }
  return lines.join('\n')
}

async function readIndex() {
  try {
    return await readFile(INDEX, 'utf-8')
  } catch {
    return null
  }
}

const command = process.argv[2]
const graph = await load()

if (command === 'index') {
  await writeFile(INDEX, renderIndex(graph))
  console.log(`index.md: ${graph.nodes.size} nós`)
} else if (command === 'check') {
  const issues = [...graph.issues, ...validateGraph(graph)]
  if ((await readIndex()) !== renderIndex(graph)) {
    issues.push({ level: 'warning', code: 'stale-index', where: 'index.md', message: 'desatualizado; rode npm run content:index' })
  }

  for (const { level, where, message } of issues) {
    console.log(`${level === 'error' ? 'ERRO ' : 'aviso'}  ${where}: ${message}`)
  }

  const errors = issues.filter((i) => i.level === 'error').length
  const warnings = issues.length - errors
  console.log(`\n${graph.nodes.size} nós, ${graph.edges.length} ligações · ${errors} erro(s), ${warnings} aviso(s)`)
  process.exit(errors ? 1 : 0)
} else {
  console.log('uso: node scripts/content.mjs <check|index>')
  process.exit(2)
}
