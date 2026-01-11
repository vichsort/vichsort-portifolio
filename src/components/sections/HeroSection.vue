<script setup>
import { computed, hydrateOnIdle } from 'vue';
import { useI18n } from 'vue-i18n'
const { t, tm, rt } = useI18n()
const roles = computed(() => tm('hero.roles'))

const props = defineProps({
  currentTheme: {
    type: String,
    default: 'dark'
  }
});

const logoSrc = computed(() => {
  return props.currentTheme === 'dark'
    ? '/images/neat-logo-dark.png'
    : '/images/neat-logo-light.png';
});
</script>

<template>
  <section class="hero-container">

    <div class="hero-branding">
      <img :src="logoSrc" alt="Logo NEAT" class="brand-logo" />
    </div>

    <div class="hero-content">
      <p class="intro-text">{{ t('hero.introduction') }}</p>

      <h1 class="main-title">
        VITOR<span class="highlight">.</span>
      </h1>

      <div class="roles-container">
        <p v-for="(role, key) in roles" :key="key">
          {{ rt(role) }}
        </p>
      </div>
    </div>
    <!-- TODO: ARRUMAR ESSES QUADRADINHOS AQUII -->
    <div class="decorative-corner">
      <div class="pixel-grid">
        <div class="pixel p1"></div>
        <div class="pixel p2"></div>
        <div class="pixel p3"></div>
        <div class="pixel p4"></div>
      </div>
    </div>

  </section>
</template>

<style scoped>
.hero-container {
  position: relative;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: var(--spacing-xl);
  overflow: hidden;
}

.hero-container::selection {
  background-color: var(--primary)
}

.brand-logo {
  width: 120px;
  height: auto;
  display: block;
}

.hero-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  z-index: 10;
  margin-top: -2rem;
}

.intro-text {
  font-family: var(--font-body);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--text);
}

.main-title {
  font-family: var(--font-heading);
  font-size: clamp(4rem, 12vw, 9rem);
  line-height: 1;
  letter-spacing: -0.02em;
  margin-left: -5px;
}

.highlight {
  color: var(--primary);
}

.roles-container {
  margin-top: var(--spacing-md);
  font-family: var(--font-body);
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-style: italic;
  color: var(--text);
  opacity: 0.9;
  line-height: 1;
}

.decorative-corner {
  position: absolute;
  bottom: 0;
  right: 0;
  width: clamp(150px, 20vw, 300px);
  height: clamp(150px, 20vw, 300px);
}

.pixel-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  height: 100%;
}

.pixel {
  width: 100%;
  height: 100%;
}

.p1 {
  background-color: var(--accent);
}

.p2 {
  background-color: var(--background);
}

.p3 {
  background-color: var(--primary);
}

.p4 {
  background-color: var(--secondary);
}

@media (max-width: 768px) {
  .hero-container {
    padding: var(--spacing-md);
  }

  .hero-branding {
    left: var(--spacing-md);
    top: var(--spacing-md);
  }

  .main-title {
    font-size: 4.5rem;
  }
}
</style>