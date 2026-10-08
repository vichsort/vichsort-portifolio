<script setup>
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettings } from '@/shared/composables/useSettings'
import { Link, Share2, ArrowLeft, Check } from 'lucide-vue-next'

/**
 * O terminal no celular (≤ 768px, t13): no lugar do shell, que pede teclado
 * físico, um vídeo de uma sessão gravada e o convite para abrir no computador.
 *
 * O vídeo toca sozinho, mudo e em loop; com movimento reduzido fica parado,
 * com os controles. Compartilhar usa a folha nativa do celular quando existe;
 * senão, copia o link.
 */
const props = defineProps({
  // Na página /terminal (sem navbar) aparece o "Voltar ao site"
  showBack: { type: Boolean, default: false }
})

const emit = defineEmits(['back'])

const { t } = useI18n()
const { isMotionAllowed } = useSettings()

const base = import.meta.env.BASE_URL
const canShare = typeof navigator !== 'undefined' && !!navigator.share
const copied = ref(false)

// O Vue põe o muted como propriedade, não como atributo: alguns navegadores móveis
// só deixam o autoplay rodar com o vídeo mudo de fato, então garante e dá o play
const video = useTemplateRef('video')
onMounted(() => {
  if (!video.value) return
  video.value.muted = true
  if (isMotionAllowed.value) video.value.play().catch(() => {})
})

const terminalUrl = computed(() => new URL(`${base}terminal`, window.location.origin).href)
// O endereço aparece no texto: mesmo sem copiar, dá para ler e digitar no computador
const shownUrl = computed(() => terminalUrl.value.replace(/^https?:\/\//, ''))

async function share() {
  if (canShare) {
    try {
      await navigator.share({ title: 'VSH', url: terminalUrl.value })
    } catch {
      // Cancelado pelo usuário: nada a fazer
    }
    return
  }
  try {
    await navigator.clipboard.writeText(terminalUrl.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    // Sem permissão de área de transferência: o endereço continua visível no texto
  }
}
</script>

<template>
  <figure class="mobile-demo">
    <video
      ref="video"
      class="demo-video"
      :poster="`${base}videos/terminal-demo-poster.jpg`"
      :autoplay="isMotionAllowed"
      :controls="!isMotionAllowed"
      muted
      loop
      playsinline
      preload="metadata"
      :aria-label="t('terminal.mobile.video_label')"
    >
      <source :src="`${base}videos/terminal-demo.webm`" type="video/webm" />
      <source :src="`${base}videos/terminal-demo.mp4`" type="video/mp4" />
    </video>

    <figcaption class="demo-text">
      <strong class="demo-title">{{ t('terminal.mobile.title') }}</strong>
      <span>{{ t('terminal.mobile.text', { url: shownUrl }) }}</span>
    </figcaption>

    <div class="demo-actions">
      <button type="button" class="action-primary" @click="share">
        <Check v-if="copied" :size="16" />
        <Share2 v-else-if="canShare" :size="16" />
        <Link v-else :size="16" />
        <span>{{ t(copied ? 'terminal.mobile.copied' : canShare ? 'terminal.mobile.share' : 'terminal.mobile.copy') }}</span>
      </button>
      <button v-if="props.showBack" type="button" class="action-secondary" @click="emit('back')">
        <ArrowLeft :size="16" />
        <span>{{ t('terminal.mobile.back') }}</span>
      </button>
    </div>
  </figure>
</template>

<style scoped>
.mobile-demo {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin: 0;
  width: 100%;
}

.demo-video {
  display: block;
  width: 100%;
  aspect-ratio: 960 / 600;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--bg-canvas);
  object-fit: cover;
}

.demo-text {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: var(--text-sm);
  line-height: 1.6;
  color: var(--text-secondary);
}

.demo-title {
  font-size: var(--text-base);
  color: var(--text-primary);
}

.demo-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.action-primary,
.action-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 44px;
  padding: 0.6rem 1.25rem;
  border-radius: var(--radius-full);
  font: inherit;
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-primary {
  border: none;
  background: var(--primary);
  color: var(--text-on-primary);
}

.action-secondary {
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface-2);
  color: var(--text-primary);
}
</style>
