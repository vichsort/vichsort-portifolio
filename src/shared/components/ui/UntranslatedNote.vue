<script setup>
import { useI18n } from 'vue-i18n'
import { Languages } from 'lucide-vue-next'

// Idioma em que o texto está sendo mostrado no lugar do idioma ativo (ver useContent().fallback)
defineProps({
  lang: { type: String, default: null }
})

const { t } = useI18n()
</script>

<template>
  <span v-if="lang" class="untranslated-note" :lang="lang">
    <Languages :size="12" aria-hidden="true" />
    {{ t('common.untranslated', { lang: t(`languages.${lang}`) }) }}
  </span>
</template>

<style scoped>
.untranslated-note {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  width: fit-content;
  padding: 0.15rem 0.55rem;
  font-size: var(--text-xs);
  color: var(--text-muted);
  border: 1px dashed var(--border-medium);
  border-radius: var(--radius-full);
}
</style>
