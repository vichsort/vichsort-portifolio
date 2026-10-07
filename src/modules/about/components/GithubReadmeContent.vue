<script setup>
import { useI18n } from 'vue-i18n'
import { Terminal, Sparkles, CheckCircle2, Zap, SlidersHorizontal } from 'lucide-vue-next'

const { t } = useI18n()

const pillars = [
  { key: 'about_page.s3_readme.readme_pillar_1' },
  { key: 'about_page.s3_readme.readme_pillar_2' },
  { key: 'about_page.s3_readme.readme_pillar_3' },
  { key: 'about_page.s3_readme.readme_pillar_4' }
]

const specs = [
  { key: 'about_page.s3_readme.spec_os' },
  { key: 'about_page.s3_readme.spec_editor' },
  { key: 'about_page.s3_readme.spec_focus' }
]
</script>

<template>
  <div class="readme-body">
    <!-- Header Markdown -->
    <div class="readme-header">
      <h3 class="greeting-heading">
        {{ t('about_page.s3_readme.readme_header') }}
      </h3>
      <p class="intro-paragraph">
        {{ t('about_page.s3_readme.readme_intro') }}
      </p>
    </div>

    <!-- Especificações Rápidas -->
    <div class="readme-section specs-section">
      <h4 class="sub-heading">
        <SlidersHorizontal :size="14" class="heading-icon" />
        <span>{{ t('about_page.s3_readme.quick_specs_title') }}</span>
      </h4>

      <div class="specs-grid">
        <div
          v-for="(spec, index) in specs"
          :key="index"
          class="spec-pill"
        >
          <span class="spec-code">{{ t(spec.key) }}</span>
        </div>
      </div>
    </div>

    <!-- Filosofia de Engenharia -->
    <div class="readme-section">
      <h4 class="sub-heading">
        <Sparkles :size="14" class="heading-icon" />
        <span>{{ t('about_page.s3_readme.readme_pillars_title') }}</span>
      </h4>

      <ul class="pillars-list">
        <li
          v-for="(pillar, index) in pillars"
          :key="index"
          class="pillar-item"
        >
          <CheckCircle2 :size="15" class="bullet-icon" />
          <span class="pillar-text">{{ t(pillar.key) }}</span>
        </li>
      </ul>
    </div>

    <!-- Seção Now / Explorando agora -->
    <div class="readme-section now-section">
      <h4 class="sub-heading">
        <Zap :size="14" class="heading-icon zap-icon" />
        <span>{{ t('about_page.s3_readme.readme_now_title') }}</span>
      </h4>

      <div class="now-box">
        <p class="now-text">
          {{ t('about_page.s3_readme.readme_now_text') }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.readme-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  font-family: var(--font-body);
  color: var(--text-secondary);
}

.greeting-heading {
  font-size: var(--text-xl);
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.intro-paragraph {
  font-size: var(--text-sm);
  line-height: 1.7;
  color: var(--text-secondary);
}

.readme-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.sub-heading {
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding-bottom: 0.35rem;
  border-bottom: 1px solid var(--border-subtle);
}

.heading-icon {
  color: var(--primary);
}

.zap-icon {
  color: var(--neon-yellow);
}

.specs-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.spec-pill {
  padding: 0.3rem 0.65rem;
  border-radius: var(--radius-sm);
  background-color: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  font-family: monospace;
  font-size: var(--text-xs);
}

.spec-code {
  color: var(--text-primary);
}

.pillars-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 0;
  margin: 0;
}

.pillar-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: var(--text-sm);
  line-height: 1.6;
}

.bullet-icon {
  color: var(--primary);
  margin-top: 0.2rem;
  flex-shrink: 0;
}

.pillar-text {
  color: var(--text-secondary);
}

.now-box {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  background-color: var(--primary-subtle);
  border-left: 3px solid var(--primary);
}

.now-text {
  font-size: var(--text-xs);
  line-height: 1.6;
  color: var(--text-primary);
  font-weight: 500;
}
</style>
