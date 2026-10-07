<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { onClickOutside, useMediaQuery } from '@vueuse/core'
import MenuList from './MenuList.vue'
import { useMenuState } from './useMenuState'
import { useMenuPosition } from './useMenuPosition'
import { useSubmenuAim } from './useSubmenuAim'
import { useMenuKeyboard, focusFirst } from './useMenuKeyboard'

/**
 * Painel do menu de contexto no estilo do macOS, sem gatilho próprio: abre
 * ancorado em qualquer elemento (anchor). Genérico: recebe uma árvore de itens
 * (formato em MenuList.vue) e não sabe de onde ela veio.
 *
 * Passar o mouse num grupo abre o submenu ao lado, e o clique no grupo o trava
 * aberto. Em telas pequenas, o submenu desliza para dentro do próprio menu,
 * com uma linha para voltar. Os painéis vão para o <body>, para não serem
 * cortados por overflow.
 *
 * Quem usa controla a abertura com v-model:open; o painel avisa quando fecha
 * sozinho (Esc, clique fora, troca de rota, outro menu aberto) e devolve o
 * foco à âncora quando fechado pelo teclado.
 *
 * Usado pelo ContextMenu (gatilho em <button>) e pelo NodeMenuHost
 * (gatilhos dentro de HTML renderizado).
 */
