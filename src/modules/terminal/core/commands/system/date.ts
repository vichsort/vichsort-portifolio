import type { Command } from '../../types.ts'

export const dateCommand: Command = {
  name: 'date',
  async execute() {
    return { type: 'text', payload: new Date().toString() }
  }
}
