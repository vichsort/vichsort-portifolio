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
    // Idioma ativo, lido na hora (um `lang en && about` já sai em inglês)
    get locale() {
      return globalState.locale.value
    },
    // Saída do comando anterior num pipe (texto), ou null fora de um pipe.
    // Preenchido pelo dispatchLine a cada comando.
    stdin: null,
    // true quando a saída vai para outro comando (não é o último do pipe)
    isPiped: false
  }
}
