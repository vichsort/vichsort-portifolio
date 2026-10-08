/**
 * Cálculo de distância de Levenshtein entre duas sequências de texto.
 *
 * @param a - Primeira string.
 * @param b - Segunda string.
 * @returns Distância de edição.
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0
  if (!a) return b ? b.length : 0
  if (!b) return a.length

  const s1 = a.toLowerCase()
  const s2 = b.toLowerCase()

  const len1 = s1.length
  const len2 = s2.length

  // Matriz de distâncias
  const matrix: number[][] = Array.from({ length: len1 + 1 }, () => new Array<number>(len2 + 1).fill(0))

  for (let i = 0; i <= len1; i++) matrix[i][0] = i
  for (let j = 0; j <= len2; j++) matrix[0][j] = j

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // Deleção
        matrix[i][j - 1] + 1,      // Inserção
        matrix[i - 1][j - 1] + cost // Substituição
      )
    }
  }

  return matrix[len1][len2]
}

/**
 * Localiza o comando mais similar a partir de uma lista de candidatos válidos.
 *
 * @param input - Comando digitado que falhou.
 * @param candidates - Lista de comandos e aliases registrados.
 * @param maxDistance - Distância máxima de tolerância (padrão: 2).
 * @returns Nome do comando sugerido ou null caso nenhum satisfaça o limite.
 */
export function findClosestCommand(input: string, candidates: Iterable<string> = [], maxDistance = 2): string | null {
  if (!input || typeof input !== 'string') return null

  const cleanInput = input.trim()
  if (!cleanInput) return null

  let closest: string | null = null
  let minDistance = maxDistance + 1

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== 'string') continue

    const dist = levenshteinDistance(cleanInput, candidate)
    if (dist <= maxDistance && dist < minDistance) {
      minDistance = dist
      closest = candidate
    }
  }

  return closest
}
