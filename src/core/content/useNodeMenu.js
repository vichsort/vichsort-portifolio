import { computed, toValue } from 'vue'
import { useI18n } from 'vue-i18n'
import { content } from './index.js'
import { buildNodeMenu } from './nodeMenu.js'

/**
 * Itens do ContextMenu para um nó, no idioma ativo: a ponte entre o modelo
 * (buildNodeMenu) e o menu genérico (shared/components/ui/menu).
 *
 * - O título do grupo vem do dicionário (node_menu.<tipo>), no singular ou plural.
 * - Grupo com um item só: a linha já é o link para ele.
 * - Grupo com mais: submenu com os itens e, se cortado, "Ver todos" no fim.
 * - Itens sem destino (techs relacionadas) ficam no submenu como informação.
 *
 * @param {import('vue').MaybeRefOrGetter<string>} id
 * @param {{ types?: string[], limit?: number, exclude?: import('vue').MaybeRefOrGetter<string[]> }} [options]
 *   repassadas ao buildNodeMenu
 * @returns {import('vue').ComputedRef<object[]>}
 */
export function useNodeMenu(id, options = {}) {
  const { t, locale } = useI18n()

  const toMenuItem = (group) => {
    const label = t(`node_menu.${group.type}`, group.count)
    const [only] = group.items

    if (group.count === 1 && only.to) return { key: group.type, label, to: only.to }

    const children = group.items.map((item) => ({ key: item.id, label: item.label, to: item.to }))
    if (group.more) children.push({ key: '__more', label: t('node_menu.see_all'), to: group.more, separator: true })

    return { key: group.type, label, children }
  }

  return computed(() => buildNodeMenu(content, toValue(id), { ...options, exclude: toValue(options.exclude) || [], lang: locale.value }).map(toMenuItem))
}
