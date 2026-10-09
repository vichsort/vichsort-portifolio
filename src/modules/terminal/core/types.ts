import type { Ref } from 'vue'
import type { Router } from 'vue-router'
import type { VfsEngine } from './vfs/engine.ts'
import type { CommandRegistry } from './commands/registry.ts'

/**
 * Tipos do núcleo do Vitor Shell (vsh): o contrato de comando, o contexto
 * que todo comando recebe e o formato das saídas.
 */

/** Tradutor no idioma ativo. Um número no lugar dos parâmetros escolhe o plural. */
export type Translate = (key: string, params?: Record<string, unknown> | number) => string

/** O que um comando devolve para a tela. O `type` escolhe o componente de saída (ver TerminalHistory). */
export interface CommandOutput {
  type: 'text' | 'error' | 'markdown' | 'banner' | 'neofetch'
  payload: unknown
  /** Nome do arquivo mostrado no cabeçalho (saídas markdown do cat). */
  filename?: string
  /** Saídas markdown: o HTML, preenchido pelo useTerminal depois do comando. */
  html?: string
}

/** Flags já interpretadas: `-la` vira { l: true, a: true }; `--stack vue` vira { stack: 'vue' }. */
export type Flags = Record<string, string | true>

export interface GlobalState {
  locale: Ref<string>
  theme: Ref<string>
  motionAllowed: Readonly<Ref<boolean>>
  setTheme: (value: string) => void
  setLocale: (value: string) => void
}

export interface ShellHistory {
  list: () => string[]
  clear: () => void
}

/** Processo em primeiro plano (matrix, glitch): resolve quando acaba ou leva Ctrl+C. */
export type Spawn = (name: string, options?: { duration?: number }) => Promise<{ interrupted: boolean }>

export interface CommandContext {
  vfs: VfsEngine
  registry: CommandRegistry
  t: Translate
  globalState: GlobalState
  router: Router | null
  user: string
  host: string
  clear: () => void
  spawn: Spawn
  restart: () => void
  shellHistory: ShellHistory
  /** Idioma ativo, lido na hora (um `lang en && about` já sai em inglês). */
  readonly locale: string
  /** Saída do comando anterior num pipe (texto), ou null fora de um pipe. */
  stdin: string | null
  /** true quando a saída vai para outro comando (não é o último do pipe). */
  isPiped: boolean
}

/**
 * Contrato de um comando:
 * - name: nome primário; descrição e uso ficam em terminal.commands.<name>.{description,usage}
 * - aliases: outros nomes
 * - valueFlags: flags que recebem valor no token seguinte (--stack vue, -L 2)
 * - complete: o que o Tab sugere nos argumentos (padrão: caminhos do VFS)
 * - execute: a saída, ou null; erros esperados saem como CommandError.
 *   Um processo em primeiro plano (matrix, glitch) é um `await context.spawn(nome)` dentro dele
 */
export interface Command {
  name: string
  aliases?: string[]
  valueFlags?: string[]
  complete?: (word: string, context: CommandContext) => string[]
  execute: (args: string[], flags: Flags, context: CommandContext) => Promise<CommandOutput | null> | CommandOutput | null
}
