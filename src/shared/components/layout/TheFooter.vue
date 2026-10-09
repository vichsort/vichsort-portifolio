<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useClipboard } from '@vueuse/core'
import { ArrowUp, Check, Copy, Github, Linkedin, Mail, Send, SquareTerminal } from 'lucide-vue-next'
import { EMAIL, SOCIALS } from '@/core/config/profile'
import { NAV_ITEMS } from '@/core/router/pages'
import { useTheme } from '@/shared/composables/useTheme'
import { useAsciiField } from '@/shared/composables/useAsciiField'
import { NEON_TOKENS } from '@/shared/ascii/neonTokens'
import { createFloorLayer } from '@/shared/ascii/layers/floorLayer'
import { createCometsLayer, createStarsLayer } from '@/shared/ascii/layers/satellitesLayer'

// Altura reservada para a estrada; o piso do canvas usa exatamente esse espaço
const ROAD_HEIGHT = 140
// Tempo para o cometa do "voltar ao topo" aparecer antes da página começar a rolar
const LAUNCH_LEAD_MS = 350

const SOCIAL_ICONS = { github: Github, linkedin: Linkedin, telegram: Send }

const { t } = useI18n()
const { theme } = useTheme()
const { copy, copied } = useClipboard({ source: EMAIL, copiedDuring: 2000 })
const year = new Date().getFullYear()

const logoSrc = computed(() => {
  return theme.value === 'light'
    ? '/images/neat-logo-light.png'
    : '/images/neat-logo-dark.png'
})

let comets = null
const sceneCanvas = ref(null)
const { motion } = useAsciiField(sceneCanvas, {
  tokens: NEON_TOKENS,
  createLayers: () => {
    comets = createCometsLayer({ max: 3, chance: 0.05, skyRatio: 0.55 })
    return [
      createFloorLayer({ depthPx: ROAD_HEIGHT }),
      createStarsLayer({ density: 1 / 320 }),
      comets
    ]
  }
})

const backToTopButton = ref(null)

function backToTop() {
  if (!motion.value) {
    window.scrollTo({ top: 0, behavior: 'auto' })
    return
  }

  // Dispara um cometa subindo a partir do botão e só então rola a página
  const scene = sceneCanvas.value?.parentElement
  const button = backToTopButton.value
  if (scene && button) {
    const sceneRect = scene.getBoundingClientRect()
    const buttonRect = button.getBoundingClientRect()
    comets?.launch(buttonRect.left + buttonRect.width / 2 - sceneRect.left, buttonRect.top - sceneRect.top)
  }
  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), LAUNCH_LEAD_MS)
}
</script>

