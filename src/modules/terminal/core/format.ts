/**
 * Peças das saídas em texto do terminal (fichas de projeto, listas do VFS).
 */

// Linha que abre e fecha os blocos
export const RULE = '='.repeat(80)

/**
 * "Rótulo:" alinhado numa coluna fixa, seguido do valor.
 *
 * @param width - Largura da coluna do rótulo (com os dois-pontos).
 */
export const row = (label: string, value: unknown, width = 14): string => `${`${label}:`.padEnd(width)} ${value}`
