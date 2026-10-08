<script setup>
import { computed, ref } from 'vue'
import MacWindowFrame from '@/shared/components/ui/MacWindowFrame.vue'
import TerminalScreen from './screen/TerminalScreen.vue'
import { useTerminal } from '../composables/useTerminal'

/**
 * O terminal dentro da janela do macOS, ligado à sessão única (useTerminal):
 * a janela da home e a da página /terminal mostram o mesmo terminal.
 *
 * Os botões só são repassados (close, minimize, maximize), com os rótulos de
 * quem usa: o que cada um faz depende de onde a janela está.
 * O view-transition-name liga as duas janelas na troca animada de página.
 */
const props = defineProps({
  closeLabel: { type: String, required: true },
  minimizeLabel: { type: String, required: true },
  maximizeLabel: { type: String, required: true },
  // Foca o prompt ao montar (na home fica desligado, para não rolar a página)
  autofocus: { type: Boolean, default: true }
})

const emit = defineEmits(['close', 'minimize', 'maximize'])

const session = useTerminal()
const { user, host, input, history, displayPath, isExecuting, banner, welcome } = session

const title = computed(() => `${user}@${host}: ${displayPath.value}`)

const screen = ref(null)

defineExpose({ focus: () => screen.value?.focus() })
</script>

<template>
  <MacWindowFrame
    class="terminal-window"
    :title="title"
    :close-label="props.closeLabel"
    :minimize-label="props.minimizeLabel"
    :maximize-label="props.maximizeLabel"
    @close="emit('close')"
    @minimize="emit('minimize')"
    @maximize="emit('maximize')"
  >
    <TerminalScreen
      ref="screen"
      v-model="input"
      class="terminal-window-screen"
      :history="history"
      :cwd="displayPath"
      :user="user"
      :host="host"
      :disabled="isExecuting"
      :banner="banner"
      :welcome-message="welcome"
      :autofocus="props.autofocus"
      @submit="session.execute"
      @history-prev="session.historyPrev"
      @history-next="session.historyNext"
      @complete="session.complete"
      @interrupt="session.interrupt"
      @clear-screen="session.clear"
    />
  </MacWindowFrame>
</template>

<style scoped>
.terminal-window {
  height: 100%;
  view-transition-name: terminal-window;
}

.terminal-window-screen {
  flex: 1;
  min-height: 0;
}
</style>
