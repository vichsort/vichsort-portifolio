import { TerminalError } from './codes.js'

/**
 * Interpola parâmetros {key} em uma string modelo.
 *
 * @param {string} template - String contendo marcadores como {cmd}, {path}, etc.
 * @param {Record<string, any>} values - Valores a interpolar.
 * @returns {string} String com valores substituídos.
 */
function interpolate(template, values) {
  if (!template) return ''
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return values[key] !== undefined ? String(values[key]) : `{${key}}`
  })
}

/**
 * Modelos de fallback caso o tradutor i18n não esteja disponível.
 */
const FALLBACK_TEMPLATES = {
  [TerminalError.COMMAND_NOT_FOUND]: 'comando não encontrado: {cmd}',
  [TerminalError.NO_SUCH_FILE]: '{cmd}: {path}: Arquivo ou diretório inexistente',
  [TerminalError.IS_A_DIRECTORY]: '{cmd}: {path}: É um diretório',
  [TerminalError.NOT_A_DIRECTORY]: '{cmd}: {path}: Não é um diretório',
  [TerminalError.MISSING_ARG]: '{cmd}: argumento obrigatório ausente: {arg}',
  [TerminalError.EXECUTION_FAILED]: '{cmd}: falha na execução: {message}'
}

/**
 * Formata um código de erro em mensagem de saída para o terminal.
 *
 * @param {string} code - Código de erro (de TerminalError).
 * @param {Record<string, any>} params - Parâmetros { cmd, path, arg, suggestion, message }.
 * @param {Function|null} t - Função de tradução ativa (i18n.global.t ou context.t).
 * @returns {string} Mensagem de erro pronta para renderização.
 */
export function formatError(code, params = {}, t = null) {
  const { cmd = '', path = '', arg = '', suggestion = '', message = '' } = params

  let baseMsg = ''
  if (typeof t === 'function') {
    const i18nKey = `terminal.errors.${code}`
    const translated = t(i18nKey, params)
    // vue-i18n retorna a própria chave se não encontrar
    if (translated && translated !== i18nKey) {
      baseMsg = translated
    }
  }

  if (!baseMsg) {
    const tpl = FALLBACK_TEMPLATES[code] || 'erro inesperado: {message}'
    baseMsg = interpolate(tpl, { cmd, path, arg, suggestion, message })
  }

  let formatted = `vsh: ${baseMsg}`

  // Caso seja erro de comando não encontrado e haja sugestão de similaridade
  if (code === TerminalError.COMMAND_NOT_FOUND && suggestion) {
    let hint = ''
    if (typeof t === 'function') {
      const hintKey = 'terminal.errors.did_you_mean'
      const translatedHint = t(hintKey, { suggestion })
      if (translatedHint && translatedHint !== hintKey) {
        hint = translatedHint
      }
    }
    if (!hint) {
      hint = `Você quis dizer: ${suggestion}?`
    }
    formatted += `\n${hint}`
  }

  return formatted
}

export default {
  formatError
}

