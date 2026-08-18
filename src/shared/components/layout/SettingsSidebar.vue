<script setup>
import { watch } from 'vue'
import { useScrollLock, onKeyStroke } from '@vueuse/core'
import { useSettings } from '@/shared/composables/useSettings'
import { useTheme } from '@/shared/composables/useTheme'
import { useI18n } from 'vue-i18n'
import { X, Sun, Moon, Minus, Plus } from 'lucide-vue-next'

const {
  isSidebarOpen,
  closeSidebar,
  currentLang,
  setLanguage,
  areAnimationsEnabled,
  toggleAnimations,
  changeFontSize,
  fontSizeLevel
} = useSettings()

const { theme, toggleTheme } = useTheme()

// Lock background scroll when drawer is open
const isLocked = useScrollLock(typeof document !== 'undefined' ? document.body : null)
watch(isSidebarOpen, (open) => {
  isLocked.value = open
})

// Close with ESC key
onKeyStroke('Escape', (e) => {
  if (isSidebarOpen.value) {
    e.preventDefault()
    closeSidebar()
  }
})

const languages = [
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' }
]

const { t } = useI18n()
</script>

<template>
  <teleport to="body">
    <transition name="slide-fade">
      <div
        v-if="isSidebarOpen"
        class="sidebar-overlay"
        @click.self="closeSidebar"
      >
        <aside class="sidebar-panel">
          <header class="sidebar-header">
            <h3 class="sidebar-title">Configs</h3>

            <button
              @click="closeSidebar"
              class="close-btn"
              :aria-label="t('settings.close_menu')"
            >
              <X :size="22" />
            </button>
          </header>

          <div class="sidebar-content">
            <!-- Appearance / Theme -->
            <div class="setting-group">
              <label class="group-label">{{ t('settings.appearance.label') }}</label>
              <button
                @click="toggleTheme"
                class="theme-toggle-btn"
                :class="theme"
              >
                <div class="theme-icon">
                  <Sun v-if="theme === 'light'" :size="18" />
                  <Moon v-else :size="18" />
                </div>
                <span>
                  {{ theme === 'dark' ? t('settings.appearance.dark') : t('settings.appearance.light') }}
                </span>
              </button>
            </div>

            <hr class="divider" />

            <!-- Language -->
            <div class="setting-group">
              <label class="group-label">{{ t('settings.language') }}</label>
              <div class="lang-grid">
                <button
                  v-for="lang in languages"
                  :key="lang.code"
                  @click="setLanguage(lang.code)"
                  class="lang-btn"
                  :class="{ active: currentLang === lang.code }"
                >
                  <span class="flag">{{ lang.flag }}</span>
                  <span class="lang-name">{{ lang.label }}</span>
                </button>
              </div>
            </div>

            <hr class="divider" />

            <!-- Accessibility -->
            <div class="setting-group">
              <label class="group-label">{{ t('settings.accessibility.label') }}</label>

              <div class="control-row">
                <span class="control-label">{{ t('settings.accessibility.font_size') }}</span>
                <div class="stepper">
                  <button
                    @click="changeFontSize('down')"
                    :disabled="fontSizeLevel <= -1"
                    aria-label="Diminuir fonte"
                  >
                    <Minus :size="14" />
                  </button>
                  <span class="stepper-value">
                    {{ fontSizeLevel > 0 ? '+' : '' }}{{ fontSizeLevel }}
                  </span>
                  <button
                    @click="changeFontSize('up')"
                    :disabled="fontSizeLevel >= 3"
                    aria-label="Aumentar fonte"
                  >
                    <Plus :size="14" />
                  </button>
                </div>
              </div>

              <div class="control-row">
                <span class="control-label">{{ t('settings.accessibility.animations') }}</span>
                <button
                  @click="toggleAnimations"
                  class="toggle-btn"
                  :class="{ active: areAnimationsEnabled }"
                >
                  {{ areAnimationsEnabled ? t('settings.accessibility.on') : t('settings.accessibility.off') }}
                </button>
              </div>
            </div>
          </div>

          <footer class="sidebar-footer">
            <p class="copyright">© 2026 <a>NEAT</a> by Vitor.</p>
          </footer>
        </aside>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.65);
  z-index: 9999;
  display: flex;
  justify-content: flex-end;
}

.sidebar-panel {
  width: 100%;
  max-width: 380px;
  height: 100%;
  background-color: var(--bg-surface-1);
  border-left: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  box-shadow: -10px 0 35px rgba(0, 0, 0, 0.4);
  padding: var(--spacing-md);
  position: relative;
  overflow: hidden;
  will-change: transform;
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
  padding: var(--spacing-md);
  flex: 1;
  overflow-y: auto;
}

.setting-group {
  margin-bottom: var(--spacing-lg);
}

.group-label {
  display: block;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted);
  margin-bottom: var(--spacing-sm);
}

.divider {
  border: 0;
  height: 1px;
  background-color: var(--border-subtle);
  margin: 0 0 var(--spacing-lg) 0;
}

.theme-toggle-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  background-color: var(--bg-surface-2);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
  font-size: var(--text-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.theme-toggle-btn:hover {
  border-color: var(--primary-border);
  background-color: var(--primary-subtle);
}

.theme-icon {
  color: var(--primary);
  display: flex;
  align-items: center;
}

.lang-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.lang-btn {
  background-color: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  padding: 0.75rem 0.5rem;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  transition: all var(--transition-fast);
}

.lang-btn:hover {
  border-color: var(--primary-border);
  color: var(--text-primary);
}

.lang-btn.active {
  background-color: var(--primary);
  color: #ffffff;
  border-color: var(--primary);
}

.flag {
  font-size: 1.25rem;
}

.lang-name {
  font-size: var(--text-xs);
  font-weight: 600;
}

.control-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.control-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.stepper {
  display: flex;
  align-items: center;
  background-color: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.stepper button {
  color: var(--text-primary);
  padding: 0.4rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--transition-fast);
}

.stepper button:hover:not(:disabled) {
  background-color: var(--primary-subtle);
  color: var(--primary);
}

.stepper button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.stepper-value {
  min-width: 28px;
  text-align: center;
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--text-primary);
}

.toggle-btn {
  background-color: var(--bg-surface-2);
  color: var(--text-muted);
  border: 1px solid var(--border-subtle);
  padding: 0.35rem 1rem;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.5px;
  transition: all var(--transition-fast);
}

.toggle-btn.active {
  background-color: var(--primary);
  border-color: var(--primary);
  color: #ffffff;
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

/* Transitions */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity var(--transition-base);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active .sidebar-panel {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-fade-leave-active .sidebar-panel {
  transition: transform 0.22s ease-in;
}

.slide-fade-enter-from .sidebar-panel,
.slide-fade-leave-to .sidebar-panel {
  transform: translate3d(100%, 0, 0);
}
</style>
