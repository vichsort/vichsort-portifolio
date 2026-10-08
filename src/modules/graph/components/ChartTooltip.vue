<script setup>
/**
 * Tooltip dos gráficos: posicionado em coordenadas do contêiner do gráfico
 * (que precisa ser position: relative). Vira para a esquerda perto da borda direita.
 *
 * O conteúdo vem pelo slot: o valor em destaque primeiro, o rótulo depois.
 */
defineProps({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  flip: { type: Boolean, default: false }
})
</script>

<template>
  <div class="chart-tooltip" :class="{ 'is-flipped': flip }" :style="{ left: `${x}px`, top: `${y}px` }" role="tooltip">
    <slot />
  </div>
</template>

<style scoped>
.chart-tooltip {
  position: absolute;
  z-index: 5;
  transform: translate(12px, -50%);
  min-width: 160px;
  max-width: 280px;
  padding: 0.6rem 0.75rem;
  border-radius: var(--radius-md);
  background: var(--bg-surface-elevated);
  border: 1px solid var(--border-medium);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(12px);
  pointer-events: none;
  font-size: var(--text-xs);
  color: var(--text-secondary);
  line-height: 1.5;
}

.chart-tooltip.is-flipped {
  transform: translate(calc(-100% - 12px), -50%);
}
</style>
