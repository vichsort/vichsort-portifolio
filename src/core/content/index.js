import { buildGraph } from './graph.js'
import { validateGraph } from './validate.js'
import { createQueries } from './queries.js'

/**
 * Carrega o vault em src/content/ e monta o grafo uma única vez.
 * Depende do Vite (import.meta.glob); o script de validação monta o seu
 * próprio grafo a partir do disco.
 */

const ROOT = '/src/content/'

// Notas na raiz (índice, guia) e pastas com "_" (modelos) não são conteúdo do site
const markdown = import.meta.glob(['/src/content/**/*.md', '!/src/content/*.md', '!/src/content/_*/**'], {
  query: '?raw',
  import: 'default',
  eager: true
})

const files = import.meta.glob(['/src/content/**/*', '!/src/content/**/*.md', '!/src/content/_*/**'], {
  query: '?url',
  import: 'default',
  eager: true
})

const strip = (path) => path.slice(ROOT.length)

export const graph = buildGraph(
  Object.entries(markdown).map(([path, raw]) => ({ path: strip(path), raw })),
  Object.entries(files).map(([path, url]) => ({ path: strip(path), url }))
)

export const issues = [...graph.issues, ...validateGraph(graph)]

if (import.meta.env?.DEV && issues.length) {
  for (const { level, where, message } of issues) {
    console[level === 'error' ? 'error' : 'warn'](`[content] ${where}: ${message}`)
  }
}

export const content = createQueries(graph)
