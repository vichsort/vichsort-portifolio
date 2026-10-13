import type { Command } from '../../types.ts'

export const echoCommand: Command = {
  name: 'echo',
  async execute(args) {
    return { type: 'text', payload: args.join(' ') }
  }
}
