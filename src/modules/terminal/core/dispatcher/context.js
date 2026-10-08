/**
 * Contexto de execução injetado em todo comando (o terceiro parâmetro do execute).
 *
 * @param {Object} options
 * @param {Object} options.vfs - Motor do Virtual File System.
 * @param {Object} options.registry - Catálogo de comandos.
 * @param {(key: string, params?: Object) => string} options.t - Tradutor no idioma ativo.
 * @param {Object} options.globalState - { locale, theme, setTheme, setLocale } (locale e theme são refs).
 * @param {Object} [options.router] - Vue Router, para comandos que saem do terminal.
 * @param {string} [options.user='vitor'] - Usuário do prompt.
 * @param {Function} [options.clear] - Limpa a tela.
 * @returns {Object}
 */
export function createCommandContext({ vfs, registry, t, globalState, router = null, user = 'vitor', clear = () => {} }) {
  return {
    vfs,
    registry,
    t,
    globalState,
    router,
    user,
    clear,
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
