/**
 * Resolve tokens CSS em valores utilizáveis pelo canvas.
 *
 * @param {Element} el - elemento de onde as variáveis são lidas (herdam do :root)
 * @param {{ colors?: Record<string, string>, numbers?: Record<string, string> }} tokens
 *   mapas `chave -> --variavel-css`; `numbers` é convertido com parseFloat.
 * @returns {Record<string, string|number>}
 */
export function readPalette(el, { colors = {}, numbers = {} } = {}) {
  const style = getComputedStyle(el)
  const read = name => style.getPropertyValue(name).trim()
  const palette = {}

  for (const [key, name] of Object.entries(colors)) palette[key] = read(name)
  for (const [key, name] of Object.entries(numbers)) palette[key] = parseFloat(read(name)) || 0

  return palette
}
