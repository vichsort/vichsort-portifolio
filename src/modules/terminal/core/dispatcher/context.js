/**
 * Fábrica de Contexto de Execução de Comandos (CommandContext)
 * 
 * Injeta dependências desacopladas nos comandos em execução,
 * seguindo o Dependency Inversion Principle (DIP).
 */

/**
 * Cria uma instância de CommandContext com os serviços necessários.
 *
 * @param {Object} options
 * @param {Object} options.vfs - Motor do Virtual File System.
 * @param {Object} [options.globalState] - Estado global { theme, locale, setTheme, setLocale }.
 * @param {Object} [options.router] - Roteador Vue Router.
 * @param {Object} [options.i18n] - Instância de internacionalização.
 * @param {Function} [options.t] - Função de tradução direta t(key, params).
 * @param {Object} [options.registry] - Catálogo de comandos registrados.
 * @param {Function} [options.clear] - Callback para limpar a tela do terminal.
 * @returns {Object} Instância de contexto para execução do comando.
 */
export function createCommandContext(options = {}) {
  const {
    vfs = null,
    globalState = {},
    router = null,
    i18n = null,
    t = null,
    registry = null,
    clear = () => {}
  } = options

  // Resolver função t delegada caso t não venha explícito mas i18n sim
  const resolveT = (key, params) => {
    if (typeof t === 'function') {
      return t(key, params)
    }
    if (i18n && i18n.global && typeof i18n.global.t === 'function') {
      return i18n.global.t(key, params)
    }
    return key
  }

  return {
    vfs,
    globalState,
    router,
    i18n,
    t: resolveT,
    registry,
    clear
  }
}

export default {
  createCommandContext
}

