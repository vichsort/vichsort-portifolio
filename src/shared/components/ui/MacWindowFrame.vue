<script setup>
import { ref } from 'vue'

/**
 * Moldura de janela do macOS: barra de título com os três botões e o conteúdo
 * no slot. Só desenha e avisa os cliques; o que cada botão faz fica com quem usa
 * (o README do Sobre recolhe e maximiza; o terminal reinicia, minimiza e expande).
 *
 * Atributos (class, role, aria-*, style) vão para a janela.
 */
defineProps({
  title: { type: String, default: '' },
  // Rótulos acessíveis de cada botão (aria-label e title)
  closeLabel: { type: String, required: true },
  minimizeLabel: { type: String, required: true },
  maximizeLabel: { type: String, required: true },
  // aria-pressed do botão verde, quando ele alterna um estado (ex.: maximizado)
  maximizePressed: { type: Boolean, default: undefined }
})

const emit = defineEmits(['close', 'minimize', 'maximize', 'titlebar-click'])

const maximizeButton = ref(null)

defineExpose({
  focusMaximize: () => maximizeButton.value?.focus()
})
</script>

<template>
  <div class="mac-window">
    <div class="mac-titlebar" @click="emit('titlebar-click')">
      <div class="window-controls">
        <button
          type="button"
          class="control-dot close-dot"
          :aria-label="closeLabel"
          :title="closeLabel"
          @click.stop="emit('close')"
        ></button>
        <button
          type="button"
          class="control-dot minimize-dot"
          :aria-label="minimizeLabel"
          :title="minimizeLabel"
          @click.stop="emit('minimize')"
        ></button>
        <button
          ref="maximizeButton"
          type="button"
          class="control-dot maximize-dot"
          :aria-label="maximizeLabel"
          :title="maximizeLabel"
          :aria-pressed="maximizePressed"
          @click.stop="emit('maximize')"
        ></button>
      </div>

      <div class="window-title">
        <span class="file-name">{{ title }}</span>
      </div>

      <div class="window-actions-spacer" aria-hidden="true"></div>
    </div>

    <slot />
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

.mac-titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  padding: 0.85rem 1.25rem;
  background-color: var(--bg-surface-2);
  border-bottom: 1px solid var(--border-subtle);
  user-select: none;
  transition: border-color var(--transition-base);
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
  border: none;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
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

/* Cores do macOS: exceção aceita no DESIGN.md */
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
</style>
