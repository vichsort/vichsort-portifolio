import { getRandomHeader } from '../../banner/headers.ts'
import type { Command } from '../../types.ts'

/**
 * Comando 'header' (ou 'banner')
 * Exibe aleatoriamente um dos banners ASCII do portfólio com gradiente de cor.
 */
export const headerCommand: Command = {
  name: 'header',
  aliases: ['banner'],
  async execute() {
    const header = getRandomHeader()
    if (!header?.content) return { type: 'text', payload: 'VICHSORT PORTFOLIO' }
    return { type: 'banner', payload: header.content }
  }
}
