import type { CommandContext } from '../types.ts'

type ContextOptions = Pick<CommandContext, 'vfs' | 'registry' | 't' | 'globalState'> &
  Partial<Pick<CommandContext, 'router' | 'user' | 'host' | 'clear' | 'spawn' | 'restart' | 'shellHistory'>>

/**
 * Contexto de execução injetado em todo comando (o terceiro parâmetro do execute).
 * Os campos estão descritos em CommandContext (../types.ts); os opcionais têm padrão:
 * sem router, usuário vitor@vichos, e clear/spawn/restart/shellHistory que não fazem nada.
 */
export function createCommandContext({
  vfs,
  registry,
  t,
  globalState,
  router = null,
  user = 'vitor',
  host = 'vichos',
  clear = () => {},
  spawn = async () => ({ interrupted: false }),
  restart = () => {},
  shellHistory = { list: () => [], clear: () => {} }
}: ContextOptions): CommandContext {
  return {
    vfs,
    registry,
    t,
    globalState,
    router,
    user,
    host,
    clear,
    spawn,
    restart,
    shellHistory,
    get locale() {
      return globalState.locale.value
    },
    // stdin e isPiped: preenchidos pelo dispatchLine a cada comando
    stdin: null,
    isPiped: false
  }
}
