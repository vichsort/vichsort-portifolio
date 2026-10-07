<script setup>
import { nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { onKeyStroke, useScrollLock } from '@vueuse/core'

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
const maximizeButton = ref(null)
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
  maximizeButton.value?.focus()
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
        <div
          class="mac-window surface-card"
          :class="{ 'is-collapsed': isCollapsed, 'is-maximized': isMaximized }"
          :role="isMaximized ? 'dialog' : undefined"
          :aria-modal="isMaximized ? 'true' : undefined"
          :aria-label="isMaximized ? title : undefined"
        >
          <div class="mac-titlebar" @click="isCollapsed && expand()">
            <div class="window-controls">
              <button
                type="button"
                class="control-dot close-dot"
                :aria-label="isCollapsed ? t('about_page.window.expand') : t('about_page.window.collapse')"
                :title="isCollapsed ? t('about_page.window.expand') : t('about_page.window.collapse')"
                @click.stop="toggleCollapse"
              ></button>
              <button
                type="button"
                class="control-dot minimize-dot"
                :aria-label="isCollapsed ? t('about_page.window.expand') : t('about_page.window.collapse')"
                :title="isCollapsed ? t('about_page.window.expand') : t('about_page.window.collapse')"
                @click.stop="toggleCollapse"
              ></button>
              <button
                ref="maximizeButton"
                type="button"
                class="control-dot maximize-dot"
                :aria-label="isMaximized ? t('about_page.window.restore') : t('about_page.window.maximize')"
                :title="isMaximized ? t('about_page.window.restore') : t('about_page.window.maximize')"
                :aria-pressed="isMaximized"
                @click.stop="toggleMaximize"
              ></button>
            </div>

            <div class="window-title">
              <span class="file-name">{{ title }}</span>
            </div>

            <div class="window-actions-spacer" aria-hidden="true"></div>
          </div>

          <!-- grid 1fr -> 0fr anima a altura do conteúdo sem precisar medi-lo -->
          <div class="mac-body" :inert="isCollapsed || undefined">
            <div class="mac-content">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.mac-window {
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-subtle);
  background-color: var(--bg-surface-1);
  width: 100%;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

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

.mac-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  background-color: var(--bg-surface-2);
  border-bottom: 1px solid var(--border-subtle);
  user-select: none;
  transition: border-color var(--transition-base);
}

.is-collapsed .mac-titlebar {
  border-bottom-color: transparent;
  cursor: pointer;
}

.window-controls {
  display: flex;
  align-items: center;
  gap: 7px;
  width: 54px;
}

.control-dot {
  width: 11px;
  height: 11px;
  padding: 0;
  border-radius: 50%;
  display: inline-block;
  transition: transform var(--transition-fast), filter var(--transition-fast);
}

.control-dot:hover {
  transform: scale(1.2);
  filter: brightness(1.1);
}

.control-dot:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.close-dot {
  background-color: #ff5f56;
  box-shadow: 0 0 4px rgba(255, 95, 86, 0.4);
}

.minimize-dot {
  background-color: #ffbd2e;
  box-shadow: 0 0 4px rgba(255, 189, 46, 0.4);
}

.maximize-dot {
  background-color: #27c93f;
  box-shadow: 0 0 4px rgba(39, 201, 63, 0.4);
}

.window-title {
  font-family: var(--font-heading);
  font-size: var(--text-xs);
  color: var(--text-muted);
  letter-spacing: 0.5px;
  text-align: center;
  flex: 1;
}

.file-name {
  color: var(--text-secondary);
}

.window-actions-spacer {
  width: 54px;
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
