import { clearCommand } from './system/clear.js'
import { whoamiCommand } from './system/whoami.js'
import { echoCommand } from './system/echo.js'
import { dateCommand } from './system/date.js'
import { helpCommand } from './system/help.js'
import { headerCommand } from './system/header.js'
import { pwdCommand } from './fs/pwd.js'
import { cdCommand } from './fs/cd.js'
import { lsCommand } from './fs/ls.js'
import { catCommand } from './fs/cat.js'
import { treeCommand } from './fs/tree.js'
import { findCommand } from './fs/find.js'
import { grepCommand } from './fs/grep.js'
import {
  aboutCommand,
  skillsCommand,
  certificationsCommand,
  researchesCommand,
  contactCommand
} from './portfolio/fileCommands.js'
import { projectsCommand } from './portfolio/projects.js'
import { resumeCommand } from './portfolio/resume.js'
import { linksCommand } from './portfolio/links.js'
import { cowsayCommand } from './easter/cowsay.js'
import { sudoCommand } from './easter/sudo.js'
import { neofetchCommand } from './easter/neofetch.js'
import { matrixCommand } from './easter/matrix.js'
import { rmCommand } from './easter/rm.js'
import { themeCommand } from './settings/theme.js'
import { langCommand } from './settings/lang.js'

/**
 * Contrato de um comando:
 *   name        - nome primário; descrição e uso ficam em terminal.commands.<name>.{description,usage}
 *   aliases?    - outros nomes
 *   valueFlags? - flags que recebem valor no token seguinte (--stack vue, -L 2)
 *   complete?   - (word, context) => string[]: o que o Tab sugere nos argumentos (padrão: caminhos do VFS)
 *   execute     - (args, flags, context) => { type, payload } | null; erros esperados saem como CommandError.
 *                 Um processo em primeiro plano (matrix, glitch) é um `await context.spawn(nome)` dentro do execute
 */
const COMMANDS = [
  // Sistema
  clearCommand,
  whoamiCommand,
  echoCommand,
  dateCommand,
  helpCommand,
  headerCommand,
  // Filesystem (VFS)
  pwdCommand,
  cdCommand,
  lsCommand,
  catCommand,
  treeCommand,
  findCommand,
  grepCommand,
  // Portfólio
  aboutCommand,
  skillsCommand,
  projectsCommand,
  certificationsCommand,
  researchesCommand,
  contactCommand,
  resumeCommand,
  linksCommand,
  // Configurações do site (a página do terminal não tem navbar)
  themeCommand,
  langCommand,
  // Easter eggs
  cowsayCommand,
  sudoCommand,
  neofetchCommand,
  matrixCommand,
  rmCommand
]

/**
 * Catálogo de comandos do Vitor Shell (vsh), por nome e por alias (sem diferenciar maiúsculas).
 */
export class CommandRegistry {
  constructor(commands = []) {
    this.commands = new Map()
    this.aliases = new Map()
    commands.forEach((command) => this.register(command))
  }

  /**
   * @param {Object} command - Definição que segue o contrato acima.
   * @returns {CommandRegistry}
   */
  register(command) {
    this.commands.set(command.name.toLowerCase(), command)
    for (const alias of command.aliases ?? []) this.aliases.set(alias.toLowerCase(), command)
    return this
  }

  /**
   * @param {string} nameOrAlias
   * @returns {Object|null}
   */
  get(nameOrAlias) {
    const key = nameOrAlias?.toLowerCase()
    return this.commands.get(key) || this.aliases.get(key) || null
  }

  /** Comandos únicos (sem repetir por alias). */
  getAll() {
    return [...this.commands.values()]
  }

  /** Nomes primários e aliases, para sugestões e autocomplete. */
  getAllNames() {
    return [...this.commands.keys(), ...this.aliases.keys()]
  }
}

/**
 * Catálogo com todos os comandos do terminal.
 *
 * @returns {CommandRegistry}
 */
export const createDefaultRegistry = () => new CommandRegistry(COMMANDS)
