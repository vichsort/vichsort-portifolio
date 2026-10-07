<script setup>
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

/**
 * Um nível do menu de contexto: só desenha as linhas e avisa o que aconteceu.
 * Quem decide abrir submenu, travar ou fechar é o ContextMenu.
 *
 * Linha (item):
 *   { key, label, to?, children?, separator?, back? }
 *   to: link (router-link) · children: abre submenu · back: volta um nível (mobile)
 *   sem to nem children: só informativa, em cinza (ex.: techs relacionadas)
 *   separator: linha fina antes do item
 */
defineProps({
  items: { type: Array, required: true },
  // Título no topo do nível, numa cor de destaque (ex.: "Ações"); não é uma linha do menu
  title: { type: String, default: '' },
  // key do grupo com submenu aberto (fica destacado, como no macOS)
  activeKey: { type: String, default: null }
})

const emit = defineEmits(['enter', 'activate', 'select'])

const kindOf = (item) => {
  if (item.back) return 'back'
  if (item.children) return 'group'
  if (item.to) return 'link'
  return 'info'
}
</script>

<template>
  <div class="menu-list" role="menu" :aria-label="title || undefined">
    <div v-if="title" class="menu-title" aria-hidden="true">{{ title }}</div>

    <template v-for="item in items" :key="item.key">
      <div v-if="item.separator" class="menu-separator" role="separator"></div>

      <router-link
        v-if="kindOf(item) === 'link'"
        :to="item.to"
        class="menu-item"
        role="menuitem"
        tabindex="-1"
        :title="item.label"
        @mouseenter="emit('enter', item, $event.currentTarget)"
        @click="emit('select', item)"
      >
        <span class="menu-label">{{ item.label }}</span>
      </router-link>

      <button
        v-else-if="kindOf(item) === 'group'"
        type="button"
        class="menu-item"
        :class="{ 'is-open': activeKey === item.key }"
        role="menuitem"
        tabindex="-1"
        aria-haspopup="menu"
        :aria-expanded="activeKey === item.key"
        :data-key="item.key"
        @mouseenter="emit('enter', item, $event.currentTarget)"
        @click="emit('activate', item, $event.currentTarget, $event)"
      >
        <span class="menu-label">{{ item.label }}</span>
        <ChevronRight :size="14" class="menu-chevron" aria-hidden="true" />
      </button>

      <button
        v-else-if="kindOf(item) === 'back'"
        type="button"
        class="menu-item menu-back"
        role="menuitem"
        tabindex="-1"
        @mouseenter="emit('enter', item, $event.currentTarget)"
        @click="emit('activate', item, $event.currentTarget, $event)"
      >
        <ChevronLeft :size="14" class="menu-chevron" aria-hidden="true" />
        <span class="menu-label">{{ item.label }}</span>
      </button>

      <div
        v-else
        class="menu-item is-info"
        role="menuitem"
        tabindex="-1"
        aria-disabled="true"
        :title="item.label"
        @mouseenter="emit('enter', item, $event.currentTarget)"
      >
        <span class="menu-label">{{ item.label }}</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.menu-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.menu-title {
  padding: 0.4rem 0.7rem 0.3rem;
  color: var(--menu-title);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  user-select: none;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  min-height: 2rem;
  padding: 0.35rem 0.7rem;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-primary);
  font: inherit;
  text-align: left;
  text-decoration: none;
  cursor: default;
  outline: none;
  user-select: none;
}

/* Linha destacada: mouse, teclado ou grupo com submenu aberto (fundo sutil, texto mantém a cor) */
.menu-item:not(.is-info):hover,
.menu-item:not(.is-info):focus-visible,
.menu-item.is-open {
  background-color: var(--menu-active);
}

.menu-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-chevron {
  flex-shrink: 0;
  margin-right: -0.2rem;
  opacity: 0.6;
}

.menu-item:hover .menu-chevron,
.menu-item:focus-visible .menu-chevron,
.menu-item.is-open .menu-chevron {
  opacity: 1;
}

.menu-back {
  color: var(--text-secondary);
}

.menu-back .menu-chevron {
  margin: 0 0 0 -0.2rem;
}

.is-info {
  color: var(--text-muted);
}

.is-info:focus-visible {
  box-shadow: inset 0 0 0 1px var(--menu-separator);
}

.menu-separator {
  height: 1px;
  margin: 0.25rem 0.7rem;
  background-color: var(--menu-separator);
}
</style>
