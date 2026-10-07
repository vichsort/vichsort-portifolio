<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { onKeyStroke, useScrollLock } from '@vueuse/core'
import MacWindowFrame from '@/shared/components/ui/MacWindowFrame.vue'

defineProps({
  title: {
    type: String,
    default: 'profile.md'
  }
})

const { t } = useI18n()

const isCollapsed = ref(false)
const isMaximized = ref(false)

const slotRef = ref(null)
const frame = ref(null)
const slotHeight = ref(null)

const isScrollLocked = useScrollLock(typeof document !== 'undefined' ? document.body : null)

// Vermelho e amarelo fazem o mesmo: recolhem a janela até a barra de título
const toggleCollapse = () => {
  if (isMaximized.value) isMaximized.value = false
  isCollapsed.value = !isCollapsed.value
}

const expand = () => {
  isCollapsed.value = false
}

const collapseLabel = computed(() =>
  isCollapsed.value ? t('about_page.window.expand') : t('about_page.window.collapse')
)

const toggleMaximize = () => {
  if (!isMaximized.value) {
    // Reserva a altura atual para a seção não "pular" enquanto a janela está no overlay
    slotHeight.value = `${slotRef.value?.offsetHeight ?? 0}px`
    isCollapsed.value = false
  }
  isMaximized.value = !isMaximized.value
}

watch(isMaximized, async (maximized) => {
  isScrollLocked.value = maximized
  if (!maximized) slotHeight.value = null
  // O Teleport move o nó no DOM e o foco se perde; devolve ao botão de tela cheia
  await nextTick()
  frame.value?.focusMaximize()
})

onKeyStroke('Escape', (e) => {
  if (!isMaximized.value) return
  e.preventDefault()
  isMaximized.value = false
})
</script>

<template>
  <div ref="slotRef" class="mac-window-slot" :style="{ height: slotHeight }">
    <Teleport to="body" :disabled="!isMaximized">
      <div
        :class="{ 'mac-overlay': isMaximized }"
        @click.self="isMaximized && toggleMaximize()"
      >
        <MacWindowFrame
          ref="frame"
          class="surface-card"
          :class="{ 'is-collapsed': isCollapsed, 'is-maximized': isMaximized }"
          :role="isMaximized ? 'dialog' : undefined"
          :aria-modal="isMaximized ? 'true' : undefined"
          :aria-label="isMaximized ? title : undefined"
          :title="title"
          :close-label="collapseLabel"
          :minimize-label="collapseLabel"
          :maximize-label="isMaximized ? t('about_page.window.restore') : t('about_page.window.maximize')"
          :maximize-pressed="isMaximized"
          @close="toggleCollapse"
          @minimize="toggleCollapse"
          @maximize="toggleMaximize"
          @titlebar-click="isCollapsed && expand()"
        >
          <!-- grid 1fr -> 0fr anima a altura do conteúdo sem precisar medi-lo -->
          <div class="mac-body" :inert="isCollapsed || undefined">
            <div class="mac-content">
              <slot />
            </div>
          </div>
        </MacWindowFrame>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.mac-window:hover {
  border-color: var(--primary-border);
  box-shadow: var(--shadow-card-hover);
}

/* Tela cheia: overlay acima da navbar (z-index 1000) */
.mac-overlay {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4vh 4vw;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  animation: overlay-in 0.25s ease;
}

.mac-window.is-maximized {
  height: 100%;
  max-width: 1100px;
  animation: window-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes overlay-in {
  from { opacity: 0; }
}

@keyframes window-in {
  from { transform: scale(0.96); opacity: 0; }
}

.is-collapsed :deep(.mac-titlebar) {
  border-bottom-color: transparent;
  cursor: pointer;
}

.mac-body {
  display: grid;
  grid-template-rows: 1fr;
  min-height: 0;
  flex: 1;
  transition: grid-template-rows var(--transition-smooth);
}

.is-collapsed .mac-body {
  grid-template-rows: 0fr;
}

.mac-content {
  min-height: 0;
  padding: var(--spacing-xl);
  max-height: 440px;
  overflow-y: auto;
  transition: padding var(--transition-smooth);
}

.is-collapsed .mac-content {
  padding-block: 0;
  overflow: hidden;
}

.is-maximized .mac-content {
  max-height: none;
}

.mac-content::-webkit-scrollbar {
  width: 6px;
}

.mac-content::-webkit-scrollbar-track {
  background: transparent;
}

.mac-content::-webkit-scrollbar-thumb {
  background: var(--border-medium);
  border-radius: var(--radius-full);
}

@media (max-width: 768px) {
  .mac-content {
    padding: var(--spacing-md);
    max-height: 400px;
  }
}
</style>
