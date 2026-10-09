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
</template>

<style>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>