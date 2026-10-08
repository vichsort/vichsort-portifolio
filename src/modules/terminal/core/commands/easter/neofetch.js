import { version } from 'vue'
import logo from '@/modules/terminal/ascii/neofetch.txt?raw'
import { content } from '@/core/content/index.js'
import { techUsage } from '@/modules/graph/core/graphData.js'

// Hora em que o site abriu: o "uptime" da máquina
const bootedAt = Date.now()

/**
 * Linhas de informação do neofetch, com dados reais do site e do grafo.
 * Sem domínio (o Host do original): a resolução da janela no lugar.
 *
 * @returns {[string, string][]}
 */
function systemInfo({ t, locale, globalState }) {
  const o = (key, params) => t(`terminal.output.neofetch.${key}`, params)
  const usage = techUsage(content)
  const top = [...usage]
    .sort((a, b) => b.projects.length - a.projects.length)
    .slice(0, 3)
    .map((tech) => content.label(tech.id, locale))
  const minutes = Math.max(1, Math.round((Date.now() - bootedAt) / 60000))

  return [
    ['OS', 'VichOS x86_64'],
    ['Resolution', typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '-'],
    ['Kernel', `vue ${version}`],
    ['Uptime', o('uptime', minutes)],
    ['Packages', o('packages', usage.length)],
    ['Shell', 'vsh'],
    ['Theme', globalState.theme.value],
    ['Locale', locale],
    ['Projects', String(content.ofType('project').length)],
    ['Stack', top.join(', ')]
  ]
}

/**
 * Comando 'neofetch'
 * Informações do "sistema" ao lado do logo em ASCII, como o original.
 * Num pipe sai como texto puro, uma linha "Chave: valor" por informação.
 */
export const neofetchCommand = {
  name: 'neofetch',
  aliases: ['fastfetch'],
  async execute(args, flags, context) {
    const rows = systemInfo(context)
    const title = `${context.user}@${context.host}`

    if (context.isPiped) {
      return { type: 'text', payload: [title, ...rows.map(([key, value]) => `${key}: ${value}`)].join('\n') }
    }
    return { type: 'neofetch', payload: { logo: logo.trimEnd(), title, rows } }
  }
}
