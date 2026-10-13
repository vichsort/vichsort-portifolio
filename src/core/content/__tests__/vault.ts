/**
 * Vault de exemplo para os testes: poucos nós, um de cada situação que as regras
 * do GRAPH.md cobrem, e nenhum erro ou aviso. Cada teste parte daqui e muda só o que precisa.
 */

export type VaultFiles = Record<string, string>

/** Arquivo Markdown com frontmatter (YAML já escrito) e corpo. */
export const md = (yaml: string, body = ''): string => `---\n${yaml.trim()}\n---\n${body}`

export const BASE: VaultFiles = {
  'index.md': '# Índice',
  '_templates/project.md': md('category: "[[app]]"'),

  'techs/python/python.md': md('name: Python\naliases: [Py]'),
  'techs/javascript/javascript.md': md('name: JavaScript'),
  'techs/vue/vue.md': md('name: Vue\ntechs:\n  - "[[javascript]]"'),

  'topics/web/web.md': md('source: placeholder'),
  'topics/web/web.pt.md': md('name: Web'),
  'topics/web/web.en.md': md('name: Web'),

  'categories/app/app.md': md(''),
  'categories/app/app.pt.md': md('name: Aplicativo'),
  'categories/app/app.en.md': md('name: App'),

  'groups/frontend/frontend.md': md(''),
  'groups/frontend/frontend.pt.md': md('name: Frontend'),
  'groups/frontend/frontend.en.md': md('name: Frontend'),

  'projects/alpha/alpha.md': md('category: "[[app]]"\ndate: 2025-03\ntechs:\n  - "[[py]]"\n  - "[[vue]]"'),
  'projects/alpha/alpha.pt.md': md('title: Alfa\nsummary: Resumo', 'Feito para a [[web|internet]]. ![[shot.png]]'),
  'projects/alpha/alpha.en.md': md('title: Alpha\nsummary: Summary', 'Built for the [[web]].'),

  'projects/beta/beta.md': md('category: "[[app]]"\ndate: [2024-01, 2024-06]\ntechs:\n  - "[[vue]]"\ntopics:\n  - "[[web]]"'),
  'projects/beta/beta.pt.md': md('title: Beta\nsummary: Resumo'),
  'projects/beta/beta.en.md': md('title: Beta\nsummary: Summary'),

  'collections/stack/stack.md': md('items:\n  - group: "[[frontend]]"\n    items:\n      - "[[vue]]"\n      - "[[javascript]]"\n  - group: "[[frontend]]"\n    items:\n      - "[[python]]"')
}

/** O vault de exemplo com arquivos trocados (string) ou removidos (null). */
export function vault(changes: Record<string, string | null> = {}): Array<{ path: string; raw: string }> {
  const files: VaultFiles = { ...BASE }
  for (const [path, raw] of Object.entries(changes)) {
    if (raw === null) delete files[path]
    else files[path] = raw
  }
  return Object.entries(files).map(([path, raw]) => ({ path, raw }))
}

/** Ícones das techs da coleção: sem eles, a validação acusa missing-icon. */
export const ICONS = ['vue', 'javascript', 'python'].map((id) => ({ path: `techs/${id}/icon.svg`, url: `/icons/${id}.svg` }))
