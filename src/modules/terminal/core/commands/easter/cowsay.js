import cowTemplate from '@/modules/terminal/ascii/cowsay.txt?raw'

/**
 * Quebra o texto em linhas de comprimento máximo com quebra por palavras.
 *
 * @param {string} text - Texto bruto.
 * @param {number} [maxLen=40] - Comprimento máximo da linha.
 * @returns {string[]}
 */
function wrapText(text, maxLen = 40) {
  const words = text.trim().split(/\s+/)
  const lines = []
  let current = ''

  for (const w of words) {
    if (!current) {
      current = w
    } else if ((current + ' ' + w).length <= maxLen) {
      current += ' ' + w
    } else {
      lines.push(current)
      current = w
    }
  }

  if (current) {
    lines.push(current)
  }

  return lines.length ? lines : ['Moo!']
}

/**
 * Formata o balão de fala dinâmico e anexa o corpo ASCII da vaca vindo do arquivo cowsay.txt.
 *
 * @param {string} message - Mensagem dita pela vaca.
 * @returns {string} Arte ASCII completa com balão formatado.
 */
export function formatCowsay(message) {
  const lines = wrapText(message || 'vsh: exploring Vitor\'s engineering portfolio!')
  const maxLen = Math.max(...lines.map((l) => l.length))
  const topBorder = ' ' + '_'.repeat(maxLen + 2)
  const bottomBorder = ' ' + '-'.repeat(maxLen + 2)

  const bubble = []

  if (lines.length === 1) {
    bubble.push(`< ${lines[0]} >`)
  } else {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].padEnd(maxLen)
      if (i === 0) {
        bubble.push(`/ ${line} \\`)
      } else if (i === lines.length - 1) {
        bubble.push(`\\ ${line} /`)
      } else {
        bubble.push(`| ${line} |`)
      }
    }
  }

  const cowBody = (cowTemplate || '').trimEnd()

  return [topBorder, ...bubble, bottomBorder, cowBody].join('\n')
}

/**
 * Comando 'cowsay'
 * Gera a vaca falante com o template ASCII lido diretamente de cowsay.txt.
 */
export const cowsayCommand = {
  name: 'cowsay',
  aliases: ['cow'],
  async execute(args) {
    return { type: 'text', payload: formatCowsay(args.join(' ')) }
  }
}
