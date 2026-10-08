import { TerminalError, type TerminalErrorCode } from './codes.ts'
import type { Translate } from '../types.ts'

/**
 * Mensagem de erro pronta para a tela: "vsh: <texto traduzido>",
 * com a sugestão de comando parecido quando houver.
 *
 * @param code - Código de erro (de TerminalError).
 * @param params - Parâmetros { cmd, path, arg, suggestion, message, token }.
 * @param t - Tradutor.
 */
export function formatError(code: TerminalErrorCode, params: Record<string, unknown>, t: Translate): string {
  const message = `vsh: ${t(`terminal.errors.${code}`, params)}`

  if (code === TerminalError.COMMAND_NOT_FOUND && params.suggestion) {
    return `${message}\n${t('terminal.errors.did_you_mean', params)}`
  }
  return message
}
