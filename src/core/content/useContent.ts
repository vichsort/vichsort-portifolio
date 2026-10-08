import { useI18n } from 'vue-i18n'
import { content } from './index.ts'

/**
 * Acesso ao grafo de conteúdo no idioma ativo.
 *
 * As funções leem o idioma na hora da chamada, então são reativas quando
 * usadas dentro de computed ou do template.
 */
export function useContent() {
  const { locale } = useI18n()
  const lang = () => locale.value

  return {
    node: content.node,
    ofType: content.ofType,
    linked: content.linked,
    relatedTechs: content.relatedTechs,
    related: content.related,
    collection: content.collection,
    asset: content.asset,
    icon: content.icon,
    cover: content.cover,
    text: (id: string) => content.text(id, lang()),
    fallback: (id: string) => content.fallback(id, lang()),
    label: (id: string) => content.label(id, lang()),
    html: (id: string) => content.html(id, lang()),
    backlinks: (id: string, options: { includeCollections?: boolean } = {}) => content.backlinks(id, { lang: lang(), ...options }),
    outlinks: (id: string) => content.outlinks(id, { lang: lang() })
  }
}
