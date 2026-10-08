import type { Command } from '../../types.ts'

/**
 * Comandos que só mostram um arquivo do VFS: atalhos para `cat <caminho>`.
 * path: o arquivo exibido.
 */
const fileCommand = (name: string, aliases: string[], path: string): Command => ({
  name,
  aliases,
  async execute(args, flags, { vfs, locale }) {
    const { content } = await vfs.readFile(path, locale)
    return { type: 'text', payload: content }
  }
})

export const aboutCommand = fileCommand('about', ['bio'], '/about/profile.txt')
export const skillsCommand = fileCommand('skills', ['stack', 'techs'], '/about/stack.txt')
export const certificationsCommand = fileCommand('certifications', ['certs'], '/certifications/list.txt')
export const researchesCommand = fileCommand('researches', ['papers', 'awards'], '/researches/list.txt')
export const contactCommand = fileCommand('contact', ['email', 'social'], '/contact.txt')
