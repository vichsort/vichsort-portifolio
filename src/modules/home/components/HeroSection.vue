<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

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
        <p v-for="(role, key) in roles" :key="key" class="role-line">
          {{ rt(role) }}
        </p>
      </div>
    </div>

    <div class="decorative-corner" aria-hidden="true">
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
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--spacing-xl);
  overflow: hidden;
  background: radial-gradient(circle at 10% 20%, var(--primary-subtle) 0%, transparent 40%),
              radial-gradient(circle at 90% 80%, var(--accent-subtle) 0%, transparent 50%);
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
  margin-bottom: var(--spacing-xs);
  letter-spacing: 0.5px;
}

.main-title {
  font-family: var(--font-heading);
  font-size: clamp(3.5rem, 11vw, 8.5rem);
  line-height: 0.95;
  letter-spacing: -0.03em;
  margin-left: -4px;
  color: var(--text-primary);
}

.highlight {
  color: var(--primary);
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

.decorative-corner {
  position: absolute;
  bottom: 0;
  right: 0;
  width: clamp(120px, 15vw, 220px);
  height: clamp(120px, 15vw, 220px);
  opacity: 0.85;
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

.p1 { background-color: var(--accent); }
.p2 { background-color: var(--bg-surface-2); }
.p3 { background-color: var(--primary); }
.p4 { background-color: var(--bg-surface-1); }

@media (max-width: 768px) {
  .hero-container {
    padding: var(--spacing-md);
  }

  .main-title {
    font-size: clamp(3rem, 15vw, 4.5rem);
  }
}
</style>
