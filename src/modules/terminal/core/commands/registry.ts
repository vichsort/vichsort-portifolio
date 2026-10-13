import type { Command } from '../types.ts'

/**
 * Registro de comandos do Vitor Shell (vsh), por nome e por alias (sem diferenciar maiúsculas).
 * A lista dos comandos do site fica em index.ts: o registro não importa nenhum deles.
 */
export class CommandRegistry {
  commands = new Map<string, Command>()
  aliases = new Map<string, Command>()

  constructor(commands: Command[] = []) {
    commands.forEach((command) => this.register(command))
  }

  register(command: Command): this {
    this.commands.set(command.name.toLowerCase(), command)
    for (const alias of command.aliases ?? []) this.aliases.set(alias.toLowerCase(), command)
    return this
  }

  get(nameOrAlias: string | undefined): Command | null {
    const key = nameOrAlias?.toLowerCase()
    if (!key) return null
    return this.commands.get(key) || this.aliases.get(key) || null
  }

  /** Comandos únicos (sem repetir por alias). */
  getAll(): Command[] {
    return [...this.commands.values()]
  }

  /** Nomes primários e aliases, para sugestões e autocomplete. */
  getAllNames(): string[] {
    return [...this.commands.keys(), ...this.aliases.keys()]
  }
}
