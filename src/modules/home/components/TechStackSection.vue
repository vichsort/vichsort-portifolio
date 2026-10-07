<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useContent } from '@/core/content/useContent'
import TechIcon from '@/shared/components/node/TechIcon.vue'

const { t } = useI18n()

const { collection } = useContent()

// Os grupos organizam o vault; a home mostra a stack como uma grade única
const techIds = computed(() => collection('home-stack').flatMap(({ items }) => items.map((tech) => tech.id)))
</script>

<template>
  <section class="tech-section">
    <div class="content-wrapper">
      <div class="stack-introduction">
        <span class="small-label">{{ t('tech_stack.label') }}</span>
        <h2 class="main-title">
          TECH <span class="highlight">STACK</span>
        </h2>
      </div>

      <div class="tech-grid">
        <TechIcon v-for="id in techIds" :id="id" :key="id" class="tech-item" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.tech-section {
  padding: var(--spacing-2xl) 0;
  background-color: var(--bg-canvas);
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-2xl);
}

.stack-introduction {
  flex: 1;
  max-width: 35%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 10;
}

.small-label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: var(--spacing-xs);
}

.main-title {
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

.highlight {
  color: var(--primary);
}

.tech-grid {
  flex: 1.5;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 1rem;
}

.tech-item {
  width: 64px;
  height: 64px;
}

@media (max-width: 900px) {
  .content-wrapper {
    flex-direction: column;
    gap: var(--spacing-lg);
    text-align: center;
  }

  .stack-introduction {
    max-width: 100%;
    align-items: center;
  }

  .tech-grid {
    justify-content: center;
  }
}
</style>
