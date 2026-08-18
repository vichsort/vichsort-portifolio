<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, CheckCircle2, ExternalLink, Calendar } from 'lucide-vue-next'

const { t, tm, rt } = useI18n()
const certifications = computed(() => tm('certifications_page.list') || [])
</script>

<template>
  <main class="certifications-page">
    <div class="page-container">
      <router-link to="/" class="back-link">
        <ArrowLeft :size="18" />
        <span>{{ t('common.back_to_home') }}</span>
      </router-link>

      <header class="page-header">
        <h1 class="page-title">{{ t('certifications_page.title') }}</h1>
        <p class="page-subtitle">{{ t('certifications_page.subtitle') }}</p>
      </header>

      <div class="certifications-grid">
        <article
          v-for="cert in certifications"
          :key="rt(cert.id)"
          class="cert-card surface-card"
        >
          <div class="cert-icon-wrapper">
            <CheckCircle2 :size="24" class="cert-icon" />
          </div>

          <div class="cert-content">
            <div class="cert-meta">
              <span class="issuer">{{ rt(cert.issuer) }}</span>
              <span class="date">
                <Calendar :size="12" />
                {{ rt(cert.date) }}
              </span>
            </div>

            <h2 class="cert-name">{{ rt(cert.name) }}</h2>

            <a
              v-if="cert.credential_url"
              :href="rt(cert.credential_url)"
              target="_blank"
              rel="noopener noreferrer"
              class="credential-link"
            >
              <span>Ver Credencial</span>
              <ExternalLink :size="14" />
            </a>
          </div>
        </article>
      </div>
    </div>
  </main>
</template>

<style scoped>
.certifications-page {
  min-height: 100vh;
  padding: 6rem var(--spacing-xl) var(--spacing-2xl) var(--spacing-xl);
}

.page-container {
  max-width: 900px;
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
  margin-bottom: var(--spacing-2xl);
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

.certifications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: var(--spacing-md);
}

.cert-card {
  padding: var(--spacing-lg);
  display: flex;
  gap: var(--spacing-md);
  align-items: flex-start;
}

.cert-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background-color: var(--primary-subtle);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cert-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.cert-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-xs);
}

.issuer {
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.date {
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.cert-name {
  font-family: var(--font-heading);
  font-size: var(--text-base);
  color: var(--text-primary);
  line-height: 1.3;
}

.credential-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin-top: 0.5rem;
  transition: color var(--transition-fast);
}

.credential-link:hover {
  color: var(--primary);
}

@media (max-width: 768px) {
  .certifications-page {
    padding: 5rem var(--spacing-md) var(--spacing-xl) var(--spacing-md);
  }

  .certifications-grid {
    grid-template-columns: 1fr;
  }
}
</style>
