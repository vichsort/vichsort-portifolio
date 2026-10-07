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
import { graph } from '@/core/content'

// Uma sessão só no site: a janela da home e a página /terminal mostram o mesmo terminal
let session = null

/**
 * Sessão do terminal interativo (VSH): histórico, diretório, buffer de comandos e I/O.
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

  const { vfs, currentPath, displayPath, getCompletions } = useVFS()
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

  // Banner ASCII do topo: sorteado por sessão, para as duas telas mostrarem o mesmo
  const banner = ref(getRandomHeader()?.content || '')

  const welcome = computed(() => `${t('terminal.welcome')}\n${t('terminal.help_hint')}`)

  const clear = () => {
    history.value = []
    wasCleared = true
  }

  // Uma linha da tela: o comando digitado (null = só saídas) e as saídas de cada pipeline do &&
  const pushEntry = (command, outputs = [], cwd = displayPath.value) => {
    history.value.push({
      id: nextEntryId++,
      command,
      user: user.value,
      host: host.value,
      cwd,
      outputs
    })
  }

  const resetNavigation = () => {
    historyIndex = null
    draft = ''
  }

  // Troca de idioma feita pelo comando lang: ele mesmo responde, sem a linha de aviso
  let localeFromCommand = false

  // Montagem do CommandContext injetado nos comandos
  const context = createCommandContext({
    vfs,
    registry,
    router,
    // Idioma ativo: os comandos e o VFS leem de globalState.locale
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
    },
    t: (key, params) => t(key, params),
    clear
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

    let outputs
    try {
      outputs = await dispatchLine(trimmed, context)
    } catch (err) {
      outputs = [{ type: 'error', payload: t('terminal.errors.internal', { message: err.message || String(err) }) }]
    } finally {
      // Se um comando chamou clear(), a linha digitada some junto com a tela;
      // o que veio depois dele (ex.: clear && ls) ainda aparece
      if (!wasCleared) pushEntry(trimmed, outputs, executionCwd)
      else if (outputs?.length) pushEntry(null, outputs)

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
   * Tab: completa a última palavra da linha. No início da linha ou depois de
   * `|` / `&&`, completa nomes de comando; no argumento do `links`, ids de nós;
   * no resto, caminhos do VFS.
   * Um candidato: completa. Vários: avança até o prefixo comum; se não houver
   * o que avançar, lista os candidatos abaixo da linha, como o bash.
   */
  const complete = () => {
    const line = input.value
    const start = line.lastIndexOf(' ') + 1
    const word = line.slice(start)
    const before = line.slice(0, start)
    const isCommand = /(^|\||&&)\s*$/.test(before)
    const commandName = before.split(/\||&&/).pop().trim().split(/\s+/)[0]

    const startingWith = (list) => list.filter((name) => name.startsWith(word)).sort()
    const candidates = isCommand
      ? startingWith(registry.getAllNames())
      : registry.get(commandName)?.name === 'links'
        ? startingWith([...graph.nodes.keys()])
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
    pushEntry(line, [{ type: 'text', payload: names.join('  ') }])
  }

  /**
   * Botão vermelho da janela: encerra a sessão. Tela, histórico de comandos e
   * diretório voltam ao início, com um banner novo.
   */
  const reset = () => {
    history.value = []
    commandHistory.value = []
    input.value = ''
    resetNavigation()
    vfs.cd('~')
    banner.value = getRandomHeader()?.content || ''
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
    banner,
    welcome,
    reset,
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
