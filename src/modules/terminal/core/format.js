/**
 * Peças das saídas em texto do terminal (fichas de projeto, listas do VFS).
 */

// Linha que abre e fecha os blocos
export const RULE = '='.repeat(80)

/**
 * "Rótulo:" alinhado numa coluna fixa, seguido do valor.
 *
 * @param {string} label
 * @param {string} value
 * @param {number} [width=14] - Largura da coluna do rótulo (com os dois-pontos).
 * @returns {string}
 */
export const row = (label, value, width = 14) => `${`${label}:`.padEnd(width)} ${value}`
