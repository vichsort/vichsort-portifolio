import { getRandomHeader } from '../../banner/headers.ts'
import type { Command } from '../../types.ts'

/** Um dos banners ASCII do portfólio, sorteado, com gradiente de cor. */
export const headerCommand: Command = {
  name: 'header',
  aliases: ['banner'],
  async execute() {
    const header = getRandomHeader()
    if (!header?.content) return { type: 'text', payload: 'VICHSORT PORTFOLIO' }
    return { type: 'banner', payload: header.content }
  }
}
