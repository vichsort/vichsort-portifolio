import { TerminalError } from './codes.js'

/**
 * Mensagem de erro pronta para a tela: "vsh: <texto traduzido>",
 * com a sugestão de comando parecido quando houver.
 *
 * @param {string} code - Código de erro (de TerminalError).
 * @param {Record<string, any>} params - Parâmetros { cmd, path, arg, suggestion, message, token }.
 * @param {(key: string, params?: Object) => string} t - Tradutor.
 * @returns {string}
 */
export function formatError(code, params, t) {
  const message = `vsh: ${t(`terminal.errors.${code}`, params)}`

  if (code === TerminalError.COMMAND_NOT_FOUND && params.suggestion) {
    return `${message}\n${t('terminal.errors.did_you_mean', params)}`
  }
  return message
}
