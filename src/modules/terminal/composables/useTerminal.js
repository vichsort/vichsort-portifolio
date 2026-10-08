import { ref, computed, watch } from 'vue'
import router from '@/core/router'
import i18n from '@/core/i18n'
import { LANGUAGES } from '@/core/i18n/languages'
import { useSettings } from '@/shared/composables/useSettings'
import { useTheme } from '@/shared/composables/useTheme'
import { useVFS } from './useVFS.js'
import { createDefaultRegistry } from '../core/commands/registry.js'
import { createCommandContext } from '../core/dispatcher/context.js'
import { dispatchLine } from '../core/dispatcher/dispatcher.js'
import { getRandomHeader } from '../core/banner/headers.js'
import { CommandHistory } from '../core/input/history.js'
import { completeLine } from '../core/input/completion.js'

const USER = 'vitor'
const HOST = 'vichos'

// Uma sessão só no site: a janela da home e a página /terminal mostram o mesmo terminal
let session = null

/**
 * Sessão do terminal interativo (VSH): tela, prompt, histórico e execução.
 * Criada na primeira chamada e compartilhada por todas as telas que mostram o terminal.
 *
 * @returns {Object} Estado reativo e métodos de controle do terminal.
 */
export function useTerminal() {
  session ??= createSession()
  return session
}

function createSession() {
  const { t, locale } = i18n.global
  const { setLanguage } = useSettings()
  const { theme } = useTheme()
  const { vfs, displayPath } = useVFS()

  const input = ref('')
  const isExecuting = ref(false)
  // O que está na tela: cada entrada é uma linha digitada e as saídas dela
  const history = ref([])
  const commandHistory = new CommandHistory()

  let wasCleared = false
  let nextEntryId = 0

  // Banner ASCII do topo: sorteado por sessão, para as duas telas mostrarem o mesmo
  const randomBanner = () => getRandomHeader()?.content || ''
  const banner = ref(randomBanner())

  const welcome = computed(() => `${t('terminal.welcome')}\n${t('terminal.help_hint')}`)

  const clear = () => {
    history.value = []
    wasCleared = true
  }

  // Uma linha da tela: o comando digitado (null = só saídas) e as saídas de cada pipeline do &&
  const pushEntry = (command, outputs = [], cwd = displayPath.value) => {
    history.value.push({ id: nextEntryId++, command, user: USER, host: HOST, cwd, outputs })
  }

  // Troca de idioma feita pelo comando lang: ele mesmo responde, sem a linha de aviso
  let localeFromCommand = false

  const context = createCommandContext({
    vfs,
    registry: createDefaultRegistry(),
    router,
    user: USER,
    t: (key, params) => t(key, params),
    clear,
    globalState: {
      locale,
      theme,
      setTheme: (value) => {
        theme.value = value
      },
      setLocale: (value) => {
        if (value === locale.value) return
        localeFromCommand = true
        setLanguage(value)
      }
    }
  })

  // O que já está na tela fica no idioma em que rodou, como num terminal de verdade;
  // trocar o idioma por fora (configurações) deixa uma linha marcando a troca
  watch(locale, (lang) => {
    if (localeFromCommand) {
      localeFromCommand = false
      return
    }
    const label = LANGUAGES.find((l) => l.code === lang)?.label || lang
    pushEntry(null, [{ type: 'text', payload: t('terminal.language_changed', { lang: label }) }])
  })

  /**
   * Submete e executa uma linha de comando no terminal.
   *
   * @param {string} rawCommand - Comando digitado pelo usuário.
   */
  const execute = async (rawCommand) => {
    if (isExecuting.value) return

    const line = rawCommand.trim()
    input.value = ''

    // Enter numa linha vazia só repete o prompt
    if (!line) {
      commandHistory.resetNavigation()
      pushEntry('')
      return
    }

    isExecuting.value = true
    wasCleared = false
    commandHistory.push(line)

    // A linha aparece no diretório em que foi digitada, mesmo que o comando seja um cd
    const cwd = displayPath.value

    let outputs
    try {
      outputs = await dispatchLine(line, context)
    } catch (err) {
      outputs = [{ type: 'error', payload: t('terminal.errors.internal', { message: err.message || String(err) }) }]
    } finally {
      // Se um comando chamou clear(), a linha digitada some junto com a tela;
      // o que veio depois dele (ex.: clear && ls) ainda aparece
      if (!wasCleared) pushEntry(line, outputs, cwd)
      else if (outputs?.length) pushEntry(null, outputs)
      isExecuting.value = false
    }
  }

  /** ↑: comando anterior. A linha que estava sendo digitada fica guardada para o ↓. */
  const historyPrev = () => {
    const line = commandHistory.prev(input.value)
    if (line !== null) input.value = line
  }

  /** ↓: comando seguinte; depois do último, volta para a linha que estava sendo digitada. */
  const historyNext = () => {
    const line = commandHistory.next()
    if (line !== null) input.value = line
  }

  /** Tab: completa a linha ou lista as opções abaixo dela. */
  const complete = () => {
    const result = completeLine(input.value, context)
    if (result?.line !== undefined) input.value = result.line
    else if (result?.options) pushEntry(input.value, [{ type: 'text', payload: result.options.join('  ') }])
  }

  /** Ctrl+C: abandona a linha atual, que fica na tela com ^C. */
  const interrupt = () => {
    pushEntry(`${input.value}^C`)
    input.value = ''
    commandHistory.resetNavigation()
  }

  /**
   * Botão vermelho da janela: encerra a sessão. Tela, histórico de comandos e
   * diretório voltam ao início, com um banner novo.
   */
  const reset = () => {
    history.value = []
    commandHistory.clear()
    input.value = ''
    vfs.cd('~')
    banner.value = randomBanner()
  }

  return {
    user: USER,
    host: HOST,
    input,
    history,
    banner,
    welcome,
    isExecuting,
    displayPath,
    execute,
    clear,
    historyPrev,
    historyNext,
    complete,
    interrupt,
    reset
  }
}
