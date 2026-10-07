import { useI18n } from 'vue-i18n'
import { content } from './index.js'

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
    related: content.related,
    collection: content.collection,
    asset: content.asset,
    icon: content.icon,
    cover: content.cover,
    text: (id) => content.text(id, lang()),
    fallback: (id) => content.fallback(id, lang()),
    label: (id) => content.label(id, lang()),
    html: (id) => content.html(id, lang()),
    backlinks: (id, options = {}) => content.backlinks(id, { lang: lang(), ...options }),
    outlinks: (id) => content.outlinks(id, { lang: lang() })
  }
}
