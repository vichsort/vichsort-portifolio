<script setup>
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/shared/composables/useTheme'
import { Code2, Server, Terminal } from 'lucide-vue-next'

const { t } = useI18n()
const { isDark } = useTheme()

const getAssetUrl = (name) => {
  return new URL(`../../../assets/techs/${name}`, import.meta.url).href
}

const stackGroups = [
  {
    id: 'frontend',
    titleKey: 'about_page.s2_stack.frontend_label',
    icon: Code2,
    techs: [
      { name: 'Vue.js', icon: 'vuedotjs.svg' },
      { name: 'TypeScript', icon: 'typescript.svg' },
      { name: 'Vite', icon: 'vite.svg' },
      { name: 'Tailwind CSS', icon: 'tailwindcss.svg' },
      { name: 'JavaScript', icon: 'javascript.svg' }
    ]
  },
  {
    id: 'backend',
    titleKey: 'about_page.s2_stack.backend_label',
    icon: Server,
    techs: [
      { name: 'Python', icon: 'python.svg' },
      { name: 'Node.js', icon: 'nodedotjs.svg' },
      { name: 'PostgreSQL', icon: 'postgresql.svg' },
      { name: 'Docker', icon: 'docker.svg' },
      { name: 'Redis', icon: 'redis.svg' }
    ]
  },
  {
    id: 'ecosystem',
    titleKey: 'about_page.s2_stack.ecosystem_label',
    icon: Terminal,
    techs: [
      { name: 'Linux Mint', icon: 'linuxmint.svg' },
      { name: 'VS Code', icon: 'vscode.svg' },
      { name: 'Git', icon: 'git.svg' },
      { name: 'Railway', icon: 'railway.svg' },
      { name: 'Nginx', icon: 'nginx.svg' }
    ]
  }
]
</script>

<template>
  <section class="core-stack-section">
    <div class="section-header">
      <h2 class="section-title">{{ t('about_page.s2_stack.title') }}</h2>
      <p class="section-subtitle">{{ t('about_page.s2_stack.subtitle') }}</p>
    </div>

    <div class="stack-grid">
      <div
        v-for="group in stackGroups"
        :key="group.id"
        class="stack-card surface-card"
      >
        <div class="card-header">
          <div class="group-icon-wrapper">
            <component :is="group.icon" :size="20" />
          </div>
          <h3 class="group-title">{{ t(group.titleKey) }}</h3>
        </div>

        <div class="tech-items-row">
          <div
            v-for="tech in group.techs"
            :key="tech.name"
            class="tech-item"
          >
            <div class="icon-wrapper">
              <img
                :src="getAssetUrl(tech.icon)"
                :alt="tech.name"
                loading="lazy"
                class="tech-icon"
                :class="{ 'inverted-icon': isDark }"
              />
            </div>
            <span class="tooltip">{{ tech.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.core-stack-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-md);
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.section-title {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.section-subtitle {
  font-size: var(--text-base);
  color: var(--text-secondary);
}

.stack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-md);
}

.stack-card {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  border-radius: var(--radius-lg);
  transition: transform var(--transition-fast), border-color var(--transition-fast);
}

.stack-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary-border);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.group-icon-wrapper {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-md);
  background-color: var(--primary-subtle);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.group-title {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--text-base);
  color: var(--text-primary);
}

/* Grid com 5 colunas rígidas para manter simetria perfeita sem quebrar 4+1 */
.tech-items-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  width: 100%;
  padding-top: var(--spacing-xs);
}

.tech-item {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper {
  width: 100%;
  height: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  transition: transform var(--transition-fast), border-color var(--transition-fast), background-color var(--transition-fast), box-shadow var(--transition-fast);
}

.tech-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0.75;
  transition: opacity var(--transition-fast), filter var(--transition-fast);
}

.tech-icon.inverted-icon {
  filter: invert(1);
  opacity: 0.85;
}

.tech-item:hover .icon-wrapper {
  transform: translateY(-3px) scale(1.05);
  border-color: var(--primary-border);
  background-color: var(--primary-subtle);
  box-shadow: var(--shadow-card-hover);
}

.tech-item:hover .tech-icon {
  opacity: 1;
}

.tooltip {
  position: absolute;
  top: -34px;
  left: 50%;
  transform: translateX(-50%) translateY(6px);
  background-color: var(--primary);
  color: #ffffff;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 700;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all var(--transition-fast);
  pointer-events: none;
  box-shadow: var(--shadow-card);
  z-index: 20;
}

.tooltip::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid var(--primary);
}

.tech-item:hover .tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

@media (max-width: 768px) {
  .stack-grid {
    grid-template-columns: 1fr;
  }
}
</style>
