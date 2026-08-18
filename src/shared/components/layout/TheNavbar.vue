<script setup>
import { useSmartScroll } from '@/shared/composables/useSmartScroll'
import { useSettings } from '@/shared/composables/useSettings'
import { useNavigation } from '@/shared/composables/useNavigation'
import { Github, Linkedin, Settings, Menu } from 'lucide-vue-next'

const { isVisible, isAtTop } = useSmartScroll()
const { toggleSidebar } = useSettings()
const { toggleNav } = useNavigation()
</script>

<template>
  <nav
    class="smart-navbar"
    :class="{ 'hidden': !isVisible, 'scrolled': !isAtTop }"
  >
    <div class="navbar-content">
      <div class="left-group">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          class="icon-btn social-icon"
          aria-label="GitHub"
        >
          <Github :size="20" />
        </a>

        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          class="icon-btn social-icon"
          aria-label="LinkedIn"
        >
          <Linkedin :size="20" />
        </a>

        <transition name="fade">
          <router-link to="/" class="mini-logo" v-if="!isAtTop">
            VITOR.
          </router-link>
        </transition>
      </div>

      <div class="right-group">
        <button
          @click="toggleSidebar"
          class="icon-btn"
          aria-label="Configurações"
        >
          <Settings :size="20" />
        </button>

        <button
          @click="toggleNav"
          class="icon-btn burger-btn"
          aria-label="Menu de Navegação"
        >
          <Menu :size="24" />
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.smart-navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 1.25rem var(--spacing-xl);
  transition: transform var(--transition-base),
              background-color var(--transition-base),
              padding var(--transition-base),
              backdrop-filter var(--transition-base);
}

.smart-navbar.hidden {
  transform: translateY(-100%);
}

.smart-navbar.scrolled {
  background-color: var(--bg-surface-elevated);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-subtle);
  padding: 0.75rem var(--spacing-xl);
  box-shadow: var(--shadow-card);
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.left-group,
.right-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.icon-btn {
  color: var(--text-secondary);
  padding: 0.5rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.icon-btn:hover {
  color: var(--primary);
  background-color: var(--primary-subtle);
  transform: translateY(-2px);
}

.burger-btn {
  color: var(--text-primary);
}

.mini-logo {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  color: var(--text-primary);
  margin-left: 0.75rem;
  border-left: 2px solid var(--accent);
  padding-left: 0.75rem;
  letter-spacing: -0.5px;
  text-decoration: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

@media (max-width: 768px) {
  .smart-navbar {
    padding: 1rem var(--spacing-md);
  }

  .smart-navbar.scrolled {
    padding: 0.75rem var(--spacing-md);
  }

  .mini-logo {
    display: none;
  }
}
</style>
