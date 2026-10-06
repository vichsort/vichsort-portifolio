import MarkdownIt from 'markdown-it'
import { replaceBodyLinks } from './links.js'

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true
})

// Imagens relativas (![](screenshot.png)) apontam para os arquivos da pasta do nó
const defaultImage = md.renderer.rules.image
md.renderer.rules.image = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  const src = token.attrGet('src')
  const url = env?.assets?.[src]
  if (url) token.attrSet('src', url)
  return defaultImage(tokens, idx, options, env, self)
}

/**
 * Renderiza o corpo de um nó.
 *
 * Wikilinks viram o texto do rótulo (ou o nome do nó) por enquanto; virar
 * link clicável é uma etapa posterior. Embeds (![[arquivo.png]]) viram
 * imagens Markdown.
 *
 * @param {string} body
 * @param {{ assets?: Record<string, string>, label?: (target: string) => string }} [options]
 * @returns {string} HTML
 */
export function renderBody(body, { assets = {}, label = (t) => t } = {}) {
  const source = replaceBodyLinks(body, (target, text, embed) =>
    embed ? `![](<${target}>)` : text || label(target)
  )
  return md.render(source, { assets })
}
