import { TerminalError, CommandError } from '../errors/codes.js'
import { VfsNodeType, isDirNode, isFileNode } from './types.js'

const notFound = (path) => new CommandError(TerminalError.NO_SUCH_FILE, { path })
const baseName = (path) => path.split('/').pop()
const joinPath = (dir, name) => (dir === '/' ? `/${name}` : `${dir}/${name}`)

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
  const stack = []
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
 * Erros de caminho saem como CommandError, que o dispatcher formata.
 */
export class VfsEngine {
  /**
   * @param {Object} manifest - Árvore declarativa gerada por createVfsManifest.
   * @param {Object} [options={}]
   * @param {string} [options.initialPath='/']
   * @param {(path: string) => void} [options.onChange] - Chamado a cada troca de diretório.
   */
  constructor(manifest, options = {}) {
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
   * @returns {string}
   */
  pwd() {
    return this.currentPath
  }

  /**
   * Localiza um nó na árvore do VFS a partir de um caminho relativo ou absoluto.
   *
   * @param {string} targetPath - Caminho de destino.
   * @returns {{ node: Object|null, path: string, exists: boolean, isDir: boolean, isFile: boolean }}
   */
  resolveNode(targetPath) {
    const path = normalizePath(targetPath, this.currentPath)
    let node = this.manifest

    for (const segment of path.split('/').filter(Boolean)) {
      node = node.children?.[segment]
      if (!node) return { node: null, path, exists: false, isDir: false, isFile: false }
    }

    return { node, path, exists: true, isDir: isDirNode(node), isFile: isFileNode(node) }
  }

  /**
   * Resolve um caminho que precisa existir.
   *
   * @param {string} targetPath
   * @returns {{ node: Object, path: string, isDir: boolean, isFile: boolean }}
   */
  resolveExisting(targetPath) {
    const resolved = this.resolveNode(targetPath)
    if (!resolved.exists) throw notFound(targetPath)
    return resolved
  }

  /**
   * Altera o diretório de trabalho atual. `cd` sem destino ou `~` vai à raiz; `-` volta ao anterior.
   *
   * @param {string} [targetPath='~'] - Caminho do diretório de destino.
   * @returns {string} Novo caminho absoluto atual.
   */
  cd(targetPath = '~') {
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
   * @param {string} [targetPath='.'] - Caminho a listar.
   * @returns {Array<{ name: string, type: string, mime?: string, node: Object }>}
   */
  list(targetPath = '.') {
    const { node, path, isFile } = this.resolveExisting(targetPath)
    const entry = (name, child) => ({ name, type: child.type, mime: child.mime, node: child })

    if (isFile) return [entry(baseName(path), node)]
    return Object.entries(node.children).map(([name, child]) => entry(name, child))
  }

  /**
   * Percorre recursivamente a árvore a partir do caminho; num arquivo, só ele mesmo.
   *
   * @param {string} [targetPath='.']
   * @returns {Array<{ path: string, name: string, type: string }>} Nós em pré-ordem (sem o ponto de partida).
   */
  walk(targetPath = '.') {
    const { path, isFile } = this.resolveExisting(targetPath)
    if (isFile) return [{ path, name: baseName(path), type: VfsNodeType.FILE }]

    const results = []
    const visit = (dir) => {
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
   * @param {string} targetPath - Caminho do arquivo.
   * @param {string} locale - Idioma ativo.
   * @returns {Promise<{ content: string, mime: string, name: string }>}
   */
  async readFile(targetPath, locale) {
    const { node, path, isDir } = this.resolveExisting(targetPath)

    if (isDir) {
      throw new CommandError(TerminalError.IS_A_DIRECTORY, { path: targetPath })
    }

    const content = node.getContent ? await node.getContent(locale) : ''
    return { content: String(content ?? ''), mime: node.mime, name: baseName(path) }
  }

  /**
   * Gera a representação em árvore ASCII do caminho informado.
   *
   * @param {string} [targetPath='.']
   * @param {number} [maxDepth=4]
   * @returns {string}
   */
  tree(targetPath = '.', maxDepth = 4) {
    const { node, path, isFile } = this.resolveExisting(targetPath)
    if (isFile) return baseName(path)

    const lines = [path === '/' ? '.' : baseName(path)]

    const buildTree = (dirNode, prefix, depth) => {
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
      const prefixDir = dirPath === '.' ? '' : (dirPath.endsWith('/') ? dirPath : dirPath + '/')
      return this.list(dirPath)
        .filter((e) => e.name.startsWith(filePrefix))
        .map((e) => `${prefixDir}${e.name}${e.type === VfsNodeType.DIR ? '/' : ''}`)
    } catch {
      return []
    }
  }
}