const props = defineProps({
  // Elemento em que o menu se ancora
  anchor: { type: Object, default: null },
  items: { type: Array, required: true },
  open: { type: Boolean, default: false },
  // Lado preferido em relação à âncora (vira se não couber)
  placement: { type: String, default: 'bottom-start' },
  // Título do primeiro nível (ex.: "Ações"); os submenus não têm
  title: { type: String, default: '' },
  // Cliques nesses elementos (refs ou seletores) não contam como "fora"
  ignore: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:open'])

const { t } = useI18n()
const route = useRoute()

const anchorEl = computed(() => props.anchor)
const rootEl = ref(null)
const submenuEl = ref(null)
const submenuAnchor = ref(null)

const state = useMenuState()
const drill = useMediaQuery('(max-width: 640px)')

const openGroup = computed(() =>
  props.items.find((item) => item.children && item.key === state.submenu.value) || null
)

// Painel lateral só no desktop; no mobile o grupo abre dentro do painel raiz
const showSubmenu = computed(() => state.isOpen.value && !!openGroup.value && !drill.value)

const rootItems = computed(() => {
  if (!drill.value || !openGroup.value) return props.items
  return [{ key: '__back', label: t('common.back'), back: true }, ...openGroup.value.children]
})

const root = useMenuPosition(anchorEl, rootEl, { placement: props.placement, offset: 8, open: state.isOpen })
const submenu = useMenuPosition(submenuAnchor, submenuEl, {
  placement: 'right-start',
  // Encosta no menu e alinha a primeira linha do submenu com a linha do grupo
  offset: { mainAxis: 6, crossAxis: -5 },
  open: showSubmenu
})

const aim = useSubmenuAim(submenuEl)

// Direção da troca de nível no mobile: entrando (→) ou voltando (←)
const drillDirection = ref('forward')

// No mobile o nível novo só existe no fim da transição (out-in): o foco espera por ela
let pendingFocus = null

const focusLater = async (fn) => {
  if (drill.value) {
    pendingFocus = fn
    return
  }
  await nextTick()
  fn()
}

const onDrillEntered = () => {
  pendingFocus?.()
  pendingFocus = null
}

/* ---------- abrir e fechar ---------- */

const openMenu = async () => {
  state.open()
  await nextTick()
  focusFirst(rootEl.value)
}

const closeMenu = ({ restoreFocus = true } = {}) => {
  aim.cancel()
  state.close()
  if (restoreFocus) props.anchor?.focus({ preventScroll: true })
}

watch(
  () => props.open,
  (open) => (open ? openMenu() : closeMenu({ restoreFocus: false })),
  { immediate: true }
)

// Fechou por dentro (ou porque outro menu abriu): avisa quem controla
watch(state.isOpen, (open) => {
  if (open) return
  submenuAnchor.value = null
  if (props.open) emit('update:open', false)
})

onClickOutside(rootEl, () => closeMenu({ restoreFocus: false }), {
  ignore: computed(() => [anchorEl, submenuEl, ...props.ignore])
})

watch(() => route.fullPath, () => closeMenu({ restoreFocus: false }))

onBeforeUnmount(() => state.close())

/* ---------- submenu ---------- */

const openSubmenu = (item, anchor, { lock = false, focus = false } = {}) => {
  submenuAnchor.value = anchor
  drillDirection.value = 'forward'
  // 'toggle': clique no grupo (trava, ou destrava se já travado); true: teclado, sempre trava
  if (lock === 'toggle') state.clickSubmenu(item.key)
  else state.openSubmenu(item.key, { lock })
  if (focus) focusLater(() => focusFirst(drill.value ? rootEl.value : submenuEl.value))
}

const closeSubmenu = ({ focusGroup = false } = {}) => {
  const key = state.submenu.value
  drillDirection.value = 'back'
  state.closeSubmenu()
  if (focusGroup) {
    focusLater(() => rootEl.value?.querySelector(`[data-key="${key}"]`)?.focus({ preventScroll: true }))
  }
}

/* ---------- mouse ---------- */

const onRootEnter = (item, el) => {
  el.focus({ preventScroll: true })
  if (drill.value || state.locked.value) return
  aim.defer(() => {
    if (item.children) openSubmenu(item, el)
    else state.closeSubmenu()
  })
}

const onRootActivate = (item, el, event) => {
  // Enter/Espaço também chegam como clique, mas com detail 0
  const byKeyboard = event?.detail === 0
  aim.cancel()

  if (item.back) {
    closeSubmenu({ focusGroup: byKeyboard })
  } else {
    openSubmenu(item, el, { lock: 'toggle', focus: drill.value && byKeyboard })
  }

  // No mobile a linha clicada some com a troca de nível: o foco fica no painel
  // (para Esc e as setas), sem destacar nenhuma linha
  if (drill.value && !byKeyboard) focusLater(() => rootEl.value?.focus({ preventScroll: true }))
}

const onSubmenuEnter = (item, el) => {
  aim.cancel()
  el.focus({ preventScroll: true })
}

const onSelect = () => closeMenu({ restoreFocus: false })

/* ---------- teclado ---------- */

const onRootKeydown = useMenuKeyboard({
  onRight: (el) => {
    const item = props.items.find((i) => i.children && i.key === el?.dataset.key)
    if (!item) return false
    openSubmenu(item, el, { lock: true, focus: true })
    return true
  },
  onLeft: () => {
    if (!drill.value || !openGroup.value) return false
    closeSubmenu({ focusGroup: true })
    return true
  },
  onEscape: () => (drill.value && openGroup.value ? closeSubmenu({ focusGroup: true }) : closeMenu()),
  onTab: () => closeMenu({ restoreFocus: false })
})

const onSubmenuKeydown = useMenuKeyboard({
  onLeft: () => {
    closeSubmenu({ focusGroup: true })
    return true
  },
  onEscape: () => closeSubmenu({ focusGroup: true }),
  onTab: () => closeMenu({ restoreFocus: false })
})
</script>

<template>
  <Teleport to="body">
    <Transition name="menu-pop">
      <div
        v-if="state.isOpen.value"
        ref="rootEl"
        class="menu-panel"
        tabindex="-1"
        :data-side="root.side.value"
        :style="root.floatingStyles.value"
        @mousemove="aim.track"
        @keydown="onRootKeydown"
      >
        <Transition :name="`menu-drill-${drillDirection}`" mode="out-in" @after-enter="onDrillEntered">
          <MenuList
            :key="drill && openGroup ? openGroup.key : '__root'"
            :items="rootItems"
            :title="drill && openGroup ? '' : title"
            :active-key="drill ? null : state.submenu.value"
            @enter="onRootEnter"
            @activate="onRootActivate"
            @select="onSelect"
          />
        </Transition>
      </div>
    </Transition>

    <Transition name="menu-sub">
      <div
        v-if="showSubmenu"
        ref="submenuEl"
        class="menu-panel"
        :data-side="submenu.side.value"
        :style="submenu.floatingStyles.value"
        @keydown="onSubmenuKeydown"
      >
        <MenuList :items="openGroup.children" @enter="onSubmenuEnter" @select="onSelect" />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Painel no estilo do macOS: translúcido, cantos de 10px, sombra difusa */
.menu-panel {
  z-index: var(--z-menu);
  min-width: 13rem;
  max-width: min(20rem, calc(100vw - 16px));
  padding: 5px;
  border: 1px solid var(--menu-border);
  border-radius: 10px;
  background-color: var(--menu-bg);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  box-shadow: var(--menu-shadow);
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 500;
  overflow: hidden;
  outline: none;
}

/* Abrir: desce a partir do gatilho, ou sobe quando o menu abriu acima dele */
.menu-panel[data-side='bottom'] {
  transform-origin: top center;
}

.menu-panel[data-side='top'] {
  transform-origin: bottom center;
}

.menu-pop-enter-active {
  transition: opacity 0.16s ease, transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.menu-pop-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}

.menu-pop-enter-from,
.menu-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

.menu-pop-enter-from[data-side='top'],
.menu-pop-leave-to[data-side='top'] {
  transform: translateY(6px) scale(0.97);
}

/* Submenu: aparece deslizando para fora do menu, para o lado em que abriu */
.menu-sub-enter-active {
  transition: opacity 0.12s ease, transform 0.16s cubic-bezier(0.16, 1, 0.3, 1);
}

.menu-sub-leave-active {
  transition: opacity 0.08s ease;
}

.menu-sub-enter-from,
.menu-sub-leave-to {
  opacity: 0;
}

.menu-sub-enter-from[data-side='right'] {
  transform: translateX(-4px);
}

.menu-sub-enter-from[data-side='left'] {
  transform: translateX(4px);
}

/* Mobile: o nível novo entra pela direita; voltando, pela esquerda */
.menu-drill-forward-enter-active,
.menu-drill-forward-leave-active,
.menu-drill-back-enter-active,
.menu-drill-back-leave-active {
  transition: opacity 0.1s ease, transform 0.14s ease;
}

.menu-drill-forward-enter-from,
.menu-drill-back-leave-to {
  opacity: 0;
  transform: translateX(12px);
}

.menu-drill-forward-leave-to,
.menu-drill-back-enter-from {
  opacity: 0;
  transform: translateX(-12px);
}
</style>
