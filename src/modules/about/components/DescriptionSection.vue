<script setup>
import { useI18n } from 'vue-i18n'
import MacWindow from './MacWindow.vue'
import GithubReadmeContent from './GithubReadmeContent.vue'

const { t } = useI18n()
</script>

<template>
  <section class="description-section">
    <!-- O título ocupa a largura toda: na coluna da esquerda, "convencional" não cabia
         na fonte pixel e ficava por baixo da janela do README -->
    <h2 class="section-title">
      {{ t('about_page.s3_readme.left_title') }}
    </h2>

    <!-- Coluna Esquerda: Texto Autoral & Mentalidade -->
    <div class="left-column">
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
  /* minmax(0, …): o README largo não empurra a coluna para fora da tela */
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.45fr);
  grid-template-areas:
    'title title'
    'text window';
  column-gap: var(--spacing-2xl);
  row-gap: var(--spacing-xl);
  align-items: center;
  margin-top: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.left-column {
  grid-area: text;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.section-title {
  grid-area: title;
  font-family: var(--font-heading);
  /* mínimo em vw: a palavra mais longa precisa caber numa tela de 360px */
  font-size: clamp(min(2rem, 6vw), 3.5vw, 2.75rem);
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
  grid-area: window;
  width: 100%;
}

@media (max-width: 960px) {
  .description-section {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      'title'
      'text'
      'window';
  }
}
</style>
