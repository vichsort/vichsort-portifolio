<script setup>
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNodeMenu } from '@/core/content/useNodeMenu'
import { useNodeMenuHost } from '@/shared/composables/useNodeMenuHost'
import ContextMenuPanel from '@/shared/components/ui/menu/ContextMenuPanel.vue'

/**
 * Menu de nó dos wikilinks no HTML renderizado (n10), montado uma vez no App.vue.
 * Trocar de nome com o menu aberto recria o painel (key), que abre de novo
 * a partir do novo gatilho.
 */
const { nodeId, sourceId, anchor, isOpen, session, close } = useNodeMenuHost()

// Trocar o idioma refaz o HTML do texto: o botão em que o menu se ancorava some
const { t, locale } = useI18n()
watch(locale, close)

// O nó da página em que o texto está não aparece no próprio menu
const items = useNodeMenu(() => nodeId.value || '', {
  exclude: () => (sourceId.value ? [sourceId.value] : [])
})

// Outros gatilhos de texto não contam como clique fora: o clique neles troca o menu
const IGNORE = ['[data-node]']
</script>

<template>
  <ContextMenuPanel
    v-if="anchor && items.length"
    :key="session"
    v-model:open="isOpen"
    :anchor="anchor"
    :items="items"
    :ignore="IGNORE"
    :title="t('node_menu.title')"
  />
</template>
