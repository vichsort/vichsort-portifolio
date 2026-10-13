/**
 * Título de página que cabe no celular (n19). A fonte dos títulos é monoespaçada
 * (1em por caractere), então a palavra mais longa diz o tamanho máximo: a diretiva
 * grava --title-chars no elemento, e o .page-title (core/styles/utilities.css) faz a conta.
 * "Investigaciones" encolhe no celular; "Sobre" fica no tamanho de sempre.
 *
 * Uso: <h1 v-fit-title class="page-title">...</h1>
 */
const longestWord = (text) => Math.max(1, ...text.trim().split(/\s+/).map((word) => word.length))

const fit = (el) => el.style.setProperty('--title-chars', String(longestWord(el.textContent || '')))

// updated: a troca de idioma muda o texto
export const vFitTitle = { mounted: fit, updated: fit }