<template>
  <footer class="site-footer">
    <div class="footer-scene">
      <canvas ref="sceneCanvas" class="footer-field" aria-hidden="true"></canvas>

      <div class="footer-columns">
        <section class="footer-brand">
          <img :src="logoSrc" :alt="t('common.logo_alt')" class="footer-logo" data-ascii-safe />
          <router-link to="/" class="footer-name" data-ascii-safe>
            VITOR<span class="highlight">.</span>
          </router-link>
          <p class="footer-tagline" data-ascii-safe>{{ t('footer.tagline') }}</p>
        </section>

        <nav class="footer-col" :aria-label="t('footer.navigation')">
          <h2 class="footer-heading" data-ascii-safe>{{ t('footer.navigation') }}</h2>
          <ul class="footer-list">
            <li v-for="item in NAV_ITEMS" :key="item.path" data-ascii-safe>
              <router-link :to="item.path" class="footer-link">{{ t(item.labelKey) }}</router-link>
            </li>
          </ul>
        </nav>

        <section class="footer-col">
          <h2 class="footer-heading" data-ascii-safe>{{ t('footer.contact') }}</h2>
          <ul class="footer-list">
            <li class="footer-email" data-ascii-safe>
              <a :href="`mailto:${EMAIL}`" class="footer-link">
                <Mail :size="15" />
                <span>{{ EMAIL }}</span>
              </a>
              <button
                type="button"
                class="copy-btn"
                :aria-label="copied ? t('footer.copied') : t('footer.copy_email')"
                :title="copied ? t('footer.copied') : t('footer.copy_email')"
                @click="copy()"
              >
                <component :is="copied ? Check : Copy" :size="14" />
              </button>
            </li>
            <li v-for="social in SOCIALS" :key="social.id" data-ascii-safe>
              <a :href="social.url" target="_blank" rel="noopener noreferrer" class="footer-link">
                <component :is="SOCIAL_ICONS[social.id]" :size="15" />
                <span>{{ social.label }}</span>
                <span class="external-mark" aria-hidden="true">↗</span>
              </a>
            </li>
            <!-- n25: o terminal é outra forma de ver o site, não um canal de contato; fica separado -->
            <li class="footer-item-apart" data-ascii-safe>
              <router-link to="/terminal" class="footer-link footer-link-terminal">
                <SquareTerminal :size="15" />
                <span>{{ t('footer.terminal') }}</span>
              </router-link>
            </li>
          </ul>
        </section>
      </div>

      <div class="footer-road" :style="{ height: `${ROAD_HEIGHT}px` }" aria-hidden="true"></div>
    </div>

    <div class="footer-bar">
      <p class="footer-copy">{{ t('footer.rights', { year }) }}</p>
      <button ref="backToTopButton" type="button" class="back-to-top" @click="backToTop">
        <span>{{ t('footer.back_to_top') }}</span>
        <ArrowUp :size="15" />
      </button>
    </div>
  </footer>
</template>

<style scoped>
/* Degradê inverso ao do hero: a página começa e termina no roxo */
.site-footer {
  position: relative;
  background: linear-gradient(180deg, var(--bg-canvas) 0%, var(--hero-bg-top) 100%);
  border-top: 1px solid var(--border-subtle);
}

.footer-scene {
  position: relative;
  overflow: hidden;
}

/* Scanlines de CRT, como no hero: acima do canvas, abaixo do conteúdo */
.footer-scene::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0 2px,
    var(--hero-scanline) 2px 3px
  );
}

.footer-field {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.footer-columns {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1.4fr 1fr 1.2fr;
  gap: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-xl) var(--spacing-lg);
}

.footer-brand,
.footer-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.footer-logo {
  width: 72px;
  height: auto;
  display: block;
  margin-bottom: var(--spacing-sm);
}

.footer-name {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  letter-spacing: 0.5px;
  color: var(--text-primary);
  transition: opacity var(--transition-fast);
}

.footer-name:hover {
  opacity: 0.85;
}

.highlight {
  color: var(--primary);
}

.footer-tagline {
  margin-top: var(--spacing-xs);
  font-size: var(--text-sm);
  font-style: italic;
  color: var(--text-secondary);
}

.footer-heading {
  font-family: var(--font-heading);
  font-size: var(--text-sm);
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: var(--spacing-sm);
}

.footer-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  transition: color var(--transition-fast);
}

.footer-item-apart {
  align-self: stretch;
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-md);
  border-top: 1px dashed var(--border-medium);
}

.footer-link-terminal {
  font-family: var(--font-mono);
}

.footer-link:hover {
  color: var(--primary);
}

.external-mark {
  font-size: var(--text-xs);
  opacity: 0.6;
}

.footer-email {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.copy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  transition: color var(--transition-fast), background-color var(--transition-fast);
}

.copy-btn:hover {
  color: var(--primary);
  background-color: var(--primary-subtle);
}

.footer-bar {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-xl);
  border-top: 1px solid var(--border-subtle);
}

.footer-copy {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.back-to-top {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.85rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-medium);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-secondary);
  transition: color var(--transition-fast), border-color var(--transition-fast), background-color var(--transition-fast);
}

.back-to-top:hover {
  color: var(--text-on-primary);
  border-color: var(--primary);
  background-color: var(--primary);
}

@media (max-width: 768px) {
  .footer-columns {
    grid-template-columns: 1fr;
    padding: var(--spacing-lg) var(--spacing-md);
  }

  .footer-bar {
    padding: var(--spacing-md);
  }
}
</style>
