<script setup>
import { useI18n } from 'vue-i18n'
import { ArrowLeft } from 'lucide-vue-next'

const { t } = useI18n()
</script>

<template>
  <main class="not-found-page">
    <div class="not-found-card surface-card">
      <div class="glitch-title">{{ t('not_found.title') }}</div>
      <h1 class="error-heading">{{ t('not_found.subtitle') }}</h1>
      <p class="error-description">{{ t('not_found.description') }}</p>

      <router-link to="/" class="home-btn">
        <ArrowLeft :size="18" />
        <span>{{ t('not_found.back_home') }}</span>
      </router-link>
    </div>
  </main>
</template>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
}

.not-found-card {
  max-width: 520px;
  width: 100%;
  padding: var(--spacing-2xl) var(--spacing-xl);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.glitch-title {
  font-family: var(--font-heading);
  font-size: clamp(5rem, 12vw, 8rem);
  line-height: 0.9;
  color: var(--primary);
  letter-spacing: -2px;
  text-shadow: 0 0 30px var(--primary-glow);
}

.error-heading {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  color: var(--text-primary);
}

.error-description {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: 1.6;
}

.home-btn {
  margin-top: var(--spacing-md);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  background-color: var(--primary);
  color: #ffffff;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: var(--shadow-glow);
  transition: all var(--transition-fast);
}

.home-btn:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
}
</style>
