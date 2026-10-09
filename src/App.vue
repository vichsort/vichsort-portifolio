<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '@/shared/composables/useTheme'
import { useSettings } from '@/shared/composables/useSettings'
import TheNavbar from '@/shared/components/layout/TheNavbar.vue'
import SettingsSidebar from '@/shared/components/layout/SettingsSidebar.vue'
import TheFooter from '@/shared/components/layout/TheFooter.vue'
import NodeMenuHost from '@/shared/components/node/NodeMenuHost.vue'
import PartialTranslationNotice from '@/shared/components/ui/PartialTranslationNotice.vue'
import LoadingScreen from '@/shared/components/ui/LoadingScreen.vue'
import { isViewTransitioning } from '@/shared/composables/useViewTransition'

const route = useRoute()

const { initTheme, listenToSystemChanges } = useTheme()
const { initSettings } = useSettings()

onMounted(() => {
  initTheme()
  initSettings()
  listenToSystemChanges()
})
</script>

<template>
  <!-- Rotas com meta.bare (o terminal) ocupam a tela sozinhas -->
  <TheNavbar v-if="!route.meta.bare" />
  <SettingsSidebar />

  <!-- Na troca animada (View Transition), a própria transição anima: o fade entre páginas
       sai de cena (sem CSS e sem out-in, a troca é imediata e não espera frames,
       que a View Transition pausa) -->
  <router-view v-slot="{ Component }">
    <transition
      name="page-fade"
      :mode="isViewTransitioning ? 'default' : 'out-in'"
      :css="!isViewTransitioning"
    >
      <component :is="Component" />
    </transition>
  </router-view>

  <TheFooter v-if="!route.meta.bare" />

  <!-- Menu de nó dos wikilinks nos textos (v-content-links) -->
  <NodeMenuHost />

  <!-- Em es e it, aviso de que parte do conteúdo aparece em inglês (fora do terminal) -->
  <PartialTranslationNotice v-if="!route.meta.bare" />

  <!-- Navegação ou troca de idioma que demora (chunk da página, textos do conteúdo) -->
  <LoadingScreen />
</template>

<style>
/* A página antiga sai na hora (sem transição, o out-in não espera) e só a nova entra:
   com saída animada, cada clique esperava meio segundo antes de mostrar algo */
.page-fade-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
</style>