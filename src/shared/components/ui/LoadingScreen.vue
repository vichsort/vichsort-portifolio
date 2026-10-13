<script setup>
import { useI18n } from 'vue-i18n'
import { isLoading } from '@/shared/composables/useLoading'
import NeatLogo from './NeatLogo.vue'

/**
 * A tela de carregamento do index.html (n18) depois que o app montou: na navegação
 * que demora (chunk da página, corpos do conteúdo) e na troca de idioma. O mesmo
 * logo NEAT acendendo em sequência e o mesmo atraso de 0,3s, para não piscar
 * quando a espera é curta.
 */
const { t } = useI18n()
</script>

<template>
  <!-- duration: sem ela, o Vue esperaria também a animação de entrada (0,6s) para tirar a tela -->
  <Transition name="loading-fade" :duration="{ enter: 0, leave: 150 }">
    <div v-if="isLoading" class="loading-screen" role="status" :aria-label="t('common.loading')">
      <NeatLogo pulse />
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
</style>
