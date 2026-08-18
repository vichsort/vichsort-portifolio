<script setup>
import { onMounted } from 'vue'
import { useTheme } from '@/shared/composables/useTheme'
import { useSettings } from '@/shared/composables/useSettings'
import TheNavbar from '@/shared/components/layout/TheNavbar.vue'
import SettingsSidebar from '@/shared/components/layout/SettingsSidebar.vue'
import NavigationSidebar from '@/shared/components/layout/NavigationSidebar.vue'

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