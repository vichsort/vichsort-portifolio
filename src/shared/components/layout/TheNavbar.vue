<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useScrollLock, onKeyStroke, useElementSize, useWindowSize } from '@vueuse/core'
import { useSmartScroll } from '@/shared/composables/useSmartScroll'
import { useSettings } from '@/shared/composables/useSettings'
import { useHeroPresence } from '@/shared/composables/useHeroPresence'
import { useI18n } from 'vue-i18n'
import { Github, Linkedin, Settings, Menu, X, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { getSocial } from '@/core/config/profile'
import { NAV_ITEMS, NAV_MORE_ITEMS } from '@/core/router/pages'

const route = useRoute()
const { t } = useI18n()
const { isVisible, isAtTop } = useSmartScroll()
const { toggleSidebar, fontSizeLevel } = useSettings()
const { isHeroActive } = useHeroPresence()

const isMobileNavOpen = ref(false)

const mobileItems = [...NAV_ITEMS, ...NAV_MORE_ITEMS]
const githubUrl = getSocial('github').url
const linkedinUrl = getSocial('linkedin').url

const toggleMobileNav = () => {
  isMobileNavOpen.value = !isMobileNavOpen.value
}

const closeMobileNav = () => {
  isMobileNavOpen.value = false
}

// Pílula do desktop em duas páginas: as abas principais e as demais (NAV_MORE_ITEMS).
// A seta troca de página e muda de lado; a pílula anima a largura entre as duas,
// centralizada. A página fora de vista fica absoluta e inerte, mas continua medida.
const navPages = [NAV_ITEMS, NAV_MORE_ITEMS]
// Aba ativa por prefixo: /projects/<id> marca Projetos (as rotas de detalhe são irmãs, não filhas)
const isUnder = (path, base) => path === base || (base !== '/' && path.startsWith(`${base}/`))
const isActive = (item) => isUnder(route.path, item.path)
const isMorePath = (path) => NAV_MORE_ITEMS.some((item) => isUnder(path, item.path))
const navPage = ref(isMorePath(route.path) ? 1 : 0)

const pageEls = [ref(null), ref(null)]
const pageSizes = pageEls.map((el) => useElementSize(el, undefined, { box: 'border-box' }))

// Sem medida ainda, a pílula fica com a largura natural da página em vista
const pillStyle = computed(() => {
  const width = pageSizes[navPage.value].width.value
  return width ? { width: `${width}px` } : {}
})

// Compacta (menu mobile) quando a pílula não cabe entre o logo e as ações: depende do
// idioma (em espanhol ela é bem mais larga) e do tamanho de fonte das configurações,
// não só da tela. A pílula continua medida mesmo escondida (ver .is-compact).
// 26.5rem = logo e redes (~16.5) + paddings do desktop (8) + folgas (2)
const MOBILE_BREAKPOINT = 860
const { width: viewportWidth } = useWindowSize()
const isCompact = computed(() => {
  void fontSizeLevel.value // recalcula quando o nível muda
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  const pill = pageSizes[0].width.value + 0.8 * rem
  return viewportWidth.value <= MOBILE_BREAKPOINT || pill + 26.5 * rem > viewportWidth.value
})
watch(isCompact, (compact) => {
  if (!compact) closeMobileNav()
})

// A seta some com a página: o foco passa para a seta da outra
const showNavPage = async (page) => {
  navPage.value = page
  await nextTick()
  pageEls[page].value?.querySelector('.nav-pill-arrow')?.focus()
}

// Lock background scroll when mobile menu is open
const isLocked = useScrollLock(typeof document !== 'undefined' ? document.body : null)
watch(isMobileNavOpen, (open) => {
  isLocked.value = open
})

// Auto close on route change; a pílula vai para a página da rota ativa
watch(() => route.path, (path) => {
  closeMobileNav()
  navPage.value = isMorePath(path) ? 1 : 0
})

// Close with Escape key
onKeyStroke('Escape', (e) => {
  if (isMobileNavOpen.value) {
    e.preventDefault()
    closeMobileNav()
  }
})
</script>

<template>
  <header
    class="smart-navbar"
    :class="{
      'hidden': !isVisible && !isMobileNavOpen,
      'scrolled': !isAtTop || isMobileNavOpen,
      'is-compact': isCompact,
      'on-hero': isHeroActive
    }"
  >
    <div class="navbar-container">
      <!-- Left: Brand Logo & Socials -->
      <div class="brand-group">
        <router-link to="/" class="brand-logo" :aria-label="t('nav.home')">
          <span class="brand-text">VITOR</span>
          <span class="brand-dot">.</span>
        </router-link>

        <div class="social-links desktop-only">
          <a
            :href="githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="icon-btn social-btn"
            aria-label="GitHub"
          >
            <Github :size="17" />
          </a>

          <a
            :href="linkedinUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="icon-btn social-btn"
            aria-label="LinkedIn"
          >
            <Linkedin :size="17" />
          </a>
        </div>
      </div>

      <!-- Center: Apple-style Desktop Nav Pill -->
      <nav class="desktop-nav" :aria-label="t('nav.main_label')" :inert="isCompact">
        <div class="nav-pill" :style="pillStyle">
          <ul
            v-for="(items, page) in navPages"
            :key="page"
            :ref="(el) => (pageEls[page].value = el)"
            class="nav-pill-list"
            :class="{ 'is-away': page !== navPage }"
            :inert="page !== navPage"
          >
            <li v-if="page === 1" class="nav-pill-arrow-item">
              <button
                type="button"
                class="nav-pill-arrow"
                :aria-label="t('nav.back')"
                :title="t('nav.back')"
                @click="showNavPage(0)"
              >
                <ChevronLeft :size="16" />
              </button>
            </li>
            <li v-for="item in items" :key="item.path">
              <router-link :to="item.path" class="nav-pill-link" :class="{ 'is-active': isActive(item) }">
                {{ t(item.labelKey) }}
              </router-link>
            </li>
            <li v-if="page === 0" class="nav-pill-arrow-item">
              <button
                type="button"
                class="nav-pill-arrow"
                :aria-label="t('nav.more')"
                :title="t('nav.more')"
                @click="showNavPage(1)"
              >
                <ChevronRight :size="16" />
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Right: Settings & Mobile Toggle -->
      <div class="actions-group">
        <button
          @click="toggleSidebar"
          class="icon-btn settings-btn"
          :aria-label="t('nav.settings')"
          :title="t('nav.settings')"
        >
          <Settings :size="19" />
        </button>

        <button
          @click="toggleMobileNav"
          class="icon-btn mobile-toggle-btn"
          :aria-label="isMobileNavOpen ? t('nav.close_menu') : t('nav.open_menu')"
          :aria-expanded="isMobileNavOpen"
        >
          <X v-if="isMobileNavOpen" :size="22" />
          <Menu v-else :size="22" />
        </button>
      </div>
    </div>

    <!-- Mobile Dropdown Navigation (Apple-style fluid sheet) -->
    <transition name="mobile-sheet">
      <div
        v-if="isMobileNavOpen"
        class="mobile-menu-overlay"
        @click.self="closeMobileNav"
      >
        <div class="mobile-menu-card">
          <ul class="mobile-nav-list">
            <li v-for="item in mobileItems" :key="item.path">
              <router-link
                :to="item.path"
                class="mobile-nav-link"
                :class="{ 'is-active': isActive(item) }"
                @click="closeMobileNav"
              >
                <span>{{ t(item.labelKey) }}</span>
                <span class="mobile-arrow">&rarr;</span>
              </router-link>
            </li>
          </ul>

          <div class="mobile-footer">
            <div class="mobile-socials">
              <a
                :href="githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="mobile-social-link"
                aria-label="GitHub"
              >
                <Github :size="18" />
                <span>GitHub</span>
              </a>

              <a
                :href="linkedinUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="mobile-social-link"
                aria-label="LinkedIn"
              >
                <Linkedin :size="18" />
                <span>LinkedIn</span>
              </a>
            </div>

            <p class="mobile-copyright">© 2026 NEAT by Vitor.</p>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.smart-navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 1.1rem var(--spacing-xl);
  transition: transform var(--transition-base),
              background-color var(--transition-base),
              border-color var(--transition-base),
              padding var(--transition-base),
              box-shadow var(--transition-base);
}

