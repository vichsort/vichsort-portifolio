<script setup>
import { computed } from 'vue';

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
      <p class="intro-text">Olá! Meu nome é</p>

      <h1 class="main-title">
        VITOR<span class="highlight">.</span>
      </h1>

      <div class="roles-container">
        <p>Desenvolvimento,</p>
        <p>Ciência de Dados,</p>
        <p>Arquitetura de software.</p>
      </div>

      <div class="hero-socials">
        <a href="https://github.com" target="_blank" class="social-item">GitHub</a>
        <span class="separator">•</span>
        <a href="https://linkedin.com" target="_blank" class="social-item">LinkedIn</a>
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

.hero-branding {
  position: absolute;
  top: var(--spacing-lg);
  left: var(--spacing-xl);
  z-index: 10;
}

.brand-logo {
  width: 60px;
  height: auto;
  display: block;
}

.hero-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  z-index: 10;
  margin-top: 2rem;
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
  line-height: 1.4;
}

.hero-socials {
  margin-top: var(--spacing-lg);
  font-family: var(--font-body);
  font-size: 1.4rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  opacity: 0.7;
}

.social-item {
  position: relative;
  transition: color 0.3s;
}

.social-item::after {
  content: '';
  position: absolute;
  width: 0;
  height: 1px;
  bottom: -2px;
  left: 0;
  background-color: var(--accent);
  transition: width 0.3s;
}

.social-item:hover {
  color: var(--accent);
}

.social-item:hover::after {
  width: 100%;
}

.separator {
  color: var(--primary);
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