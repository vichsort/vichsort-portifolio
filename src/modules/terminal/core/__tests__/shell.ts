import { ref } from 'vue'
import { CommandRegistry } from '../commands/registry.ts'
import { createCommandContext } from '../dispatcher/context.ts'
import { CommandError, TerminalError } from '../errors/codes.ts'
import { VfsEngine } from '../vfs/engine.ts'
import { VfsMimeType, VfsNodeType, type VfsNode } from '../vfs/types.ts'
import type { Command, CommandContext } from '../types.ts'

/**
 * Shell de exemplo para os testes: poucos comandos que expõem o que recebem,
 * e uma árvore pequena no VFS. Sem os comandos e os textos do site.
 */

const file = (content: string): VfsNode => ({ type: VfsNodeType.FILE, mime: VfsMimeType.TEXT_MARKDOWN, getContent: (locale) => `${content} (${locale})` })
const dir = (children: Record<string, VfsNode>): VfsNode => ({ type: VfsNodeType.DIR, children })

export const tree = (): VfsNode =>
  dir({
    'about.md': file('sobre'),
    projects: dir({
      plante: dir({ 'README.md': file('plante') }),
      'plante-api': dir({}),
      pixel: dir({})
    }),
    'resume.pdf': { type: VfsNodeType.FILE, mime: VfsMimeType.APPLICATION_PDF }
  })

const echo: Command = { name: 'echo', execute: (args, _flags, ctx) => ({ type: 'text', payload: [...args, ctx.stdin ?? ''].join(' ').trim() }) }

/** Devolve o que recebeu, para conferir o parse e o contexto. */
const spy: Command = {
  name: 'spy',
  aliases: ['SP'],
  valueFlags: ['stack'],
  execute: (args, flags, ctx) => ({ type: 'text', payload: JSON.stringify({ args, flags, stdin: ctx.stdin, isPiped: ctx.isPiped }) })
}

const upper: Command = { name: 'upper', execute: (_args, _flags, ctx) => ({ type: 'text', payload: (ctx.stdin ?? '').toUpperCase() }) }
const quiet: Command = { name: 'quiet', execute: () => null }
const missing: Command = {
  name: 'missing',
  execute: () => {
    throw new CommandError(TerminalError.MISSING_ARG, { arg: 'id' })
  }
}
const broken: Command = {
  name: 'broken',
  execute: () => {
    throw new Error('boom')
  }
}
const lang: Command = { name: 'lang', complete: (word) => ['pt', 'en', 'es'].filter((l) => l.startsWith(word)), execute: () => null }

/** Tradutor que mostra a chave e os parâmetros, para os testes lerem a mensagem. */
const t = (key: string, params?: Record<string, unknown> | number) => (params === undefined ? key : `${key} ${JSON.stringify(params)}`)

/** O shell de exemplo, com comandos de verdade a mais (os de arquivo, por exemplo). */
export function shell(extra: Command[] = []): CommandContext {
  return createCommandContext({
    vfs: new VfsEngine(tree()),
    registry: new CommandRegistry([echo, spy, upper, quiet, missing, broken, lang, ...extra]),
    t,
    globalState: { locale: ref('pt'), theme: ref('dark'), motionAllowed: ref(true), setTheme: () => {}, setLocale: () => {} }
  })
}