.smart-navbar.hidden {
  transform: translateY(-100%);
}

.smart-navbar.scrolled {
  background-color: var(--bg-surface-elevated);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-subtle);
  padding: 0.75rem var(--spacing-xl);
  box-shadow: var(--shadow-card);
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1300px;
  margin: 0 auto;
}

/* Brand Group */
.brand-group {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.brand-logo {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--text-primary);
  display: inline-flex;
  align-items: center;
  transition: opacity var(--transition-fast);
}

.brand-logo:hover {
  opacity: 0.85;
}

.brand-dot {
  color: var(--primary);
  font-weight: bold;
}

.social-links {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding-left: 0.85rem;
  border-left: 1px solid var(--border-subtle);
}

/* Apple-Style Navigation Pill */
.desktop-nav {
  display: flex;
  align-items: center;
}

.nav-pill {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  /* width (inline) é a da página em vista; o padding fica por fora */
  box-sizing: content-box;
  padding: 0.3rem 0.4rem;
  background-color: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: width 0.45s cubic-bezier(0.32, 0.72, 0, 1);
}

/* max-content: a medida é a mesma dentro ou fora do fluxo */
.nav-pill-list {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  width: max-content;
  flex-shrink: 0;
  transition: opacity 0.25s ease 0.12s, visibility 0s;
}

