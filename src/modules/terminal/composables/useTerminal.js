import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useVFS } from './useVFS.js'
import { createDefaultRegistry } from '../core/commands/registry.js'
import { createCommandContext } from '../core/dispatcher/context.js'
import { dispatch } from '../core/dispatcher/dispatcher.js'

/**
 * Composable central da sessão do terminal interativo (VSH).
 * Gerencia histórico reativo, contexto de execução, buffer de comandos e I/O.
 *
 * @param {Object} [options={}]
 * @returns {Object} Estado reativo e métodos de controle do terminal.
 */
export function useTerminal(options = {}) {
  const router = useRouter()
  const { t } = useI18n()

  const { vfs, currentPath, displayPath, getCompletions } = useVFS(options)
  const registry = createDefaultRegistry()

  const user = ref('vitor')
  const host = ref('vichos')
  const input = ref('')
  const isExecuting = ref(false)

  // Histórico de saídas renderizadas na tela
  const history = ref([])

  // Histórico de linhas brutas de comandos (navegação com ↑/↓)
  const commandHistory = ref([])

  // Posição na navegação: null = editando uma linha nova (guardada em draft)
  let historyIndex = null
  let draft = ''

  let wasCleared = false
  let nextEntryId = 0

  const clear = () => {
    history.value = []
    wasCleared = true
  }

  const pushEntry = (command, output = null, isError = false, cwd = displayPath.value) => {
    history.value.push({
      id: nextEntryId++,
      command,
      user: user.value,
      host: host.value,
      cwd,
      output,
      isError
    })
  }

  const resetNavigation = () => {
    historyIndex = null
    draft = ''
  }

  // Montagem do CommandContext injetado nos comandos
  const context = createCommandContext({
    vfs,
    registry,
    router,
    t: (key, params) => t(key, params),
    clear
  })

  /**
   * Submete e executa uma linha de comando no terminal.
   *
   * @param {string} rawCommand - Comando digitado pelo usuário.
   */
  const execute = async (rawCommand) => {
    if (isExecuting.value) return

    const trimmed = typeof rawCommand === 'string' ? rawCommand.trim() : ''
    resetNavigation()

    // Caso linha em branco (apenas pressionou Enter)
    if (!trimmed) {
      pushEntry('')
      input.value = ''
      return
    }

    isExecuting.value = true
    wasCleared = false

    // Grava no histórico de navegação, sem repetir o comando anterior (como o ignoredups do bash)
    if (commandHistory.value.at(-1) !== trimmed) commandHistory.value.push(trimmed)

    // A linha aparece no diretório em que foi digitada, mesmo que o comando seja um cd
    const executionCwd = displayPath.value

    try {
      const output = await dispatch(trimmed, context)

      // Se o comando chamou clear(), não adiciona linha ao histórico
      if (!wasCleared) {
        pushEntry(trimmed, output, output?.type === 'error', executionCwd)
      }
    } catch (err) {
      if (!wasCleared) {
        pushEntry(trimmed, { type: 'error', payload: `vsh: erro interno: ${err.message || err}` }, true, executionCwd)
      }
    } finally {
      input.value = ''
      isExecuting.value = false
    }
  }

  /** ↑: comando anterior. A linha que estava sendo digitada fica guardada para o ↓. */
  const historyPrev = () => {
    const list = commandHistory.value
    if (!list.length) return
    if (historyIndex === null) {
      draft = input.value
      historyIndex = list.length - 1
    } else if (historyIndex > 0) {
      historyIndex--
    }
    input.value = list[historyIndex]
  }

  /** ↓: comando seguinte; depois do último, volta para a linha que estava sendo digitada. */
  const historyNext = () => {
    if (historyIndex === null) return
    const list = commandHistory.value
    if (historyIndex < list.length - 1) {
      historyIndex++
      input.value = list[historyIndex]
    } else {
      input.value = draft
      resetNavigation()
    }
  }

  /**
   * Tab: completa a última palavra da linha. A primeira palavra completa
   * nomes de comando; as demais, caminhos do VFS.
   * Um candidato: completa. Vários: avança até o prefixo comum; se não houver
   * o que avançar, lista os candidatos abaixo da linha, como o bash.
   */
  const complete = () => {
    const line = input.value
    const start = line.lastIndexOf(' ') + 1
    const word = line.slice(start)
    const isCommand = line.slice(0, start).trim() === ''

    const candidates = isCommand
      ? registry.getAllNames().filter((name) => name.startsWith(word)).sort()
      : getCompletions(word)

    if (!candidates.length) return

    if (candidates.length === 1) {
      const [match] = candidates
      // Diretório continua aberto para o próximo nível; o resto ganha um espaço
      input.value = line.slice(0, start) + match + (match.endsWith('/') ? '' : ' ')
      return
    }

    const prefix = commonPrefix(candidates)
    if (prefix.length > word.length) {
      input.value = line.slice(0, start) + prefix
      return
    }

    // Só o último segmento de cada caminho, como o bash mostra
    const names = candidates.map((c) => c.replace(/\/$/, '').split('/').pop() + (c.endsWith('/') ? '/' : ''))
    pushEntry(line, { type: 'text', payload: names.join('  ') })
  }

  /** Ctrl+C: abandona a linha atual, que fica na tela com ^C. */
  const interrupt = () => {
    pushEntry(`${input.value}^C`)
    input.value = ''
    resetNavigation()
  }

  return {
    user,
    host,
    input,
    history,
    commandHistory,
    isExecuting,
    currentPath,
    displayPath,
    execute,
    clear,
    historyPrev,
    historyNext,
    complete,
    interrupt,
    vfs,
    registry,
    getCompletions
  }
}

export default useTerminal

function commonPrefix(words) {
  let prefix = words[0]
  for (const word of words) {
    while (!word.startsWith(prefix)) prefix = prefix.slice(0, -1)
  }
  return prefix
}
