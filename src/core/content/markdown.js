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
 * Gatilho do menu de nó no meio do texto (n10). O clique é tratado pela diretiva
 * v-content-links (shared/directives/contentLinks.js), que abre o NodeMenuHost.
 */
const nodeTrigger = (id, text, source) => {
  const from = source ? ` data-from="${md.utils.escapeHtml(source)}"` : ''
  return `<button type="button" class="node-ref" data-node="${md.utils.escapeHtml(id)}"${from} aria-haspopup="menu" aria-expanded="false">${md.utils.escapeHtml(text)}</button>`
}

/**
 * Renderiza o corpo de um nó.
 *
 * Wikilinks viram links para a página do nó citado. Se ele não tem página mas
 * tem menu (techs, tópicos, cargos com usos), viram o gatilho do menu de nó;
 * senão, fica só o texto do rótulo (ou o nome do nó). Embeds (![[arquivo.png]])
 * viram imagens Markdown.
 *
 * @param {string} body
 * @param {{
 *   assets?: Record<string, string>,
 *   label?: (target: string) => string,
 *   href?: (target: string) => string|null,
 *   menu?: (target: string) => string|null,
 *   source?: string
 * }} [options]
 *   href: caminho da página do alvo, ou null
 *   menu: id do nó, se o alvo (sem página) abre o menu de nó; ou null
 *   source: id do nó dono do texto, que o menu aberto daqui deixa de fora
 * @returns {string} HTML
 */
export function renderBody(body, { assets = {}, label = (t) => t, href = () => null, menu = () => null, source } = {}) {
  const markdown = replaceBodyLinks(body, (target, text, embed) => {
    if (embed) return `![](<${target}>)`
    const shown = text || label(target)
    const path = href(target)
    if (path) return `[${escapeLinkText(shown)}](<${path}>)`
    const node = menu(target)
    return node ? nodeTrigger(node, shown, source) : shown
  })
  return md.render(markdown, { assets })
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
