/**
 * Plugin do Vite que entrega o vault (src/content) pronto para o site (a13).
 *
 * O YAML e o Markdown são lidos aqui, no build; o navegador não recebe nenhum dos
 * dois parsers. Módulos gerados:
 *
 * - virtual:content/structure      nós, ligações e arquivos (vai no arquivo principal)
 * - virtual:content/texts/<idioma> campos de texto de cada nó, já com o fallback de idioma
 * - virtual:content/html/<idioma>  corpos em HTML (detalhe do projeto e da foto)
 * - virtual:content/plain/<idioma> corpos em Markdown simples, sem wikilinks (terminal)
 * - virtual:content/loaders        import() de cada um, para o site baixar só o que usa
 *
 * Os textos de um idioma são baixados antes da primeira tela e a cada troca de idioma;
 * os corpos, só quando uma página precisa deles (core/content/index.ts).
 */
import { relative } from 'node:path'
import { load, ROOT } from './vault.mjs'
import { validateGraph } from '../src/core/content/validate.ts'
import { createBuildQueries } from '../src/core/content/render.ts'
import { renderMarkdown } from '../src/core/content/markdown.ts'
import { LANGS } from '../src/core/i18n/languages.js'

const PREFIX = 'virtual:content/'
const KINDS = ['texts', 'html', 'plain']
const RESOLVED = '\0' + PREFIX

// Marca de um arquivo do vault no conteúdo gerado: o índice na lista `assets` da estrutura
// (core/content/structure.ts, ASSET_MARK)
const ASSET = (i) => `@@asset:${i}@@`

/**
 * A estrutura importa a URL (com hash) de todos os arquivos do vault e os exporta numa
 * lista; os outros módulos só levam a marca, trocada pela URL quando chegam. Assim os
 * imports dos arquivos ficam no arquivo principal, e não no primeiro módulo de corpos
 * que o Rollup encontrar (o que fazia toda página baixar os corpos de um idioma).
 */
function structureModule(structure, assetPaths) {
  const imports = assetPaths.map((path, i) => `import a${i} from ${JSON.stringify('/src/content/' + path + '?url')}`)
  const list = assetPaths.map((_, i) => `a${i}`).join(', ')
  return `${imports.join('\n')}\nexport const assets = [${list}]\nexport default ${JSON.stringify(structure)}\n`
}

async function buildContent() {
  const graph = await load()
  const issues = [...graph.issues, ...validateGraph(graph)]
  const queries = createBuildQueries(graph)

  // vault.mjs entrega os arquivos com o caminho relativo ao vault como url
  const assetPaths = []
  const assetRef = (path) => {
    let i = assetPaths.indexOf(path)
    if (i < 0) i = assetPaths.push(path) - 1
    return ASSET(i)
  }

  const nodes = [...graph.nodes.values()].map(({ texts: _texts, assets, ...node }) => ({
    ...node,
    assets: Object.fromEntries(Object.entries(assets).map(([file, path]) => [file, assetRef(path)]))
  }))

  // O HTML dos corpos aponta para as imagens da pasta do nó pelo caminho no vault
  const vaultFiles = new Set([...graph.nodes.values()].flatMap((n) => Object.values(n.assets)))
  const withAssets = (html) =>
    html.replace(/(src|href)="([^"]+)"/g, (match, attr, url) => {
      const path = decodeURI(url)
      return vaultFiles.has(path) ? `${attr}="${assetRef(path)}"` : match
    })

  const texts = {}
  const html = {}
  const plain = {}
  for (const lang of LANGS) {
    const text = {}
    const used = {}
    html[lang] = {}
    plain[lang] = {}
    for (const node of graph.nodes.values()) {
      const from = queries.textLang(node.id, lang)
      if (!from) continue
      used[node.id] = from
      text[node.id] = queries.text(node.id, lang)
      // O resumo do card de projeto também passa pelo Markdown (aspas e apóstrofos tipográficos)
      if (node.type === 'project' && text[node.id].summary) text[node.id].summaryHtml = renderMarkdown(String(text[node.id].summary))
      const rendered = queries.html(node.id, lang)
      if (rendered) {
        html[lang][node.id] = withAssets(rendered)
        plain[lang][node.id] = queries.plain(node.id, lang)
      }
    }
    texts[lang] = { text, used }
  }

  return { issues, structure: { nodes }, modules: { texts, html, plain }, assetPaths }
}

export function contentPlugin() {
  let content = null
  let server = null
  const get = () => (content ||= buildContent())

  return {
    name: 'vichsort:content',

    resolveId(id) {
      if (id.startsWith(PREFIX)) return '\0' + id
    },

    async load(id) {
      if (!id.startsWith(RESOLVED)) return
      const name = id.slice(RESOLVED.length)

      if (name === 'loaders') {
        const entries = (kind) => LANGS.map((lang) => `  ${lang}: () => import('${PREFIX}${kind}/${lang}')`).join(',\n')
        return KINDS.map((kind) => `export const ${kind} = {\n${entries(kind)}\n}\n`).join('')
      }

      const { structure, modules, assetPaths, issues } = await get()
      if (server && name === 'structure') {
        for (const { level, where, message } of issues) server.config.logger[level === 'error' ? 'error' : 'warn'](`[content] ${where}: ${message}`)
      }
      if (name === 'structure') return structureModule(structure, assetPaths)

      const [kind, lang] = name.split('/')
      if (modules[kind]?.[lang]) return `export default ${JSON.stringify(modules[kind][lang])}\n`
    },

    // No dev, qualquer arquivo do vault refaz o conteúdo e recarrega a página
    configureServer(devServer) {
      server = devServer
      devServer.watcher.add(ROOT)
      const reload = (file) => {
        const path = relative(ROOT, file)
        if (path.startsWith('..')) return
        content = null
        const graph = devServer.environments.client.moduleGraph
        for (const mod of graph.idToModuleMap.values()) {
          if (mod.id?.startsWith(RESOLVED)) graph.invalidateModule(mod)
        }
        devServer.ws.send({ type: 'full-reload' })
      }
      devServer.watcher.on('add', reload)
      devServer.watcher.on('change', reload)
      devServer.watcher.on('unlink', reload)
    }
  }
}
