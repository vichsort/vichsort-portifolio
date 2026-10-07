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

// Colchetes no texto do link fechariam o [rótulo] antes da hora
const escapeLinkText = (text) => text.replace(/[[\]]/g, '\\$&')

/**
 * Renderiza o corpo de um nó.
 *
 * Wikilinks viram links para a página do nó citado; se ele não tem página,
 * ficam só o texto do rótulo (ou o nome do nó). Embeds (![[arquivo.png]])
 * viram imagens Markdown.
 *
 * @param {string} body
 * @param {{
 *   assets?: Record<string, string>,
 *   label?: (target: string) => string,
 *   href?: (target: string) => string|null
 * }} [options]
 * @returns {string} HTML
 */
export function renderBody(body, { assets = {}, label = (t) => t, href = () => null } = {}) {
  const source = replaceBodyLinks(body, (target, text, embed) => {
    if (embed) return `![](<${target}>)`
    const shown = text || label(target)
    const path = href(target)
    return path ? `[${escapeLinkText(shown)}](<${path}>)` : shown
  })
  return md.render(source, { assets })
}

/**
 * Renderiza Markdown solto, fora de um nó (resumos, saída do terminal).
 *
 * @param {string} text
 * @returns {string} HTML
 */
export function renderMarkdown(text) {
  return text ? md.render(text) : ''
}
