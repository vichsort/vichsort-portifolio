import { renderBody } from './markdown.ts'
import { replaceBodyLinks } from './links.ts'
import { fallbackChain } from '../i18n/languages.js'
import { nodeRoute } from './routes.ts'
import { buildNodeMenu } from './nodeMenu.ts'
import { createQueries, type Queries, type TextSource } from './queries.ts'
import type { ContentGraph } from './types.ts'

/**
 * Consultas com os textos do vault inteiro, para o build: o plugin de conteúdo
 * (scripts/contentPlugin.mjs) gera daqui os módulos que o site baixa, e o
 * scripts/meta.mjs, as prévias de link. Só roda no Node: o site não recebe o
 * parser de Markdown.
 */
export function createBuildQueries(graph: ContentGraph): Queries {
  const htmlCache = new Map<string, string>()
  const node = (id: string) => graph.nodes.get(id)

  const textLang = (id: string, lang: string): string | null => {
    const texts = node(id)?.texts || {}
    return fallbackChain(lang).find((l: string) => texts[l]) || null
  }

  const fullText = (id: string, lang: string) => {
    const used = textLang(id, lang)
    return (used && node(id)?.texts[used]) || null
  }

  const label = (target: string, lang: string) => {
    const resolved = graph.resolve(target)
    return resolved ? queries.label(resolved, lang) : target
  }

  const source: TextSource = {
    textLang,

    text: (id, lang) => {
      const { body: _body, ...fields } = fullText(id, lang) || { body: '' }
      return fields
    },

    html: (id, lang) => {
      const key = `${id}.${lang}`
      const cached = htmlCache.get(key)
      if (cached !== undefined) return cached

      const rendered = renderBody(fullText(id, lang)?.body || '', {
        assets: node(id)?.assets,
        label: (target) => label(target, lang),
        // Um link para a própria página do nó não leva a lugar nenhum: fica como texto
        href: (target) => {
          const path = nodeRoute(queries.node(graph.resolve(target)))
          return path && path !== nodeRoute(queries.node(id)) ? path : null
        },
        // Sem página: abre o menu do nó, se houver o que mostrar além deste próprio nó
        menu: (target) => {
          const resolved = graph.resolve(target)
          if (!resolved || resolved === id) return null
          return buildNodeMenu(queries, resolved, { lang, exclude: [id] }).length ? resolved : null
        },
        source: id
      })
      htmlCache.set(key, rendered)
      return rendered
    },

    plain: (id, lang) =>
      replaceBodyLinks(fullText(id, lang)?.body || '', (target, alias, embed) => (embed ? '' : alias || label(target, lang)))
  }

  const queries = createQueries(graph, source)
  return queries
}
