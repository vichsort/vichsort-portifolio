import clearCommand from './system/clear.js'
import whoamiCommand from './system/whoami.js'
import echoCommand from './system/echo.js'
import dateCommand from './system/date.js'
import helpCommand from './system/help.js'
import pwdCommand from './fs/pwd.js'
import cdCommand from './fs/cd.js'
import lsCommand from './fs/ls.js'

/**
 * Catálogo de registro de comandos do Vitor Shell (vsh).
 * Segue o Open/Closed Principle (OCP), permitindo o registro dinâmico de novos comandos.
 */
export class CommandRegistry {
  constructor() {
    this.commands = new Map()
    this.aliases = new Map()
  }

  /**
   * Registra um novo comando no catálogo.
   *
   * @param {Object} command - Definição do comando que satisfaz o commandContract.
   * @returns {CommandRegistry} A própria instância para encadeamento.
   */
  register(command) {
    if (!command || !command.name) {
      throw new Error('Comando inválido: objeto deve conter uma propriedade "name".')
    }

    const name = command.name.toLowerCase()
    this.commands.set(name, command)

    if (Array.isArray(command.aliases)) {
      for (const alias of command.aliases) {
        this.aliases.set(alias.toLowerCase(), command)
      }
    }

    return this
  }

  /**
   * Obtém um comando a partir do nome ou alias.
   *
   * @param {string} nameOrAlias - Nome ou alias do comando.
   * @returns {Object|null}
   */
  get(nameOrAlias) {
    if (!nameOrAlias || typeof nameOrAlias !== 'string') return null
    const key = nameOrAlias.toLowerCase()
    return this.commands.get(key) || this.aliases.get(key) || null
  }

  /**
   * Verifica se o comando ou alias está registrado.
   *
   * @param {string} nameOrAlias
   * @returns {boolean}
   */
  has(nameOrAlias) {
    if (!nameOrAlias || typeof nameOrAlias !== 'string') return false
    const key = nameOrAlias.toLowerCase()
    return this.commands.has(key) || this.aliases.has(key)
  }

  /**
   * Retorna a lista de comandos únicos registrados (sem duplicar por aliases).
   *
   * @returns {Object[]}
   */
  getAll() {
    return Array.from(this.commands.values())
  }

  /**
   * Retorna todos os nomes primários e aliases registrados.
   *
   * @returns {string[]}
   */
  getAllNames() {
    const names = Array.from(this.commands.keys())
    const aliasKeys = Array.from(this.aliases.keys())
    return Array.from(new Set([...names, ...aliasKeys]))
  }
}

/**
 * Cria e inicializa o registro padrão de comandos do Nódulo 1.
 *
 * @returns {CommandRegistry}
 */
export function createDefaultRegistry() {
  const registry = new CommandRegistry()

  // Comandos de Sistema
  registry.register(clearCommand)
  registry.register(whoamiCommand)
  registry.register(echoCommand)
  registry.register(dateCommand)
  registry.register(helpCommand)

  // Comandos de Filesystem (VFS)
  registry.register(pwdCommand)
  registry.register(cdCommand)
  registry.register(lsCommand)

  return registry
}

export default {
  CommandRegistry,
  createDefaultRegistry
}

