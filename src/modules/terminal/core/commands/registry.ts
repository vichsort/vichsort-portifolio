import { clearCommand } from './system/clear.ts'
import { whoamiCommand } from './system/whoami.ts'
import { echoCommand } from './system/echo.ts'
import { dateCommand } from './system/date.ts'
import { helpCommand } from './system/help.ts'
import { headerCommand } from './system/header.ts'
import { historyCommand } from './system/history.ts'
import { exitCommand, guiCommand } from './system/exit.ts'
import { pwdCommand } from './fs/pwd.ts'
import { cdCommand } from './fs/cd.ts'
import { lsCommand } from './fs/ls.ts'
import { catCommand } from './fs/cat.ts'
import { treeCommand } from './fs/tree.ts'
import { findCommand } from './fs/find.ts'
import { grepCommand } from './fs/grep.ts'
import {
  aboutCommand,
  skillsCommand,
  certificationsCommand,
  researchesCommand,
  contactCommand
} from './portfolio/fileCommands.ts'
import { projectsCommand } from './portfolio/projects.ts'
import { resumeCommand } from './portfolio/resume.ts'
import { linksCommand } from './portfolio/links.ts'
import { cowsayCommand } from './easter/cowsay.ts'
import { sudoCommand } from './easter/sudo.ts'
import { neofetchCommand } from './easter/neofetch.ts'
import { matrixCommand } from './easter/matrix.ts'
import { rmCommand } from './easter/rm.ts'
import { themeCommand } from './settings/theme.ts'
import { langCommand } from './settings/lang.ts'
import type { Command } from '../types.ts'

// Contrato de um comando: ver Command em ../types.ts
const COMMANDS: Command[] = [
  // Sistema
  clearCommand,
  whoamiCommand,
  echoCommand,
  dateCommand,
  helpCommand,
  headerCommand,
  historyCommand,
  exitCommand,
  guiCommand,
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

/** Catálogo com todos os comandos do terminal. */
export const createDefaultRegistry = (): CommandRegistry => new CommandRegistry(COMMANDS)
