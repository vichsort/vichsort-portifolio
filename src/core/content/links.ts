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
 * Alvo de um valor de ligação do frontmatter, como escrito (sem colchetes), ou null se vazio.
 */
export function parseLink(value: unknown): string | null {
  let v = value
  while (Array.isArray(v) && v.length === 1) v = v[0]
  if (typeof v !== 'string') return null

  const text = v.trim()
  if (!text) return null

  const match = text.match(WIKILINK)
  return (match ? match[1] : text).trim()
}

/**
 * Alvos de um campo de ligação múltipla; aceita valor único e ignora os vazios.
 */
export function parseLinkList(value: unknown): string[] {
  if (value === undefined || value === null || value === '') return []
  const list: unknown[] = Array.isArray(value) ? value : [value]
  return list.map(parseLink).filter((target): target is string => Boolean(target))
}

/**
 * Alvos dos wikilinks de um corpo Markdown, como escritos, sem os embeds.
 */
export function extractBodyLinks(body: string): string[] {
  const targets: string[] = []
  for (const match of String(body || '').matchAll(BODY_WIKILINK)) {
    if (match[1] === '!') continue
    targets.push(match[2].trim())
  }
  return targets
}

/**
 * Troca cada wikilink do corpo pelo que o replacer devolver (embeds inclusive).
 */
export function replaceBodyLinks(
  body: string,
  replacer: (target: string, label: string | undefined, embed: boolean) => string
): string {
  return String(body || '').replace(BODY_WIKILINK, (_, bang: string, target: string, label: string | undefined) =>
    replacer(target.trim(), label?.trim() || undefined, bang === '!')
  )
}
