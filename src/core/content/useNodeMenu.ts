import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from 'vue'
import { useI18n } from 'vue-i18n'
import { content } from './index.ts'
import { buildNodeMenu, type NodeMenuGroup } from './nodeMenu.ts'
import type { NodeType } from './types.ts'

/** Item do ContextMenu genérico (shared/components/ui/menu). */
export interface MenuItem {
  key: string
  label: string
  to?: string | null
  children?: MenuItem[]
  separator?: boolean
}

/**
 * Itens do ContextMenu para um nó, no idioma ativo: a ponte entre o modelo
 * (buildNodeMenu) e o menu genérico (shared/components/ui/menu).
 *
 * - O título do grupo vem do dicionário (node_menu.<tipo>), no singular ou plural.
 * - Grupo com um item só: a linha já é o link para ele.
 * - Grupo com mais: submenu com os itens e, se cortado, "Ver todos" no fim.
 * - Itens sem destino (techs relacionadas) ficam no submenu como informação.
 *
 * As opções são repassadas ao buildNodeMenu.
 */
export function useNodeMenu(
  id: MaybeRefOrGetter<string>,
  options: { types?: NodeType[]; limit?: number; exclude?: MaybeRefOrGetter<string[]> } = {}
): ComputedRef<MenuItem[]> {
  const { t, locale } = useI18n()

  const toMenuItem = (group: NodeMenuGroup): MenuItem => {
    const label = t(`node_menu.${group.type}`, group.count)
    const [only] = group.items

    if (group.count === 1 && only.to) return { key: group.type, label, to: only.to }

    const children: MenuItem[] = group.items.map((item) => ({ key: item.id, label: item.label, to: item.to }))
    if (group.more) children.push({ key: '__more', label: t('node_menu.see_all'), to: group.more, separator: true })

    return { key: group.type, label, children }
  }

  return computed(() => buildNodeMenu(content, toValue(id), { ...options, exclude: toValue(options.exclude) || [], lang: locale.value }).map(toMenuItem))
}
