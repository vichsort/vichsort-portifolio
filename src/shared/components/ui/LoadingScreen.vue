<script setup>
import { useI18n } from 'vue-i18n'
import { isLoading } from '@/shared/composables/useLoading'

/**
 * A tela de carregamento do index.html (n18) depois que o app montou: na navegação
 * que demora (chunk da página, corpos do conteúdo) e na troca de idioma. O mesmo
 * logo NEAT acendendo em sequência e o mesmo atraso de 0,3s, para não piscar
 * quando a espera é curta.
 */
const { t } = useI18n()

// Grade 3×3 do logo: p (roxo), b (azul), k (tinta do tema), vazio
const CELLS = ['', 'p', 'k', 'k', '', 'k', 'p', 'b', '']
</script>

<template>
  <!-- duration: sem ela, o Vue esperaria também a animação de entrada (0,6s) para tirar a tela -->
  <Transition name="loading-fade" :duration="{ enter: 0, leave: 150 }">
    <div v-if="isLoading" class="loading-screen" role="status" :aria-label="t('common.loading')">
      <div class="loading-logo" aria-hidden="true">
        <span v-for="(cell, i) in CELLS" :key="i" :class="cell" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  z-index: var(--z-loading);
  display: grid;
  place-items: center;
  background: var(--bg-canvas);
  /* Escondida (e sem pegar cliques) nos primeiros 0,3s: espera curta não pisca nem trava a página */
  opacity: 0;
  visibility: hidden;
  animation: loading-in 0.3s ease 0.3s forwards;
}

.loading-logo {
  display: grid;
  grid-template-columns: repeat(3, 18px);
  grid-template-rows: repeat(3, 18px);
}

.loading-logo .p { background: var(--logo-purple); }
.loading-logo .b { background: var(--logo-blue); }
.loading-logo .k { background: var(--text-primary); }

.loading-logo span {
  animation: loading-pulse 1.2s ease-in-out infinite;
}

.loading-logo span:nth-child(2) { animation-delay: 0.1s; }
.loading-logo span:nth-child(3) { animation-delay: 0.2s; }
.loading-logo span:nth-child(4) { animation-delay: 0.3s; }
.loading-logo span:nth-child(6) { animation-delay: 0.5s; }
.loading-logo span:nth-child(7) { animation-delay: 0.6s; }
.loading-logo span:nth-child(8) { animation-delay: 0.7s; }

.loading-fade-leave-active {
  transition: opacity 0.15s ease;
  pointer-events: none;
}

.loading-fade-leave-to {
  opacity: 0 !important;
}

@keyframes loading-in {
  to { opacity: 1; visibility: visible; }
}

@keyframes loading-pulse {
  50% { opacity: 0.35; }
}

@media (prefers-reduced-motion: reduce) {
  .loading-logo span { animation: none !important; }
}
</style>
