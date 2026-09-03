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

  // Histórico de linhas brutas de comandos (para navegação ↑/↓ em e3.1)
  const commandHistory = ref([])

  let wasCleared = false

  const clear = () => {
    history.value = []
    wasCleared = true
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
    const executionCwd = displayPath.value

    // Caso linha em branco (apenas pressionou Enter)
    if (!trimmed) {
      history.value.push({
        id: Date.now(),
        command: '',
        user: user.value,
        host: host.value,
        cwd: executionCwd,
        output: null
      })
      input.value = ''
      return
    }

    isExecuting.value = true
    wasCleared = false

    // Grava no histórico de navegação
    commandHistory.value.push(trimmed)

    try {
      const output = await dispatch(trimmed, context)

      // Se o comando chamou clear(), não adiciona linha ao histórico
      if (!wasCleared) {
        history.value.push({
          id: Date.now(),
          command: trimmed,
          user: user.value,
          host: host.value,
          cwd: executionCwd,
          output,
          isError: output?.type === 'error'
        })
      }
    } catch (err) {
      if (!wasCleared) {
        history.value.push({
          id: Date.now(),
          command: trimmed,
          user: user.value,
          host: host.value,
          cwd: executionCwd,
          output: {
            type: 'error',
            payload: `vsh: erro interno: ${err.message || err}`
          },
          isError: true
        })
      }
    } finally {
      input.value = ''
      isExecuting.value = false
    }
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
    vfs,
    registry,
    getCompletions
  }
}

export default useTerminal

