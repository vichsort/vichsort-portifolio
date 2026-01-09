<script setup>
import { onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useSettings } from '@/composables/useSettings'
import TheNavbar from '@/components/layout/NavbarComponent.vue'
import SettingsSidebar from '@/components/layout/SettingsSidebar.vue'
import NavigationSidebar from '@/components/layout/NavigationSidebar.vue'

const { initTheme, listenToSystemChanges } = useTheme()
const { initSettings } = useSettings()

onMounted(() => {
  initTheme()
  initSettings()
  listenToSystemChanges()
})
</script>

<template>
  <TheNavbar />
  <NavigationSidebar />
  <SettingsSidebar />
  
  <router-view v-slot="{ Component }">
    <transition name="page-fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>

</template>

<style>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>