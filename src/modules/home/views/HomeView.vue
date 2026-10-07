<script setup>
import HeroSection from '../components/HeroSection.vue'
import AboutSection from '../components/AboutSection.vue'
import LeadsSection from '../components/LeadsSection.vue'
import ProjectShowcaseSection from '@/modules/projects/components/ProjectShowcaseSection.vue'
import TestimonialsSection from '@/modules/testimonials/components/TestimonialsSection.vue'
import TechStackSection from '../components/TechStackSection.vue'
import TerminalSection from '@/modules/terminal/components/TerminalSection.vue'
import { useTheme } from '@/shared/composables/useTheme'

const { theme } = useTheme()
</script>

<template>
  <main>
    <HeroSection :current-theme="theme" />
    <AboutSection />
    <LeadsSection />
    <ProjectShowcaseSection />
    <TestimonialsSection />
    <TechStackSection />
    <TerminalSection />
  </main>
</template>
