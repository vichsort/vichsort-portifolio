<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { MapPin, GraduationCap, ArrowUpRight, Mail, Cake } from 'lucide-vue-next'

const { t } = useI18n()

// Data de nascimento: 25/05/2008 (Mês 4 no JS Date pois é 0-indexed)
const birthDate = new Date(2008, 4, 25)

const age = computed(() => {
  const today = new Date()
  let years = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    years--
  }
  return years
})
</script>

<template>
  <section class="profile-summary surface-card">
    <div class="profile-header">
      <div class="identity-block">
        <h2 class="profile-name">{{ t('about_page.s1_profile.name') }}</h2>
        <p class="profile-role">{{ t('about_page.s1_profile.role') }}</p>
      </div>

      <div class="quick-links">
        <router-link to="/contact" class="cta-pill">
          <Mail :size="14" />
          <span>{{ t('about_page.cta.contact_btn') }}</span>
          <ArrowUpRight :size="14" />
        </router-link>
      </div>
    </div>

    <div class="meta-strip">
      <div class="meta-item">
        <Cake :size="15" class="meta-icon" />
        <span>{{ age }} {{ t('about_page.s1_profile.years_old') }}</span>
      </div>

      <div class="meta-item">
        <MapPin :size="15" class="meta-icon" />
        <span>{{ t('about_page.s1_profile.location') }}</span>
      </div>

      <div class="meta-item">
        <GraduationCap :size="15" class="meta-icon" />
        <span>{{ t('about_page.s1_profile.education') }}</span>
      </div>
    </div>

    <p class="profile-bio">
      {{ t('about_page.s1_profile.bio_short') }}
    </p>
  </section>
</template>

<style scoped>
.profile-summary {
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  border-radius: var(--radius-lg);
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at top right, var(--primary-subtle), var(--bg-surface-1) 75%);
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.identity-block {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.profile-name {
  font-family: var(--font-body);
  font-weight: 800;
  font-size: clamp(2rem, 4vw, 2.75rem);
  color: var(--text-primary);
  line-height: 1.1;
  letter-spacing: -0.5px;
}

.profile-role {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--primary);
  letter-spacing: 0.2px;
}

.quick-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cta-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.25rem;
  border-radius: var(--radius-full);
  background-color: var(--primary);
  color: var(--text-on-primary);
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-decoration: none;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-glow);
}

.cta-pill:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
}

.meta-strip {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
  padding: var(--spacing-sm) 0;
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.meta-icon {
  color: var(--primary);
  flex-shrink: 0;
}

.profile-bio {
  font-size: var(--text-base);
  line-height: 1.8;
  color: var(--text-secondary);
  max-width: 900px;
}

@media (max-width: 768px) {
  .profile-summary {
    padding: var(--spacing-lg);
  }

  .meta-strip {
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .profile-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
