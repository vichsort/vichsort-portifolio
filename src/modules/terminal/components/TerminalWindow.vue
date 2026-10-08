<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import MacWindowFrame from '@/shared/components/ui/MacWindowFrame.vue'
import TerminalScreen from './screen/TerminalScreen.vue'
import MatrixRain from './screen/MatrixRain.vue'
import GlitchOverlay from './screen/GlitchOverlay.vue'
import { useTerminal } from '../composables/useTerminal'

/**
 * O terminal dentro da janela do macOS, ligado à sessão única (useTerminal):
 * a janela da home e a da página /terminal mostram o mesmo terminal.
 *
 * Os botões só são repassados (close, minimize, maximize), com os rótulos de
 * quem usa: o que cada um faz depende de onde a janela está.
 * O view-transition-name liga as duas janelas na troca animada de página.
 *
 * Processos em primeiro plano (session.running) cobrem a tela: a chuva do
 * matrix e o glitch do rm -rf /. Quando acabam, o foco volta para o prompt.
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
const { user, host, input, history, displayPath, isExecuting, running, banner, welcome } = session

const title = computed(() => `${user}@${host}: ${displayPath.value}`)

const screen = ref(null)

// Depois de um processo, o foco volta ao prompt; só quando o comando termina, porque
// até lá o prompt está desabilitado e não aceita foco
let hadProcess = false
watch(running, (current) => {
  if (current) hadProcess = true
})
watch(isExecuting, (executing) => {
  if (executing || !hadProcess) return
  hadProcess = false
  nextTick(() => screen.value?.focus())
})

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
    <div class="screen-stack" :class="{ 'is-glitching': running?.name === 'glitch' }">
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
      <MatrixRain v-if="running?.name === 'matrix'" @exit="session.kill()" />
      <GlitchOverlay v-if="running?.name === 'glitch'" />
    </div>
  </MacWindowFrame>
</template>

<style scoped>
.terminal-window {
  height: 100%;
  view-transition-name: terminal-window;
}

.screen-stack {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
}

.terminal-window-screen {
  flex: 1;
  min-height: 0;
}

/* rm -rf /: a tela treme e as cores se separam (só roda com movimento permitido) */
.screen-stack.is-glitching {
  animation: glitch-shake 0.18s steps(2) infinite;
}

.screen-stack.is-glitching::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 11;
  pointer-events: none;
  mix-blend-mode: screen;
  background:
    linear-gradient(transparent 0 46%, var(--neon-magenta) 46% 48%, transparent 48% 100%),
    linear-gradient(transparent 0 71%, var(--neon-cyan) 71% 72%, transparent 72% 100%);
  opacity: 0.35;
  animation: glitch-bands 0.4s steps(3) infinite;
}

@keyframes glitch-shake {
  0% { transform: translate(0, 0); filter: none; }
  25% { transform: translate(-3px, 1px); filter: hue-rotate(40deg); }
  50% { transform: translate(2px, -2px); filter: invert(0.08); }
  75% { transform: translate(-1px, 2px); filter: hue-rotate(-30deg); }
  100% { transform: translate(0, 0); filter: none; }
}

@keyframes glitch-bands {
  0% { transform: translateY(-30%); }
  50% { transform: translateY(20%); }
  100% { transform: translateY(45%); }
}
</style>
