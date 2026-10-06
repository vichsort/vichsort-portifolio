/**
 * Leitura de wikilinks no formato do Obsidian.
 *
 * Aceita "[[id]]", "[[id|rótulo]]" e "[[id#seção]]". Também aceita o id
 * puro ("python") e a forma sem aspas que o YAML transforma em lista
 * aninhada ([["python"]]).
 */

const WIKILINK = /^\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]$/

// Captura [[alvo|rótulo]] no corpo, ignorando embeds (![[...]])
const BODY_WIKILINK = /(!?)\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]*))?\]\]/g

/**
 * Extrai o alvo de um valor de ligação do frontmatter.
 *
 * @param {unknown} value
 * @returns {string|null} alvo como escrito (sem colchetes), ou null se vazio
 */
export function parseLink(value) {
  let v = value
  while (Array.isArray(v) && v.length === 1) v = v[0]
  if (typeof v !== 'string') return null

  const text = v.trim()
  if (!text) return null

  const match = text.match(WIKILINK)
  return (match ? match[1] : text).trim()
}

/**
 * Normaliza um campo de ligação múltipla para uma lista de alvos.
 *
 * @param {unknown} value
 * @returns {string[]}
 */
export function parseLinkList(value) {
  if (value === undefined || value === null || value === '') return []
  const list = Array.isArray(value) ? value : [value]
  return list.map(parseLink).filter(Boolean)
}

/**
 * Lista os wikilinks de um corpo Markdown (sem embeds).
 *
 * @param {string} body
 * @returns {string[]} alvos como escritos
 */
export function extractBodyLinks(body) {
  const targets = []
  for (const match of String(body || '').matchAll(BODY_WIKILINK)) {
    if (match[1] === '!') continue
    targets.push(match[2].trim())
  }
  return targets
}

/**
 * Substitui os wikilinks de um corpo usando uma função.
 *
 * @param {string} body
 * @param {(target: string, label: string|undefined, embed: boolean) => string} replacer
 * @returns {string}
 */
export function replaceBodyLinks(body, replacer) {
  return String(body || '').replace(BODY_WIKILINK, (_, bang, target, label) =>
    replacer(target.trim(), label?.trim() || undefined, bang === '!')
  )
}