.nav-pill-list.is-away {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s ease, visibility 0s 0.15s;
}

.nav-pill-arrow-item {
  display: flex;
}

.nav-pill-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-block: -0.4rem;
  padding: 0.4rem 0.45rem;
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  transition: color var(--transition-fast), background-color var(--transition-fast);
}

.nav-pill-arrow:hover {
  color: var(--text-primary);
  background-color: var(--primary-subtle);
}

.nav-pill-link {
  /* inline-block para o ::before do item ativo ficar sobre o fundo do link;
     a margem negativa anula o padding vertical na altura, como no modo inline */
  display: inline-block;
  margin-block: -0.4rem;
  font-size: var(--text-menu);
  font-weight: 600;
  letter-spacing: 0.4px;
  color: var(--text-secondary);
  padding: 0.4rem 0.95rem;
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.nav-pill-link:hover {
  color: var(--text-primary);
  background-color: var(--primary-subtle);
}

.nav-pill-link.is-active {
  color: var(--text-on-primary);
  background-color: var(--primary);
  box-shadow: 0 2px 10px var(--primary-glow);
}

/* --------------------------------------------------------------------------
   Sobre o hero: o item ativo passeia entre as cores neon do hero, uma de
   cada vez (A -> B -> C -> A), com ease-in-out em cada passagem.
   A cor fica num ::before para o fade de entrada/saída do hero ser suave
   sem disputar com a animação.
   -------------------------------------------------------------------------- */
.nav-pill-link.is-active,
.mobile-nav-link.is-active {
  position: relative;
  isolation: isolate;
}

.nav-pill-link.is-active::before,
.mobile-nav-link.is-active::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background-color: var(--neon-pink);
  opacity: 0;
  transition: opacity 0.6s ease;
  animation: hero-pill-cycle 6s ease-in-out infinite;
}

.on-hero .nav-pill-link.is-active,
.on-hero .mobile-nav-link.is-active {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
  animation: hero-pill-glow 6s ease-in-out infinite;
}

.on-hero .nav-pill-link.is-active::before,
.on-hero .mobile-nav-link.is-active::before {
  opacity: 1;
}

