import type { CommandContext } from '../types.ts'

/**
 * Tab: completa a última palavra da linha. No início da linha ou depois de
 * `|` / `&&`, completa nomes de comando; nos argumentos, o que o comando
 * sugerir (complete do contrato) ou, por padrão, caminhos do VFS.
 * Um candidato: completa. Vários: avança até o prefixo comum; se não houver
 * o que avançar, devolve os candidatos para listar abaixo da linha, como o bash.
 *
 * @param line - Linha no prompt.
 * @param context - CommandContext (usa registry e vfs).
 * @returns Linha nova, opções a listar ou nada a fazer.
 */
export function completeLine(line: string, context: CommandContext): { line: string } | { options: string[] } | null {
  const { registry, vfs } = context
  const start = line.lastIndexOf(' ') + 1
  const word = line.slice(start)
  const before = line.slice(0, start)
  const isCommand = /(^|\||&&)\s*$/.test(before)
  const command = registry.get((before.split(/\||&&/).pop() || '').trim().split(/\s+/)[0])

  const candidates = (
    isCommand
      ? registry.getAllNames().filter((name) => name.startsWith(word))
      : command?.complete
        ? command.complete(word, context)
        : vfs.getCompletions(word)
  ).sort()

  if (!candidates.length) return null

  if (candidates.length === 1) {
    const [match] = candidates
    // Diretório continua aberto para o próximo nível; o resto ganha um espaço
    return { line: before + match + (match.endsWith('/') ? '' : ' ') }
  }

  const prefix = commonPrefix(candidates)
  if (prefix.length > word.length) return { line: before + prefix }

  // Só o último segmento de cada caminho, como o bash mostra
  return { options: candidates.map((c) => c.replace(/\/$/, '').split('/').pop() + (c.endsWith('/') ? '/' : '')) }
}

function commonPrefix(words: string[]): string {
  let prefix = words[0]
  for (const word of words) {
    while (!word.startsWith(prefix)) prefix = prefix.slice(0, -1)
  }
  return prefix
}
