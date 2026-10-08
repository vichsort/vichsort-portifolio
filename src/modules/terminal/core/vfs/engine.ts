import { TerminalError, CommandError } from '../errors/codes.ts'
import { VfsNodeType, isDirNode, isFileNode, type VfsDir, type VfsMime, type VfsNode } from './types.ts'

export interface ResolvedNode {
  node: VfsNode | null
  path: string
  exists: boolean
  isDir: boolean
  isFile: boolean
}

export interface VfsEntry {
  name: string
  type: VfsNode['type']
  mime?: VfsMime
  node: VfsNode
}

const notFound = (path: string) => new CommandError(TerminalError.NO_SUCH_FILE, { path })
const baseName = (path: string) => path.split('/').pop() || ''
const joinPath = (dir: string, name: string) => (dir === '/' ? `/${name}` : `${dir}/${name}`)

/**
 * Normaliza um caminho dentro da árvore do VFS.
 * Resolve referências a '.', '..', '~' e barras duplicadas.
 *
 * @param path - Caminho relativo ou absoluto.
 * @param currentDir - Diretório atual de trabalho.
 * @returns Caminho absoluto normalizado (ex: '/projects/plante').
 */
export function normalizePath(path: string, currentDir = '/'): string {
  if (!path || typeof path !== 'string') {
    return currentDir || '/'
  }

  let raw = path.trim()

  // Converte '~' inicial para '/'
  if (raw === '~' || raw.startsWith('~/')) {
    raw = '/' + raw.slice(1).replace(/^\//, '')
  }

  // Se não for absoluto, concatena ao diretório atual
  if (!raw.startsWith('/')) {
    raw = `${currentDir.replace(/\/+$/, '')}/${raw}`
  }

  // Quebra segmentos e processa '.' e '..'
  const stack: string[] = []
  for (const segment of raw.split('/').filter(Boolean)) {
    if (segment === '.') continue
    if (segment === '..') stack.pop()
    else stack.push(segment)
  }

  return '/' + stack.join('/')
}

/**
 * Converte o caminho absoluto para representação amigável no prompt.
 * Exemplo: '/' -> '~', '/projects' -> '~/projects'
 */
export function formatDisplayPath(path: string): string {
  if (!path || path === '/') return '~'
  if (path.startsWith('/')) return '~' + path
  return path
}

/**
 * Motor de execução e navegação do Virtual File System (VfsEngine).
 * Erros de caminho saem como CommandError, que o dispatcher formata.
 */
export class VfsEngine {
  manifest: VfsDir
  currentPath: string
  previousPath: string
  onChange: (path: string) => void

  /**
   * @param manifest - Árvore declarativa gerada por createVfsManifest.
   * @param options.onChange - Chamado a cada troca de diretório.
   */
  constructor(manifest: VfsNode, options: { initialPath?: string; onChange?: (path: string) => void } = {}) {
    if (!isDirNode(manifest)) {
      throw new Error('Manifest inválido: a raiz deve ser um nó de diretório.')
    }

    this.manifest = manifest
    this.currentPath = options.initialPath || '/'
    this.previousPath = '/'
    this.onChange = options.onChange || (() => {})
  }

  /**
   * Retorna o caminho absoluto atual no VFS.
   */
  pwd(): string {
    return this.currentPath
  }

  /**
   * Localiza um nó na árvore do VFS a partir de um caminho relativo ou absoluto.
   *
   * @param targetPath - Caminho de destino.
   */
  resolveNode(targetPath: string): ResolvedNode {
    const path = normalizePath(targetPath, this.currentPath)
    let node: VfsNode = this.manifest

    for (const segment of path.split('/').filter(Boolean)) {
      const child: VfsNode | undefined = isDirNode(node) ? node.children[segment] : undefined
      if (!child) return { node: null, path, exists: false, isDir: false, isFile: false }
      node = child
    }

    return { node, path, exists: true, isDir: isDirNode(node), isFile: isFileNode(node) }
  }

  /**
   * Resolve um caminho que precisa existir.
   */
  resolveExisting(targetPath: string): ResolvedNode & { node: VfsNode } {
    const resolved = this.resolveNode(targetPath)
    if (!resolved.node) throw notFound(targetPath)
    return { ...resolved, node: resolved.node }
  }

  /**
   * Altera o diretório de trabalho atual. `cd` sem destino ou `~` vai à raiz; `-` volta ao anterior.
   *
   * @param targetPath - Caminho do diretório de destino.
   * @returns Novo caminho absoluto atual.
   */
  cd(targetPath = '~'): string {
    const dest = targetPath === '-' ? this.previousPath : targetPath || '/'
    const resolved = this.resolveExisting(dest)

    if (!resolved.isDir) {
      throw new CommandError(TerminalError.NOT_A_DIRECTORY, { path: targetPath })
    }

    this.previousPath = this.currentPath
    this.currentPath = resolved.path
    this.onChange(this.currentPath)
    return this.currentPath
  }

  /**
   * Lista as entradas de um diretório; num arquivo, só ele mesmo.
   *
   * @param targetPath - Caminho a listar.
   */
  list(targetPath = '.'): VfsEntry[] {
    const { node, path } = this.resolveExisting(targetPath)
    const entry = (name: string, child: VfsNode): VfsEntry => ({
      name,
      type: child.type,
      mime: isFileNode(child) ? child.mime : undefined,
      node: child
    })

    if (!isDirNode(node)) return [entry(baseName(path), node)]
    return Object.entries(node.children).map(([name, child]) => entry(name, child))
  }

  /**
   * Percorre recursivamente a árvore a partir do caminho; num arquivo, só ele mesmo.
   *
   * @returns Nós em pré-ordem (sem o ponto de partida).
   */
  walk(targetPath = '.'): Array<{ path: string; name: string; type: VfsNode['type'] }> {
    const { path, isFile } = this.resolveExisting(targetPath)
    if (isFile) return [{ path, name: baseName(path), type: VfsNodeType.FILE }]

    const results: Array<{ path: string; name: string; type: VfsNode['type'] }> = []
    const visit = (dir: string) => {
      for (const { name, type } of this.list(dir)) {
        const fullPath = joinPath(dir, name)
        results.push({ path: fullPath, name, type })
        if (type === VfsNodeType.DIR) visit(fullPath)
      }
    }
    visit(path)
    return results
  }

  /**
   * Lê o conteúdo textual de um arquivo no VFS.
   *
   * @param targetPath - Caminho do arquivo.
   * @param locale - Idioma ativo.
   */
  async readFile(targetPath: string, locale: string): Promise<{ content: string; mime: VfsMime; name: string }> {
    const { node, path } = this.resolveExisting(targetPath)

    if (!isFileNode(node)) {
      throw new CommandError(TerminalError.IS_A_DIRECTORY, { path: targetPath })
    }

    const content = node.getContent ? await node.getContent(locale) : ''
    return { content: String(content ?? ''), mime: node.mime, name: baseName(path) }
  }

  /**
   * Gera a representação em árvore ASCII do caminho informado.
   */
  tree(targetPath = '.', maxDepth = 4): string {
    const { node, path } = this.resolveExisting(targetPath)
    if (!isDirNode(node)) return baseName(path)

    const lines = [path === '/' ? '.' : baseName(path)]

    const buildTree = (dirNode: VfsDir, prefix: string, depth: number) => {
      if (depth > maxDepth) return
      const keys = Object.keys(dirNode.children)
      keys.forEach((key, index) => {
        const isLast = index === keys.length - 1
        const child = dirNode.children[key]
        lines.push(`${prefix}${isLast ? '└── ' : '├── '}${key}`)
        if (isDirNode(child)) buildTree(child, prefix + (isLast ? '    ' : '│   '), depth + 1)
      })
    }

    buildTree(node, '', 1)
    return lines.join('\n')
  }

  /**
   * Retorna candidatos para autocompletion a partir de um fragmento de caminho.
   *
   * @param partial - Texto digitado pelo usuário.
   * @returns Lista de sugestões completáveis.
   */
  getCompletions(partial = ''): string[] {
    const lastSlashIdx = partial.lastIndexOf('/')
    let dirPath = '.'
    let filePrefix = partial

    if (lastSlashIdx !== -1) {
      dirPath = partial.slice(0, lastSlashIdx) || '/'
      filePrefix = partial.slice(lastSlashIdx + 1)
    }

    try {
      const prefixDir = dirPath === '.' ? '' : (dirPath.endsWith('/') ? dirPath : dirPath + '/')
      return this.list(dirPath)
        .filter((e) => e.name.startsWith(filePrefix))
        .map((e) => `${prefixDir}${e.name}${e.type === VfsNodeType.DIR ? '/' : ''}`)
    } catch {
      return []
    }
  }
}
