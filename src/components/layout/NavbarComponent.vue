<script setup>
import { useSmartScroll } from '@/composables/useSmartScroll'
import { useSettings } from '@/composables/useSettings'
import { useNavigation } from '@/composables/useNavigation'

const { isVisible, isAtTop } = useSmartScroll()
const { toggleSidebar } = useSettings()
const { toggleNav } = useNavigation()
</script>

<template>
  <nav class="smart-navbar" :class="{ 'hidden': !isVisible, 'scrolled': !isAtTop }">
    <div class="navbar-content">

      <div class="left-group">
        <a href="https://github.com" target="_blank" class="icon-btn social-icon" aria-label="GitHub">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path
              d="M15 22v-4a4.8 5 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0 3 1.5-2.64-.5-5.36.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
        </a>

        <a href="https://linkedin.com" target="_blank" class="icon-btn social-icon" aria-label="LinkedIn">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect width="4" height="12" x="2" y="9" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </a>

        <span class="mini-logo" v-if="!isAtTop">VITOR.</span>
      </div>

      <div class="right-group">

        <button @click="toggleSidebar" class="icon-btn" aria-label="Configurações">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z">
            </path>
          </svg>
        </button>

        <button @click="toggleNav" class="icon-btn burger-btn" aria-label="Menu de Navegação">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
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
  padding: 1rem var(--spacing-xl);
  transition: transform 0.3s ease, background-color 0.3s ease, padding 0.3s ease;
}

.smart-navbar.hidden {
  transform: translateY(-100%);
}

.smart-navbar.scrolled {
  background-color: var(--background);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0.8rem var(--spacing-xl);
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-group,
.right-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-btn {
  background: none;
  border: none;
  color: var(--icon-color);
  cursor: pointer;
  transition: color 0.2s, transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
}

.icon-btn:hover {
  color: var(--primary);
  transform: translateY(-2px);
}

.burger-btn {
  transform: scale(1.1);
  margin-left: 0.5rem;
}

.mini-logo {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--text);
  margin-left: 1rem;
  animation: fadeIn 0.5s ease;
  border-left: 2px solid var(--accent);
  padding-left: 1rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .smart-navbar {
    padding: 1rem var(--spacing-md);
  }

  .mini-logo {
    display: none;
  }
}
</style>