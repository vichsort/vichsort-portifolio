<script setup>
import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import { useTheme } from '@/composables/useTheme'

const { theme } = useTheme()
</script>

<template>
  <main>
    <HeroSection :current-theme="theme" />
    <AboutSection />
  </main>
</template>