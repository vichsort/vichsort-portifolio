import { TerminalError, CommandError } from '../../errors/codes.ts'
import type { Command } from '../../types.ts'

const GLITCH_MS = 2200

const isRoot = (path: string) => path === '/' || path === '/*'

/**
 * Comando 'rm'
 * O VFS é só leitura: qualquer remoção falha. A exceção é o clássico
 * `rm -rf /`, que "quebra" a janela por uns segundos e reinicia a sessão
 * (com movimento reduzido, reinicia direto, sem a animação).
 */
export const rmCommand: Command = {
  name: 'rm',
  async execute(args, flags, { spawn, restart, t, globalState }) {
    if (!args.length) throw new CommandError(TerminalError.MISSING_ARG, { arg: 'file' })

    const recursive = flags.r || flags.R || flags.recursive
    const force = flags.f || flags.force

    if (recursive && force && args.some(isRoot)) {
      if (globalState.motionAllowed?.value) await spawn('glitch', { duration: GLITCH_MS })
      restart()
      return { type: 'text', payload: t('terminal.output.rm.restored') }
    }

    throw new CommandError(TerminalError.READ_ONLY, { path: args[0] })
  }
}
