<script setup>
import { useI18n } from 'vue-i18n'
import { ArrowLeft, Code2, Layers, Cpu, Cloud } from 'lucide-vue-next'

const { t } = useI18n()

const pillars = [
  { icon: Layers, titleKey: 'about_page.skill_arch', desc: 'Sistemas desacoplados, contratos bem definidos e manutenibilidade a longo prazo.' },
  { icon: Code2, titleKey: 'about_page.skill_frontend', desc: 'Interfaces reativas com Vue 3, micro-animações a 60fps e acessibilidade de ponta.' },
  { icon: Cpu, titleKey: 'about_page.skill_backend', desc: 'Pipelines de dados rápidos, serviços escaláveis em Python e Node.js com PostgreSQL/Redis.' },
  { icon: Cloud, titleKey: 'about_page.skill_cloud', desc: 'Infraestrutura automatizada, containers Docker e deploy contínuo em cloud providers.' }
]
</script>

<template>
  <main class="about-page">
    <div class="page-container">
      <router-link to="/" class="back-link">
        <ArrowLeft :size="18" />
        <span>{{ t('common.back_to_home') }}</span>
      </router-link>

      <header class="page-header">
        <h1 class="page-title">{{ t('about_page.title') }}</h1>
        <p class="page-subtitle">{{ t('about_page.subtitle') }}</p>
      </header>

      <section class="bio-section surface-card">
        <h2 class="bio-heading">{{ t('about_page.intro_title') }}</h2>
        <p class="bio-paragraph">{{ t('about_page.intro_p1') }}</p>
        <p class="bio-paragraph">{{ t('about_page.intro_p2') }}</p>
      </section>

      <section class="pillars-section">
        <h2 class="section-title">{{ t('about_page.skills_title') }}</h2>
        <div class="pillars-grid">
          <div
            v-for="(pillar, idx) in pillars"
            :key="idx"
            class="pillar-card surface-card"
          >
            <div class="pillar-icon">
              <component :is="pillar.icon" :size="24" />
            </div>
            <h3 class="pillar-title">{{ t(pillar.titleKey) }}</h3>
            <p class="pillar-desc">{{ pillar.desc }}</p>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.about-page {
  min-height: 100vh;
  padding: 6rem var(--spacing-xl) var(--spacing-2xl) var(--spacing-xl);
}

.page-container {
  max-width: 1000px;
  margin: 0 auto;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-bottom: var(--spacing-lg);
  transition: color var(--transition-fast);
}

.back-link:hover {
  color: var(--primary);
}

.page-header {
  margin-bottom: var(--spacing-xl);
}

.page-title {
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  line-height: 1;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.page-subtitle {
  font-size: var(--text-base);
  color: var(--text-secondary);
}

.bio-section {
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
}

.bio-heading {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.bio-paragraph {
  font-size: var(--text-base);
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
}

.bio-paragraph:last-child {
  margin-bottom: 0;
}

.pillars-section {
  margin-top: var(--spacing-2xl);
}

.section-title {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
}

.pillars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-md);
}

.pillar-card {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.pillar-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background-color: var(--primary-subtle);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.pillar-title {
  font-family: var(--font-heading);
  font-size: var(--text-base);
  color: var(--text-primary);
}

.pillar-desc {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .about-page {
    padding: 5rem var(--spacing-md) var(--spacing-xl) var(--spacing-md);
  }

  .bio-section {
    padding: var(--spacing-md);
  }
}
</style>
