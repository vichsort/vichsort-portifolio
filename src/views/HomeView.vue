<script setup>
import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import LeadsSection from '@/components/sections/LeadsSection.vue';
import ProjectShowcaseSection from '@/components/sections/ProjectShowcaseSection.vue';
import { useTheme } from '@/composables/useTheme'

const { theme } = useTheme()
</script>

<template>
  <main>
    <HeroSection :current-theme="theme" />
    <AboutSection />
    <LeadsSection />
    <ProjectShowcaseSection />
  </main>
</template>