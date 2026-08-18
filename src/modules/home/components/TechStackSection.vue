<script setup>
import { useI18n } from 'vue-i18n'

defineProps({
  currentTheme: {
    type: String,
    default: 'dark'
  }
})

const { t } = useI18n()

const getAssetUrl = (name) => {
  return new URL(`../../../assets/techs/${name}`, import.meta.url).href
}

const stack = [
  { name: 'Vue.js', icon: 'vuedotjs.svg' },
  { name: 'JavaScript', icon: 'javascript.svg' },
  { name: 'Python', icon: 'python.svg' },
  { name: 'React', icon: 'react.svg' },
  { name: 'TypeScript', icon: 'typescript.svg' },
  { name: 'Node.js', icon: 'nodedotjs.svg' },
  { name: 'AWS', icon: 'aws.svg' },
  { name: 'PostgreSQL', icon: 'postgresql.svg' },
  { name: 'Angular', icon: 'angular.svg' },
  { name: 'Flask', icon: 'flask.svg' },
  { name: 'Flutter', icon: 'flutter.svg' },
  { name: 'Git', icon: 'git.svg' },
  { name: 'MongoDB', icon: 'mongodb.svg' },
  { name: 'MySQL', icon: 'mysql.svg' },
  { name: 'PHP', icon: 'php.svg' },
  { name: 'Redis', icon: 'redis.svg' },
  { name: 'Sass', icon: 'sass.svg' },
  { name: 'SQLite', icon: 'sqlite.svg' },
  { name: 'Tailwind CSS', icon: 'tailwindcss.svg' },
  { name: 'Vite', icon: 'vite.svg' },
  { name: 'Railway', icon: 'railway.svg' },
  { name: 'ExpressJS', icon: 'express.svg' },
  { name: 'NeonDB', icon: 'neon.svg' },
  { name: 'Nginx', icon: 'nginx.svg' },
  { name: 'Raspberry PI', icon: 'raspberrypi.svg' }
]
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
        <div
          v-for="tech in stack"
          :key="tech.name"
          class="tech-item"
        >
          <div class="icon-wrapper surface-card">
            <img
              :src="getAssetUrl(tech.icon)"
              :alt="tech.name"
              loading="lazy"
              class="tech-icon"
              :class="{ 'inverted-icon': currentTheme === 'dark' }"
            />
          </div>

          <span class="tooltip">{{ tech.name }}</span>
        </div>
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
  position: relative;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper {
  width: 100%;
  height: 100%;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  transition: transform var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast);
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
  transform: translateY(-4px) scale(1.08);
  border-color: var(--primary-border);
  box-shadow: var(--shadow-card-hover);
}

.tech-item:hover .tech-icon {
  opacity: 1;
}

.tooltip {
  position: absolute;
  top: -36px;
  left: 50%;
  transform: translateX(-50%) translateY(8px);
  background-color: var(--primary);
  color: #ffffff;
  padding: 4px 10px;
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
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid var(--primary);
}

.tech-item:hover .tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
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
