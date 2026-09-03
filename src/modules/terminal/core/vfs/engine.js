import { TerminalError } from '../errors/codes.js'
import { VfsNodeType, isDirNode, isFileNode } from './types.js'

/**
 * Erro específico lançado por operações no VFS.
 */
export class VfsError extends Error {
  constructor(code, path) {
    super(code)
    this.name = 'VfsError'
    this.code = code
    this.path = path
  }
}

/**
 * Normaliza um caminho dentro da árvore do VFS.
 * Resolve referências a '.', '..', '~' e barras duplicadas.
 *
 * @param {string} path - Caminho relativo ou absoluto.
 * @param {string} [currentDir='/'] - Diretório atual de trabalho.
 * @returns {string} Caminho absoluto normalizado (ex: '/projects/plante').
 */
export function normalizePath(path, currentDir = '/') {
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
  const segments = raw.split('/').filter(Boolean)
  const stack = []

  for (const segment of segments) {
    if (segment === '.') {
      continue
    }
    if (segment === '..') {
      if (stack.length > 0) {
        stack.pop()
      }
    } else {
      stack.push(segment)
    }
  }

  return '/' + stack.join('/')
}

/**
 * Converte o caminho absoluto para representação amigável no prompt.
 * Exemplo: '/' -> '~', '/projects' -> '~/projects'
 *
 * @param {string} path
 * @returns {string}
 */
export function formatDisplayPath(path) {
  if (!path || path === '/') return '~'
  if (path.startsWith('/')) return '~' + path
  return path
}

/**
 * Motor de execução e navegação do Virtual File System (VfsEngine).
 */
export class VfsEngine {
  /**
   * @param {Object} manifest - Árvore declarativa gerada por createVfsManifest.
   * @param {Object} [options={}]
   * @param {string} [options.initialPath='/']
   */
  constructor(manifest, options = {}) {
    if (!manifest || manifest.type !== VfsNodeType.DIR) {
      throw new Error('Manifest inválido: a raiz deve ser um nó de diretório.')
    }

    this.manifest = manifest
    this.currentPath = options.initialPath || '/'
    this.previousPath = '/'
  }

  /**
   * Retorna o caminho absoluto atual no VFS.
   * @returns {string}
   */
  pwd() {
    return this.currentPath
  }

  /**
   * Retorna o caminho atual formatado para exibição no prompt.
   * @returns {string}
   */
  getDisplayPath() {
    return formatDisplayPath(this.currentPath)
  }

  /**
   * Localiza um nó na árvore do VFS a partir de um caminho relativo ou absoluto.
   *
   * @param {string} targetPath - Caminho de destino.
   * @returns {{ node: Object|null, path: string, exists: boolean, isDir: boolean, isFile: boolean }}
   */
  resolveNode(targetPath) {
    const normalized = normalizePath(targetPath, this.currentPath)

    if (normalized === '/') {
      return {
        node: this.manifest,
        path: '/',
        exists: true,
        isDir: true,
        isFile: false
      }
    }

    const segments = normalized.split('/').filter(Boolean)
    let current = this.manifest

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]

      if (!current.children || !current.children[segment]) {
        return {
          node: null,
          path: normalized,
          exists: false,
          isDir: false,
          isFile: false
        }
      }

