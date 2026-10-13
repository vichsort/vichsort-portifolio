// Chamada direta: o Vite só reescreve import.meta.glob(...) literal, então um
// "typeof import.meta.glob" no navegador dá undefined e esvaziava a lista
const headerModules = import.meta.glob<string>('@/modules/terminal/ascii/header/*.txt', {
  query: '?raw',
  import: 'default',
  eager: true
})

export const HEADERS = Object.entries(headerModules).map(([path, content]) => {
  const filename = (path.split('/').pop() || '').replace('.txt', '')
  return {
    name: filename,
    path,
    content: (content || '').trimEnd()
  }
})

export function getRandomHeader(): { name: string; path: string; content: string } | null {
  if (HEADERS.length === 0) return null
  const randomIndex = Math.floor(Math.random() * HEADERS.length)
  return HEADERS[randomIndex]
}
