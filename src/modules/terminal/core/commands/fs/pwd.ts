import type { Command } from '../../types.ts'

export const pwdCommand: Command = {
  name: 'pwd',
  async execute(args, flags, { vfs }) {
    return { type: 'text', payload: vfs.pwd() }
  }
}
