#!/usr/bin/env node
/**
 * Ferramentas do vault de conteúdo (src/content).
 *
 *   node scripts/content.mjs check   valida o grafo; sai com código 1 se houver erro
 *   node scripts/content.mjs index   regenera src/content/index.md
 *   node scripts/content.mjs new <tipo> <id>
 *                                    cria a pasta do nó a partir de _templates/
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, relative } from 'node:path'
import { validateGraph } from '../src/core/content/validate.ts'
import { LANGS, REQUIRED_LANGS, TYPES, TYPE_BY_FOLDER } from '../src/core/content/schema.ts'
import { ROOT, load } from './vault.mjs'

const INDEX = join(ROOT, 'index.md')
const TEMPLATES = join(ROOT, '_templates')

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

async function scaffold(typeArg, id) {
  const type = TYPES[typeArg] ? typeArg : TYPE_BY_FOLDER[typeArg]
  if (!type || !id) {
    console.log(`uso: npm run content:new -- <tipo> <id>\ntipos: ${Object.keys(TYPES).join(', ')}`)
    process.exit(2)
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
    console.log(`id inválido: "${id}" (use kebab-case minúsculo, sem acento)`)
    process.exit(2)
  }

  const dir = join(ROOT, TYPES[type].folder, id)
  if (existsSync(dir)) {
    console.log(`já existe: ${relative(process.cwd(), dir)}`)
    process.exit(1)
  }

  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, `${id}.md`), await readFile(join(TEMPLATES, `${type}.md`), 'utf-8'))
  const text = await readFile(join(TEMPLATES, `${type}.texto.md`), 'utf-8')
  // Só os idiomas obrigatórios: um arquivo opcional esquecido com o texto de exemplo
  // apareceria como tradução; sem o arquivo, o site mostra o fallback com aviso
  for (const lang of REQUIRED_LANGS) await writeFile(join(dir, `${id}.${lang}.md`), text)

  console.log(`criado: ${relative(process.cwd(), dir)}/`)
  const optional = LANGS.filter((l) => !REQUIRED_LANGS.includes(l))
  console.log('troque os valores de exemplo e rode npm run check:content e npm run content:index')
  if (optional.length) console.log(`traduções opcionais: copie um texto para ${optional.map((l) => `${id}.${l}.md`).join(', ')}`)
}

const command = process.argv[2]

if (command === 'new') {
  await scaffold(process.argv[3], process.argv[4])
  process.exit(0)
}

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
  console.log('uso: node scripts/content.mjs <check|index|new>')
  process.exit(2)
}
