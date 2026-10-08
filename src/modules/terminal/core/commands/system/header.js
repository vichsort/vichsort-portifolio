import { getRandomHeader } from '../../banner/headers.js'

/**
 * Comando 'header' (ou 'banner')
 * Exibe aleatoriamente um dos banners ASCII do portfólio com gradiente de cor.
 */
export const headerCommand = {
  name: 'header',
  aliases: ['banner'],
  async execute() {
    const header = getRandomHeader()
    if (!header?.content) return { type: 'text', payload: 'VICHSORT PORTFOLIO' }
    return { type: 'banner', payload: header.content }
  }
}
