import clearCommand from './system/clear.js'
import whoamiCommand from './system/whoami.js'
import echoCommand from './system/echo.js'
import dateCommand from './system/date.js'
import helpCommand from './system/help.js'
import headerCommand from './system/header.js'
import pwdCommand from './fs/pwd.js'
import cdCommand from './fs/cd.js'
import lsCommand from './fs/ls.js'
import catCommand from './fs/cat.js'
import treeCommand from './fs/tree.js'
import findCommand from './fs/find.js'
import grepCommand from './fs/grep.js'
import aboutCommand from './portfolio/about.js'
import skillsCommand from './portfolio/skills.js'
import projectsCommand from './portfolio/projects.js'
import certificationsCommand from './portfolio/certifications.js'
import researchesCommand from './portfolio/researches.js'
import contactCommand from './portfolio/contact.js'
import resumeCommand from './portfolio/resume.js'

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

    const primaryName = command.name.toLowerCase()
    this.commands.set(primaryName, command)

    if (Array.isArray(command.aliases)) {
      for (const alias of command.aliases) {
        if (alias && typeof alias === 'string') {
          this.aliases.set(alias.toLowerCase(), command)
        }
      }
    }

    return this
  }

  /**
   * Obtém a definição de um comando por nome primário ou alias.
   *
   * @param {string} nameOrAlias
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
 * Cria e inicializa o catálogo padrão com todos os comandos de sistema, VFS e portfólio.
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
  registry.register(headerCommand)

  // Comandos de Filesystem (VFS)
  registry.register(pwdCommand)
  registry.register(cdCommand)
  registry.register(lsCommand)
  registry.register(catCommand)
  registry.register(treeCommand)
  registry.register(findCommand)
  registry.register(grepCommand)

  // Comandos de Portfólio (Domínio)
  registry.register(aboutCommand)
  registry.register(skillsCommand)
  registry.register(projectsCommand)
  registry.register(certificationsCommand)
  registry.register(researchesCommand)
  registry.register(contactCommand)
  registry.register(resumeCommand)

  return registry
}

export default {
  CommandRegistry,
  createDefaultRegistry
}
