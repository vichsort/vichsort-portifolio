// Importação de todos os arquivos de header ASCII em lote via Vite com query ?raw
const headerModules =
  typeof import.meta.glob === 'function'
    ? import.meta.glob('@/modules/terminal/ascii/header/*.txt', {
        query: '?raw',
        import: 'default',
        eager: true
      })
    : {}

/**
 * Lista com os conteúdos em texto puro de todos os headers carregados.
 */
export const HEADERS = Object.entries(headerModules).map(([path, content]) => {
  const filename = path.split('/').pop().replace('.txt', '')
  return {
    name: filename,
    path,
    content: (content || '').trimEnd()
  }
})

/**
 * Retorna aleatoriamente um dos headers ASCII disponíveis.
 *
 * @returns {{ name: string, path: string, content: string }|null}
 */
export function getRandomHeader() {
  if (HEADERS.length === 0) return null
  const randomIndex = Math.floor(Math.random() * HEADERS.length)
  return HEADERS[randomIndex]
}

export default {
  HEADERS,
  getRandomHeader
}

