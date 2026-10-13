import type { Command } from '../../types.ts'

/** Silencioso quando dá certo, como no bash. */
export const cdCommand: Command = {
  name: 'cd',
  aliases: ['chdir'],
  async execute(args, flags, { vfs }) {
    vfs.cd(args[0] || '~')
    return null
  }
}
