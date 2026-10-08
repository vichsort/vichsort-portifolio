<script setup>
import { useI18n } from 'vue-i18n'
import { useNodeMenu } from '@/core/content/useNodeMenu'
import ContextMenu from '@/shared/components/ui/menu/ContextMenu.vue'

/**
 * Menu de um nó do grafo (n4/n5): o slot é o gatilho e as opções são quem
 * aponta para o nó (projetos, pesquisas, certificados...).
 *
 * Uso: <NodeMenu id="vue" placement="bottom" class="..."><img ... /></NodeMenu>
 * Atributos (class, aria-label) vão para o botão do gatilho.
 * Sem nenhuma opção, o slot aparece sozinho, sem botão.
 */
defineOptions({ inheritAttrs: false })

const props = defineProps({
  id: { type: String, required: true },
  // Tipos e ordem dos grupos; o padrão é NODE_MENU_TYPES (core/content/nodeMenu.ts)
  types: { type: Array, default: undefined },
  placement: { type: String, default: 'bottom-start' },
  // Nós que não entram no menu (ex.: a página em que o menu está)
  exclude: { type: Array, default: () => [] }
})

const { t } = useI18n()
const items = useNodeMenu(() => props.id, { types: props.types, exclude: () => props.exclude })
</script>

<template>
  <ContextMenu v-if="items.length" :items="items" :placement="placement" :title="t('node_menu.title')" v-bind="$attrs">
    <template #default="slotProps"><slot v-bind="slotProps" /></template>
  </ContextMenu>
  <slot v-else :open="false" />
</template>
