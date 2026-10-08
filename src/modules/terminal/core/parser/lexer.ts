import type { Flags } from '../types.ts'

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
 * @param input - Linha de comando bruta.
 * @returns Lista de tokens posicionais e flags.
 */
export function tokenize(input: string): string[] {
  if (!input || typeof input !== 'string') {
    return []
  }

  const tokens: string[] = []
  let current = ''
  let inQuote: string | null = null // null | '"' | "'"
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
 * Separa os argumentos de um comando (os tokens depois do nome) em posicionais e flags.
 * Flags longas (--stack=vue, --featured), curtas combinadas (-la) e com valor (-L=2).
 * As flags listadas em valueFlags também aceitam o valor no token seguinte (--stack vue, -L 2).
 * Depois de `--`, tudo é posicional.
 *
 * Exemplo:
 *   parseArgs(['--stack', 'vue', '-la', 'meu app'], ['stack'])
 *   => { args: ['meu app'], flags: { stack: 'vue', l: true, a: true } }
 *
 * @param tokens - Tokens depois do nome do comando.
 * @param valueFlags - ] - Flags que recebem valor (do contrato do comando).
 */
export function parseArgs(tokens: string[], valueFlags: string[] = []): { args: string[]; flags: Flags } {
  const args: string[] = []
  const flags: Flags = {}
  // Valor no token seguinte, se a flag recebe valor e ele não é outra flag
  const nextValue = (name: string, i: number) =>
    valueFlags.includes(name) && i + 1 < tokens.length && !tokens[i + 1].startsWith('-')

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]

    if (token === '--') {
      args.push(...tokens.slice(i + 1))
      break
    }

    // Flag longa: --nome, --nome=valor ou --nome valor
    if (token.startsWith('--') && token.length > 2) {
      const [name, ...value] = token.slice(2).split('=')
      if (value.length) flags[name] = value.join('=')
      else if (nextValue(name, i)) flags[name] = tokens[++i]
      else flags[name] = true
      continue
    }

    // Flag curta: -a, combinadas (-la), com valor (-L=2 ou -L 2)
    if (token.startsWith('-') && token.length > 1) {
      const [letters, ...value] = token.slice(1).split('=')
      for (const letter of letters) flags[letter] = true
      const last = letters.at(-1)
      if (!last) continue
      if (value.length) flags[last] = value.join('=')
      else if (letters.length === 1 && nextValue(last, i)) flags[last] = tokens[++i]
      continue
    }

    args.push(token)
  }

  return { args, flags }
}

/**
 * Divide uma linha em comandos ligados por `&&` e `|`, respeitando aspas e escapes
 * (um `|` entre aspas é texto). Cada comando segue cru, para o dispatch.
 *
 * Exemplo:
 *   splitLine('ls && cat a.md | grep vue')
 *   => { chain: [['ls'], ['cat a.md', 'grep vue']] }
 *
 * @param input - Linha de comando bruta.
 *   chain: pipelines na ordem do `&&`; cada pipeline lista os comandos do `|`.
 *   error: o operador perto do qual falta um comando (ex.: 'ls |').
 */
export function splitLine(input: string): { chain: string[][]; error?: undefined } | { error: string; chain?: undefined } {
  const line = typeof input === 'string' ? input : ''
  const chain: string[][] = [[]]
  let current = ''
  let inQuote: string | null = null
  let isEscaped = false
  let lastOp: string | null = null

  // Fecha o comando atual; devolve false se ele estiver vazio
  const closeCommand = () => {
    const text = current.trim()
    current = ''
    if (!text) return false
    chain[chain.length - 1].push(text)
    return true
  }

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (isEscaped) {
      current += char
      isEscaped = false
      continue
    }

    // Escape e aspas ficam no texto: quem os interpreta é o tokenize
    if (char === '\\' && inQuote !== "'") {
      current += char
      isEscaped = true
      continue
    }

    if (inQuote) {
      if (char === inQuote) inQuote = null
      current += char
      continue
    }

    if (char === '"' || char === "'") {
      inQuote = char
      current += char
      continue
    }

    if (char === '&' && line[i + 1] === '&') {
      if (!closeCommand()) return { error: '&&' }
      chain.push([])
      lastOp = '&&'
      i++
      continue
    }

    if (char === '|') {
      if (!closeCommand()) return { error: '|' }
      lastOp = '|'
      continue
    }

    current += char
  }

  if (!closeCommand()) {
    // Linha vazia é válida; operador sem comando depois, não
    if (lastOp) return { error: lastOp }
    return { chain: [] }
  }

  return { chain }
}
