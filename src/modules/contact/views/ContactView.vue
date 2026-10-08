<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, Mail, Github, Linkedin, Send, Copy, Check } from 'lucide-vue-next'
import { EMAIL, SOCIALS } from '@/core/config/profile'

const { t } = useI18n()
const copied = ref(false)
const email = EMAIL

const copyToClipboard = () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(email)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

const CHANNEL_ICONS = { github: Github, linkedin: Linkedin, telegram: Send }

const channels = SOCIALS.map(social => ({
  icon: CHANNEL_ICONS[social.id],
  labelKey: `contact_page.${social.id}_label`,
  handle: social.handle,
  url: social.url
}))
</script>

<template>
  <main class="contact-page">
    <div class="page-container">
      <router-link to="/" class="back-link">
        <ArrowLeft :size="18" />
        <span>{{ t('common.back_to_home') }}</span>
      </router-link>

      <header class="page-header">
        <h1 class="page-title">{{ t('contact_page.title') }}</h1>
        <p class="page-subtitle">{{ t('contact_page.subtitle') }}</p>
      </header>

      <div class="contact-grid">
        <section class="email-card surface-card">
          <div class="email-icon">
            <Mail :size="28" />
          </div>
          <div class="email-info">
            <span class="email-label">{{ t('contact_page.email_label') }}</span>
            <span class="email-address">{{ email }}</span>
          </div>

          <button @click="copyToClipboard" class="btn-copy">
            <component :is="copied ? Check : Copy" :size="16" />
            <span>{{ copied ? t('contact_page.copied') : t('contact_page.copy_email') }}</span>
          </button>
        </section>

        <section class="socials-list">
          <a
            v-for="(channel, idx) in channels"
            :key="idx"
            :href="channel.url"
            target="_blank"
            rel="noopener noreferrer"
            class="social-card surface-card interactive"
          >
            <div class="social-icon">
              <component :is="channel.icon" :size="22" />
            </div>
            <div class="social-details">
              <span class="social-title">{{ t(channel.labelKey) }}</span>
              <span class="social-handle">{{ channel.handle }}</span>
            </div>
            <span class="arrow-indicator">&rarr;</span>
          </a>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
.contact-page {
  min-height: 100vh;
  padding: 6rem var(--spacing-xl) var(--spacing-2xl) var(--spacing-xl);
}

.page-container {
  max-width: 800px;
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

.contact-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.email-card {
  padding: var(--spacing-xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.email-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  background-color: var(--primary-subtle);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.email-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.email-label {
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
}

.email-address {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  color: var(--text-primary);
}

.btn-copy {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: var(--radius-full);
  background-color: var(--primary);
  color: var(--text-on-primary);
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all var(--transition-fast);
}

.btn-copy:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
}

.socials-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.social-card {
  padding: var(--spacing-md) var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  text-decoration: none;
}

.social-icon {
  color: var(--primary);
}

.social-details {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.social-title {
  font-family: var(--font-heading);
  font-size: var(--text-sm);
  color: var(--text-primary);
}

.social-handle {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.arrow-indicator {
  color: var(--text-muted);
  font-size: var(--text-lg);
  transition: all var(--transition-fast);
}

.social-card:hover .arrow-indicator {
  color: var(--primary);
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .contact-page {
    padding: 5rem var(--spacing-md) var(--spacing-xl) var(--spacing-md);
  }

  .email-card {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
