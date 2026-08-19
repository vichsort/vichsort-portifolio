<script setup>
import { useI18n } from 'vue-i18n'
import MacWindow from './MacWindow.vue'
import GithubReadmeContent from './GithubReadmeContent.vue'

const { t } = useI18n()
</script>

<template>
  <section class="description-section">
    <!-- Coluna Esquerda: Texto Autoral & Mentalidade -->
    <div class="left-column">
      <h2 class="section-title">
        {{ t('about_page.s3_readme.left_title') }}
      </h2>

      <div class="text-content">
        <p class="narrative-paragraph">
          {{ t('about_page.s3_readme.left_p1') }}
        </p>

        <p class="narrative-paragraph">
          {{ t('about_page.s3_readme.left_p2') }}
        </p>
      </div>
    </div>

    <!-- Coluna Direita: Janela macOS com o README (Mais ampla) -->
    <div class="right-column">
      <MacWindow :title="t('about_page.s3_readme.window_title')">
        <GithubReadmeContent />
      </MacWindow>
    </div>
  </section>
</template>

<style scoped>
.description-section {
  display: grid;
  grid-template-columns: 0.8fr 1.45fr;
  gap: var(--spacing-2xl);
  align-items: center;
  margin-top: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.section-title {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 3.5vw, 2.75rem);
  color: var(--text-primary);
  line-height: 1.15;
  letter-spacing: -0.5px;
}

.text-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.narrative-paragraph {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 1.8;
  color: var(--text-secondary);
}

.right-column {
  width: 100%;
}

@media (max-width: 960px) {
  .description-section {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }
}
</style>