      current = current.children[segment]
    }

    return {
      node: current,
      path: normalized,
      exists: true,
      isDir: isDirNode(current),
      isFile: isFileNode(current)
    }
  }

  /**
   * Altera o diretório de trabalho atual.
   *
   * @param {string} [targetPath='~'] - Caminho do diretório de destino.
   * @returns {string} Novo caminho absoluto atual.
   */
  cd(targetPath = '~') {
    let dest = targetPath
    if (!dest || dest === '~') {
      dest = '/'
    } else if (dest === '-') {
      dest = this.previousPath
    }

    const resolved = this.resolveNode(dest)

    if (!resolved.exists) {
      throw new VfsError(TerminalError.NO_SUCH_FILE, targetPath)
    }

    if (!resolved.isDir) {
      throw new VfsError(TerminalError.NOT_A_DIRECTORY, targetPath)
    }

    this.previousPath = this.currentPath
    this.currentPath = resolved.path
    return this.currentPath
  }

  /**
   * Lista as entradas de um diretório ou os detalhes de um arquivo.
   *
   * @param {string} [targetPath='.'] - Caminho a listar.
   * @returns {Array<{ name: string, type: string, mime?: string, action?: string, node: Object }>}
   */
  list(targetPath = '.') {
    const resolved = this.resolveNode(targetPath)

    if (!resolved.exists) {
      throw new VfsError(TerminalError.NO_SUCH_FILE, targetPath)
    }

    if (resolved.isFile) {
      const name = resolved.path.split('/').pop()
      return [
        {
          name,
          type: VfsNodeType.FILE,
          mime: resolved.node.mime,
          action: resolved.node.action,
          node: resolved.node
        }
      ]
    }

    const children = resolved.node.children || {}
    const entries = []

    for (const name of Object.keys(children)) {
      const child = children[name]
      entries.push({
        name,
        type: child.type,
        mime: child.mime,
        action: child.action,
        node: child
      })
    }

    return entries
  }

  /**
   * Lê o conteúdo textual de um arquivo no VFS.
   *
   * @param {string} targetPath - Caminho do arquivo.
   * @param {string} [locale='pt'] - Idioma ativo.
   * @returns {Promise<{ content: string, mime: string, action?: string, name: string }>}
   */
  async readFile(targetPath, locale = 'pt') {
    const resolved = this.resolveNode(targetPath)

    if (!resolved.exists) {
      throw new VfsError(TerminalError.NO_SUCH_FILE, targetPath)
    }

    if (resolved.isDir) {
      throw new VfsError(TerminalError.IS_A_DIRECTORY, targetPath)
    }

    const { node } = resolved
    let content = ''

    if (typeof node.getContent === 'function') {
      content = await node.getContent(locale)
    } else if (typeof node.loader === 'function') {
      const loaded = await node.loader(locale)
      content = loaded && loaded.default !== undefined ? loaded.default : loaded
    } else if (typeof node.content === 'string') {
      content = node.content
    }

    return {
      content: typeof content === 'string' ? content : JSON.stringify(content, null, 2),
      mime: node.mime || 'text/plain',
      action: node.action,
      name: resolved.path.split('/').pop()
    }
  }

  /**
   * Gera a representação em árvore ASCII do caminho informado.
   *
   * @param {string} [targetPath='.']
   * @param {number} [maxDepth=4]
   * @returns {string}
   */
  tree(targetPath = '.', maxDepth = 4) {
    const resolved = this.resolveNode(targetPath)
    if (!resolved.exists) {
      throw new VfsError(TerminalError.NO_SUCH_FILE, targetPath)
    }
    if (resolved.isFile) {
      return resolved.path.split('/').pop()
    }

    const lines = []
    const rootName = resolved.path === '/' ? '.' : resolved.path.split('/').pop()
    lines.push(rootName)

    const buildTree = (dirNode, prefix = '', depth = 1) => {
      if (depth > maxDepth || !dirNode.children) return
      const keys = Object.keys(dirNode.children)
      keys.forEach((key, index) => {
        const isLast = index === keys.length - 1
        const child = dirNode.children[key]
        const branch = isLast ? '└── ' : '├── '
        lines.push(`${prefix}${branch}${key}`)

        if (child.type === VfsNodeType.DIR) {
          const extension = isLast ? '    ' : '│   '
          buildTree(child, prefix + extension, depth + 1)
        }
      })
    }

    buildTree(resolved.node, '', 1)
    return lines.join('\n')
  }

  /**
   * Retorna candidatos para autocompletion a partir de um fragmento de caminho.
   *
   * @param {string} partial - Texto digitado pelo usuário.
   * @returns {string[]} Lista de sugestões completáveis.
   */
  getCompletions(partial = '') {
    const lastSlashIdx = partial.lastIndexOf('/')
    let dirPath = '.'
    let filePrefix = partial

    if (lastSlashIdx !== -1) {
      dirPath = partial.slice(0, lastSlashIdx) || '/'
      filePrefix = partial.slice(lastSlashIdx + 1)
    }

    try {
      const entries = this.list(dirPath)
      const prefixDir = dirPath === '.' ? '' : (dirPath.endsWith('/') ? dirPath : dirPath + '/')
      return entries
        .filter((e) => e.name.startsWith(filePrefix))
        .map((e) => `${prefixDir}${e.name}${e.type === VfsNodeType.DIR ? '/' : ''}`)
    } catch {
      return []
    }
  }
}

/**
 * Cria e inicializa uma nova instância de VfsEngine.
 *
 * @param {Object} manifest - Árvore declarativa do VFS.
 * @param {Object} [options={}]
 * @returns {VfsEngine}
 */
export function createVfsEngine(manifest, options = {}) {
  return new VfsEngine(manifest, options)
}

export default {
  VfsError,
  VfsEngine,
  normalizePath,
  formatDisplayPath,
  createVfsEngine
}

