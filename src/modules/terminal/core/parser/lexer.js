/**
 * Analisador Léxico (Lexer & Tokenizer) do Vitor Shell (vsh)
 * 
 * Responsável pela tokenização pura de strings de comando,
 * suporte a aspas simples e duplas, extração de flags
 * nomeadas (--flag=valor, --boolean) e flags curtas combinadas (-la).
 */

/**
 * Divide uma linha de comando em tokens preservando argumentos delimitados por aspas.
 * Suporta aspas duplas ("..."), aspas simples ('...') e escape por barra invertida (\).
 *
 * @param {string} input - Linha de comando bruta.
 * @returns {string[]} Lista de tokens posicionais e flags.
 */
export function tokenize(input) {
  if (!input || typeof input !== 'string') {
    return []
  }

  const tokens = []
  let current = ''
  let inQuote = null // null | '"' | "'"
  let isEscaped = false
  let tokenStarted = false

  for (let i = 0; i < input.length; i++) {
    const char = input[i]

    if (isEscaped) {
      current += char
      isEscaped = false
      tokenStarted = true
      continue
    }

    if (char === '\\' && inQuote !== "'") {
      isEscaped = true
      tokenStarted = true
      continue
    }

    if (inQuote) {
      if (char === inQuote) {
        inQuote = null
      } else {
        current += char
      }
      tokenStarted = true
    } else {
      if (char === '"' || char === "'") {
        inQuote = char
        tokenStarted = true
      } else if (/\s/.test(char)) {
        if (tokenStarted) {
          tokens.push(current)
          current = ''
          tokenStarted = false
        }
      } else {
        current += char
        tokenStarted = true
      }
    }
  }

  if (tokenStarted) {
    tokens.push(current)
  }

  return tokens
}

/**
 * Interpreta uma linha de comando e extrai o nome do comando,
 * argumentos posicionais e mapa de flags.
 *
 * Exemplo:
 *   parseCommand('projects --stack=vue -la "meu app"')
 *   => {
 *        command: 'projects',
 *        args: ['meu app'],
 *        flags: { stack: 'vue', l: true, a: true },
 *        raw: 'projects --stack=vue -la "meu app"'
 *      }
 *
 * @param {string} input - Linha de comando bruta.
 * @returns {{ command: string, args: string[], flags: Record<string, string|boolean>, raw: string }}
 */
export function parseCommand(input) {
  const raw = typeof input === 'string' ? input : ''
  const tokens = tokenize(raw)

  if (tokens.length === 0) {
    return {
      command: '',
      args: [],
      flags: {},
      raw
    }
  }

  const command = tokens[0]
  const args = []
  const flags = {}
  let stopFlags = false

  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i]

    if (stopFlags) {
      args.push(token)
      continue
    }

    if (token === '--') {
      stopFlags = true
      continue
    }

    // Flag longa: --nome ou --nome=valor (ou --stack valor)
    if (token.startsWith('--') && token.length > 2) {
      const flagBody = token.slice(2)
      const eqIdx = flagBody.indexOf('=')

      if (eqIdx !== -1) {
        const key = flagBody.slice(0, eqIdx)
        const val = flagBody.slice(eqIdx + 1)
        flags[key] = val
      } else if (i + 1 < tokens.length && !tokens[i + 1].startsWith('-') && (flagBody === 'stack' || flagBody === 'depth')) {
        flags[flagBody] = tokens[++i]
      } else {
        flags[flagBody] = true
      }
      continue
    }

    // Flag curta: -a ou combinadas como -la ou com valor -s=vue / -L 2
    if (token.startsWith('-') && token.length > 1) {
      const flagBody = token.slice(1)
      const eqIdx = flagBody.indexOf('=')

      if (eqIdx !== -1) {
        const keys = flagBody.slice(0, eqIdx)
        const val = flagBody.slice(eqIdx + 1)
        for (let j = 0; j < keys.length - 1; j++) {
          flags[keys[j]] = true
        }
        if (keys.length > 0) {
          flags[keys[keys.length - 1]] = val
        }
      } else if (flagBody.length === 1 && (flagBody === 'L' || flagBody === 's') && i + 1 < tokens.length && !tokens[i + 1].startsWith('-')) {
        flags[flagBody] = tokens[++i]
      } else {
        for (let j = 0; j < flagBody.length; j++) {
          flags[flagBody[j]] = true
        }
      }
      continue
    }

    // Argumento posicional limpo
    args.push(token)
  }

  return {
    command,
    args,
    flags,
    raw
  }
}

export default {
  tokenize,
  parseCommand
}

