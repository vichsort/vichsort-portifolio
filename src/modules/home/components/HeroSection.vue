<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useIntersectionObserver } from '@vueuse/core'
import { useAsciiField } from '@/shared/composables/useAsciiField'
import { useHeroPresence } from '@/shared/composables/useHeroPresence'
import { NEON_TOKENS } from '@/shared/ascii/neonTokens'
import { createHeroLayers } from '../hero/heroField'
import HeroAsciiTitle from './hero/HeroAsciiTitle.vue'
import vitorArt from '../ascii/vitor.txt?raw'

// Ponto final do "VITOR." no estilo 4max
const TITLE_DOT = 'db\nYP'

const { t, tm, rt } = useI18n()
const roles = computed(() => tm('hero.roles'))

const props = defineProps({
  currentTheme: {
    type: String,
    default: 'dark'
  }
})

const logoSrc = computed(() => {
  return props.currentTheme === 'dark'
    ? '/images/neat-logo-dark.png'
    : '/images/neat-logo-light.png'
})

const fieldCanvas = ref(null)
const { active, motion } = useAsciiField(fieldCanvas, {
  tokens: NEON_TOKENS,
  createLayers: createHeroLayers
})

// Avisa a navbar enquanto o hero estiver atrás dela (faixa dos 5% do topo da tela)
const heroSection = ref(null)
const { setHeroActive } = useHeroPresence()
useIntersectionObserver(
  heroSection,
  ([entry]) => setHeroActive(entry?.isIntersecting ?? false),
  { rootMargin: '0px 0px -95% 0px' }
)
onBeforeUnmount(() => setHeroActive(false))
</script>

<template>
  <section ref="heroSection" class="hero-container">
    <canvas ref="fieldCanvas" class="hero-field" aria-hidden="true"></canvas>

    <div class="hero-branding" data-ascii-safe>
      <img :src="logoSrc" alt="Logo NEAT" class="brand-logo" />
    </div>

    <div class="hero-content">
      <p class="intro-text" data-ascii-safe>{{ t('hero.introduction') }}</p>

      <h1 class="main-title" data-ascii-safe>
        <span class="sr-only">VITOR.</span>
        <HeroAsciiTitle :art="vitorArt" :accent="TITLE_DOT" :active="active" :motion="motion" />
      </h1>

      <div class="roles-container" data-ascii-safe>
        <p v-for="(role, key) in roles" :key="key" class="role-line">
          {{ rt(role) }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--spacing-xl);
  overflow: hidden;
  background: radial-gradient(circle at 10% 20%, var(--primary-subtle) 0%, transparent 40%),
              radial-gradient(circle at 90% 80%, var(--accent-subtle) 0%, transparent 50%),
              linear-gradient(180deg, var(--hero-bg-top) 0%, var(--hero-bg-bottom) 100%);
}

/* Scanlines de CRT: acima do canvas, abaixo do conteúdo */
.hero-container::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0 2px,
    var(--hero-scanline) 2px 3px
  );
}

.hero-field {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.hero-branding {
  position: relative;
  z-index: 2;
  align-self: flex-start;
}

.brand-logo {
  width: 120px;
  height: auto;
  display: block;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  flex: 1;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.intro-text {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
  letter-spacing: 0.5px;
}

.main-title {
  margin: 0;
  line-height: 1;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.roles-container {
  margin-top: var(--spacing-md);
  font-family: var(--font-body);
  font-size: clamp(1.1rem, 2.5vw, 1.6rem);
  font-style: italic;
  color: var(--text-secondary);
  line-height: 1.3;
}

.role-line {
  margin-bottom: 0.2rem;
}

@media (max-width: 768px) {
  .hero-container {
    padding: var(--spacing-md);
  }
}
</style>
