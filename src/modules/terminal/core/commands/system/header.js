import { getRandomHeader } from '../../banner/headers.js'

/**
 * Comando 'header' (ou 'banner')
 * Exibe aleatoriamente um dos banners ASCII do portfólio com gradiente de cor.
 */
export const headerCommand = {
  name: 'header',
  aliases: ['banner'],
  descriptionKey: 'terminal.commands.header.description',
  usageKey: 'terminal.commands.header.usage',
  async execute(args, flags, context) {
    const header = getRandomHeader()

    if (!header || !header.content) {
      return {
        type: 'text',
        payload: 'VICHSORT PORTFOLIO'
      }
    }

    return {
      type: 'banner',
      payload: header.content
    }
  }
}

export default headerCommand

