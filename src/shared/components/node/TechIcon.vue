<script setup>
import { useContent } from '@/core/content/useContent'
import { useTheme } from '@/shared/composables/useTheme'
import NodeMenu from './NodeMenu.vue'

/**
 * Ícone de uma tech dos stacks (home e Sobre): o nome aparece no hover e o
 * clique abre o menu do nó (n4). Ocupa o espaço que o pai der (tamanho e grade
 * ficam com quem usa).
 *
 * variant: 'card' (cartão elevado, home) ou 'tile' (quadrado dentro de um card, Sobre)
 */
const props = defineProps({
  id: { type: String, required: true },
  variant: { type: String, default: 'card' }
})

const { label, icon } = useContent()
const { isDark } = useTheme()
</script>

<template>
  <div class="tech-icon-item" :class="`is-${variant}`">
    <NodeMenu :id="props.id" placement="bottom" class="tech-trigger">
      <div class="icon-wrapper" :class="{ 'surface-card': variant === 'card' }">
        <img
          :src="icon(props.id)"
          :alt="label(props.id)"
          loading="lazy"
          class="tech-icon"
          :class="{ 'inverted-icon': isDark }"
        />
      </div>
    </NodeMenu>

    <span class="tooltip" aria-hidden="true">{{ label(props.id) }}</span>
  </div>
</template>

<style scoped>
.tech-icon-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tech-icon-item :deep(.tech-trigger) {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-md);
}

.icon-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  transition: transform var(--transition-fast), border-color var(--transition-fast),
    background-color var(--transition-fast), box-shadow var(--transition-fast);
}

.is-card .icon-wrapper {
  padding: 12px;
}

.is-tile .icon-wrapper {
  padding: 10px;
  background-color: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
}

.tech-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0.75;
  transition: opacity var(--transition-fast), filter var(--transition-fast);
}

.tech-icon.inverted-icon {
  filter: invert(1);
  opacity: 0.85;
}

/* Hover, ou menu aberto: o ícone sobe e acende */
.tech-icon-item:hover .icon-wrapper,
.tech-icon-item:has([aria-expanded='true']) .icon-wrapper {
  transform: translateY(-4px) scale(1.06);
  border-color: var(--primary-border);
  box-shadow: var(--shadow-card-hover);
}

.is-tile:hover .icon-wrapper,
.is-tile:has([aria-expanded='true']) .icon-wrapper {
  background-color: var(--primary-subtle);
}

.tech-icon-item:hover .tech-icon,
.tech-icon-item:has([aria-expanded='true']) .tech-icon {
  opacity: 1;
}

.tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) translateY(6px);
  background-color: var(--primary);
  color: var(--text-on-primary);
  padding: 3px 9px;
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 700;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all var(--transition-fast);
  pointer-events: none;
  box-shadow: var(--shadow-card);
  z-index: 20;
}

.tooltip::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid var(--primary);
}

.tech-icon-item:hover .tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

/* Com o menu aberto, o nome sai de cima do ícone */
.tech-icon-item:has([aria-expanded='true']) .tooltip {
  opacity: 0;
  visibility: hidden;
}
</style>
