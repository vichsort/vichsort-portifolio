/**
 * Tipos do grafo de conteúdo (ver GRAPH.md).
 *
 * Os campos vêm do frontmatter YAML, então só os conhecidos ganham tipo
 * próprio; o resto fica como unknown e precisa ser checado antes do uso.
 */

export type NodeType =
  | 'tech'
  | 'topic'
  | 'role'
  | 'category'
  | 'group'
  | 'project'
  | 'certification'
  | 'research'
  | 'timeline'
  | 'photo'
  | 'collection'

/** Data no formato AAAA ou AAAA-MM; o YAML pode entregar o ano como número. */
export type DateValue = string | number

/** Campos da estrutura (<id>.md) que não são ligações, depois que o grafo tira as ligações. */
export interface NodeData {
  source?: string
  name?: string
  date?: DateValue | DateValue[]
  github?: string
  live?: string
  featured?: boolean
  format?: string
  kind?: string
  issuer?: string
  credential_url?: string
  paper_url?: string
  authors?: string
  lucide?: string
  [field: string]: unknown
}

/** Texto de um idioma (<id>.<lang>.md): frontmatter + corpo. */
export interface NodeText {
  body: string
  name?: string
  title?: string
  summary?: string
  description?: string
  definition?: string
  note?: string
  caption?: string
  location?: string
  institution?: string
  award?: string
  organization?: string
  [field: string]: unknown
}

export interface CollectionGroup {
  group: string | null
  items: string[]
}

export interface ContentNode {
  id: string
  type: NodeType
  /** Pasta do nó, relativa a src/content (ex.: 'techs/python'). */
  path: string
  data: NodeData
  aliases: string[]
  /** Idioma → texto. Só no build: no site fica vazio, e os textos vêm por idioma (index.ts). */
  texts: Record<string, NodeText>
  /** Arquivos extras da pasta: nome → URL. */
  assets: Record<string, string>
  /** Campo de ligação → ids resolvidos (lista) ou id (ligação única, ou null). */
  links: Record<string, string[] | string | null>
  /** Idioma → ids citados no corpo. */
  bodyLinks: Record<string, string[]>
  /** Só em coleções. */
  groups: CollectionGroup[] | null
}

export interface Edge {
  from: string
  to: string
  /** Campo da estrutura, ou 'body' para citações no texto. */
  field: string
  /** Idioma do corpo (citações no texto), ou null para ligações de estrutura. */
  lang: string | null
}

export type IssueLevel = 'error' | 'warning'

export interface Issue {
  level: IssueLevel
  code: string
  where: string
  message: string
}

export type Report = (level: IssueLevel, code: string, where: string, message: string) => void

/** O grafo sem os textos: o que o site recebe no arquivo principal. */
export interface GraphStructure {
  nodes: Map<string, ContentNode>
  edges: Edge[]
  backlinks: Map<string, Edge[]>
  /** Id de um alvo de wikilink (id ou alias, sem diferenciar maiúsculas), ou null. */
  resolve: (target: unknown) => string | null
}

export interface ContentGraph extends GraphStructure {
  issues: Issue[]
}

/** Definição de um tipo de nó no esquema. */
export interface TypeDef {
  folder: string
  required?: string[]
  requiredText?: string[]
  links?: Record<string, NodeType>
  single?: Record<string, NodeType | '*'>
  enums?: Record<string, string[]>
}
