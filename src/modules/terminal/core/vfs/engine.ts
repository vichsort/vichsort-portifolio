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

/** Caminho absoluto, com '.', '..', '~' e barras repetidas resolvidos. '..' na raiz fica na raiz. */
export function normalizePath(path: string, currentDir = '/'): string {
  if (!path || typeof path !== 'string') {
    return currentDir || '/'
  }

  let raw = path.trim()

  if (raw === '~' || raw.startsWith('~/')) {
    raw = '/' + raw.slice(1).replace(/^\//, '')
  }

  if (!raw.startsWith('/')) {
    raw = `${currentDir.replace(/\/+$/, '')}/${raw}`
  }

  const stack: string[] = []
  for (const segment of raw.split('/').filter(Boolean)) {
    if (segment === '.') continue
    if (segment === '..') stack.pop()
    else stack.push(segment)
  }

  return '/' + stack.join('/')
}

/** Caminho como o prompt mostra: '/' vira '~', '/projects' vira '~/projects'. */
export function formatDisplayPath(path: string): string {
  if (!path || path === '/') return '~'
  if (path.startsWith('/')) return '~' + path
  return path
}

/**
 * Navegação e leitura do sistema de arquivos virtual do terminal. Erros de caminho
 * saem como CommandError, que o dispatcher formata.
 */
export class VfsEngine {
  manifest: VfsDir
  currentPath: string
  previousPath: string
  onChange: (path: string) => void

  /** manifest: a árvore do createVfsManifest. onChange: chamado a cada troca de diretório. */
  constructor(manifest: VfsNode, options: { initialPath?: string; onChange?: (path: string) => void } = {}) {
    if (!isDirNode(manifest)) {
      throw new Error('Manifest inválido: a raiz deve ser um nó de diretório.')
    }

    this.manifest = manifest
    this.currentPath = options.initialPath || '/'
    this.previousPath = '/'
    this.onChange = options.onChange || (() => {})
  }

  pwd(): string {
    return this.currentPath
  }

  /** O nó do caminho; num caminho que não existe, node null e exists false, sem erro. */
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

  /** Como resolveNode, mas um caminho inexistente é erro (no_such_file). */
  resolveExisting(targetPath: string): ResolvedNode & { node: VfsNode } {
    const resolved = this.resolveNode(targetPath)
    if (!resolved.node) throw notFound(targetPath)
    return { ...resolved, node: resolved.node }
  }

  /** Sem destino ou com `~`, vai à raiz; `-` volta ao diretório anterior. */
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

  /** Entradas de um diretório; num arquivo, só ele mesmo. */
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

  /** Tudo abaixo do caminho, em pré-ordem e sem ele mesmo; num arquivo, só o arquivo. */
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

  /** Conteúdo gerado no idioma pedido; arquivo binário (resume.pdf) vem vazio. */
  async readFile(targetPath: string, locale: string): Promise<{ content: string; mime: VfsMime; name: string }> {
    const { node, path } = this.resolveExisting(targetPath)

    if (!isFileNode(node)) {
      throw new CommandError(TerminalError.IS_A_DIRECTORY, { path: targetPath })
    }

    const content = node.getContent ? await node.getContent(locale) : ''
    return { content: String(content ?? ''), mime: node.mime, name: baseName(path) }
  }

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

  /** Caminhos que completam o que foi digitado, no mesmo formato (relativo ou absoluto); pastas com '/'. */
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