/* Mesma sequência e ritmo nas duas animações: o brilho acompanha a cor */
@keyframes hero-pill-cycle {
  0%, 100% { background-color: var(--neon-pink); }
  33.333% { background-color: var(--neon-magenta); }
  66.666% { background-color: var(--neon-cyan); }
}

@keyframes hero-pill-glow {
  0%, 100% { box-shadow: 0 2px 14px var(--neon-pink); }
  33.333% { box-shadow: 0 2px 14px var(--neon-magenta); }
  66.666% { box-shadow: 0 2px 14px var(--neon-cyan); }
}

@media (prefers-reduced-motion: reduce) {
  .nav-pill-link.is-active::before,
  .mobile-nav-link.is-active::before,
  .on-hero .nav-pill-link.is-active,
  .on-hero .mobile-nav-link.is-active {
    animation: none;
  }
}

/* Actions Group */
.actions-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  transform: translateY(-1px);
}

.settings-btn:hover {
  transform: rotate(30deg);
}

.mobile-toggle-btn {
  display: none;
  color: var(--text-primary);
}

/* Mobile Dropdown Sheet */
.mobile-menu-overlay {
  position: fixed;
  top: 100%;
  left: 0;
  width: 100%;
  min-height: calc(100vh - 65px);
  background-color: rgba(0, 0, 0, 0.65);
  z-index: 999;
  padding: var(--spacing-sm) var(--spacing-md) var(--spacing-xl) var(--spacing-md);
  display: flex;
  flex-direction: column;
}

.mobile-menu-card {
  background-color: var(--bg-surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  will-change: transform, opacity;
}

.mobile-nav-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.mobile-nav-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1rem;
  border-radius: var(--radius-md);
  font-family: var(--font-heading);
  font-size: var(--text-base);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all var(--transition-fast);
}

.mobile-nav-link:hover {
  color: var(--text-primary);
  background-color: var(--bg-surface-2);
  padding-left: 1.25rem;
}

.mobile-nav-link.is-active {
  color: var(--text-on-primary);
  background-color: var(--primary);
}

.mobile-arrow {
  opacity: 0.6;
  font-size: var(--text-base);
}

.mobile-footer {
  border-top: 1px solid var(--border-subtle);
  padding-top: var(--spacing-sm);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.mobile-socials {
  display: flex;
  gap: var(--spacing-md);
}

.mobile-social-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: var(--text-xs);
  color: var(--text-secondary);
  padding: 0.4rem 0.6rem;
  border-radius: var(--radius-sm);
  background-color: var(--bg-surface-2);
  transition: all var(--transition-fast);
}

.mobile-social-link:hover {
  color: var(--primary);
}

.mobile-copyright {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

/* Transitions */
.mobile-sheet-enter-active,
.mobile-sheet-leave-active {
  transition: opacity var(--transition-fast);
}

.mobile-sheet-enter-active .mobile-menu-card {
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.28s ease;
}

.mobile-sheet-leave-active .mobile-menu-card {
  transition: transform 0.2s ease-in, opacity 0.2s ease;
}

.mobile-sheet-enter-from,
.mobile-sheet-leave-to {
  opacity: 0;
}

.mobile-sheet-enter-from .mobile-menu-card {
  transform: translate3d(0, -16px, 0);
  opacity: 0;
}

.mobile-sheet-leave-to .mobile-menu-card {
  transform: translate3d(0, -16px, 0);
  opacity: 0;
}

/* Responsive Breakpoints */
/* Compacta: decidido no script (isCompact), não por largura fixa. A pílula
   sai de vista mas segue no layout, para a medida dela continuar valendo. */
.is-compact .desktop-only {
  display: none !important;
}

.is-compact .desktop-nav {
  position: absolute;
  visibility: hidden;
  pointer-events: none;
}

.is-compact .mobile-toggle-btn {
  display: flex;
}

.smart-navbar.is-compact {
  padding: 0.9rem var(--spacing-md);
}

.smart-navbar.is-compact.scrolled {
  padding: 0.75rem var(--spacing-md);
}
</style>
