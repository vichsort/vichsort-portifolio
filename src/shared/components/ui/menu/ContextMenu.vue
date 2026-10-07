<script setup>
import { ref } from 'vue'
import ContextMenuPanel from './ContextMenuPanel.vue'

/**
 * Menu de contexto com gatilho: o slot fica dentro de um <button> que recebe
 * os atributos passados ao componente (class, aria-label...). O clique abre
 * e fecha; ↓ no gatilho também abre. O resto é do ContextMenuPanel.
 */
defineOptions({ inheritAttrs: false })

defineProps({
  items: { type: Array, required: true },
  // Lado preferido em relação ao gatilho (vira se não couber)
  placement: { type: String, default: 'bottom-start' },
  title: { type: String, default: '' }
})

const triggerEl = ref(null)
const isOpen = ref(false)

const onTriggerKeydown = (event) => {
  if (event.key !== 'ArrowDown' || isOpen.value) return
  event.preventDefault()
  isOpen.value = true
}
</script>

<template>
  <button
    ref="triggerEl"
    type="button"
    class="menu-trigger"
    v-bind="$attrs"
    aria-haspopup="menu"
    :aria-expanded="isOpen"
    @click="isOpen = !isOpen"
    @keydown="onTriggerKeydown"
  >
    <slot :open="isOpen" />
  </button>

  <ContextMenuPanel v-model:open="isOpen" :anchor="triggerEl" :items="items" :placement="placement" :title="title" />
</template>

<style scoped>
.menu-trigger {
  appearance: none;
  display: inline-flex;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  color: inherit;
  font: inherit;
  text-align: inherit;
  cursor: pointer;
  border-radius: var(--radius-sm);
}

.menu-trigger:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 3px;
}
</style>
