<script setup>
import { useNavigation } from '@/composables/useNavigation'
import { useI18n } from 'vue-i18n'
import { X } from 'lucide-vue-next'

const { isNavOpen, closeNav } = useNavigation()
const { t } = useI18n()

const menuItems = [
  { labelKey: 'nav.home', path: '/' },
  { labelKey: 'nav.about', path: '/overview' },
  { labelKey: 'nav.projects', path: '/projects' },
  { labelKey: 'nav.researches', path: '/researches' },
  { labelKey: 'nav.certifications', path: '/certifications' },
  { labelKey: 'nav.contact', path: '/contact' }
]
</script>

<template>
  <teleport to="body">
    <transition name="slide-right">
      <div
        v-if="isNavOpen"
        class="nav-overlay"
        @click.self="closeNav"
      >
        <aside class="sidebar-panel glass-panel">
          <header class="sidebar-header">
            <span class="sidebar-title">Menu</span>
            <button
              @click="closeNav"
              class="close-btn"
              aria-label="Fechar Menu"
            >
              <X :size="24" />
            </button>
          </header>

          <nav class="sidebar-content">
            <ul class="links-group">
              <li
                v-for="(item, index) in menuItems"
                :key="item.path"
                :style="{ '--delay': `${index * 0.08}s` }"
              >
                <router-link :to="item.path" class="nav-item">
                  <span class="item-text">{{ t(item.labelKey) }}</span>
                  <span class="item-indicator">&rarr;</span>
                </router-link>
              </li>
            </ul>
          </nav>

          <footer class="sidebar-footer">
            <p class="copyright">© 2026 <a>NEAT</a> by Vitor.</p>
          </footer>
        </aside>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.nav-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  justify-content: flex-end;
}

.sidebar-panel {
  width: 100%;
  max-width: 380px;
  height: 100%;
  background-color: var(--bg-surface-elevated);
  border-left: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
  padding: var(--spacing-md);
  position: relative;
  overflow: hidden;
}

.sidebar-header {
  padding: var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-subtle);
}

.sidebar-title {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  color: var(--text-primary);
  letter-spacing: 0.5px;
}

.close-btn {
  color: var(--text-secondary);
  padding: 0.4rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.close-btn:hover {
  color: var(--primary);
  background-color: var(--primary-subtle);
  transform: rotate(90deg);
}

.sidebar-content {
  padding: var(--spacing-lg) var(--spacing-md);
  flex: 1;
  overflow-y: auto;
}

.links-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.nav-item {
  position: relative;
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  color: var(--text-secondary);
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  transition: all var(--transition-fast);
  opacity: 0;
  animation: slideInItem 0.4s ease forwards;
  animation-delay: var(--delay);
}

.item-indicator {
  opacity: 0;
  transform: translateX(-10px);
  color: var(--primary);
  transition: all var(--transition-fast);
}

.nav-item:hover {
  color: var(--text-primary);
  background-color: var(--bg-surface-2);
  border-color: var(--border-subtle);
  padding-left: 1.25rem;
}

.nav-item:hover .item-indicator {
  opacity: 1;
  transform: translateX(0);
}

.router-link-active {
  color: var(--text-primary);
  background-color: var(--primary-subtle);
  border-color: var(--primary-border);
}

.router-link-active .item-indicator {
  opacity: 1;
  transform: translateX(0);
}

.sidebar-footer {
  margin-top: auto;
  border-top: 1px solid var(--border-subtle);
  padding-top: var(--spacing-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.copyright a {
  font-weight: bold;
  color: var(--accent);
}

@keyframes slideInItem {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: opacity var(--transition-base);
}

.slide-right-enter-from,
.slide-right-leave-to {
  opacity: 0;
}

.slide-right-enter-active .sidebar-panel {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-right-leave-active .sidebar-panel {
  transition: transform 0.25s ease-in;
}

.slide-right-enter-from .sidebar-panel,
.slide-right-leave-to .sidebar-panel {
  transform: translateX(100%);
}
</style>