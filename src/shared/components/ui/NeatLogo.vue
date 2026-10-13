<script setup>
/**
 * O logo NEAT: grade 3×3 de quadrados, nas cores do tema. Desenhado em CSS para
 * acompanhar o tema claro e o escuro. O mesmo desenho está no index.html (tela de
 * carregamento antes do JavaScript) e no scripts/og-image.mjs (prévia de link).
 *
 * size: lado de cada quadrado (qualquer medida CSS)
 * pulse: os quadrados acendem em sequência (tela de carregamento)
 */
defineProps({
  size: { type: String, default: '18px' },
  pulse: { type: Boolean, default: false }
})

// p (roxo), b (azul), k (tinta do tema), vazio
const CELLS = ['', 'p', 'k', 'k', '', 'k', 'p', 'b', '']
</script>

<template>
  <div class="neat-logo" :class="{ pulse }" :style="{ '--cell': size }" aria-hidden="true">
    <span v-for="(cell, i) in CELLS" :key="i" :class="cell" />
  </div>
</template>

<style scoped>
.neat-logo {
  display: grid;
  grid-template-columns: repeat(3, var(--cell));
  grid-template-rows: repeat(3, var(--cell));
}

.p { background: var(--logo-purple); }
.b { background: var(--logo-blue); }
.k { background: var(--text-primary); }

.pulse span {
  animation: neat-pulse 1.2s ease-in-out infinite;
}

.pulse span:nth-child(2) { animation-delay: 0.1s; }
.pulse span:nth-child(3) { animation-delay: 0.2s; }
.pulse span:nth-child(4) { animation-delay: 0.3s; }
.pulse span:nth-child(6) { animation-delay: 0.5s; }
.pulse span:nth-child(7) { animation-delay: 0.6s; }
.pulse span:nth-child(8) { animation-delay: 0.7s; }

@keyframes neat-pulse {
  50% { opacity: 0.35; }
}

@media (prefers-reduced-motion: reduce) {
  .pulse span { animation: none !important; }
}
</style>
