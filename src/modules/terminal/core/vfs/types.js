/**
 * Tipos e Constantes do Virtual File System (VFS)
 */

export const VfsNodeType = {
  DIR: 'dir',
  FILE: 'file'
}

export const VfsMimeType = {
  TEXT_PLAIN: 'text/plain',
  TEXT_MARKDOWN: 'text/markdown',
  APPLICATION_JSON: 'application/json',
  APPLICATION_PDF: 'application/pdf'
}

/**
 * Valida se um nó do VFS é um diretório válido.
 * @param {Object} node
 * @returns {boolean}
 */
export function isDirNode(node) {
  return Boolean(node && node.type === VfsNodeType.DIR && typeof node.children === 'object')
}

/**
 * Valida se um nó do VFS é um arquivo válido.
 * @param {Object} node
 * @returns {boolean}
 */
export function isFileNode(node) {
  return Boolean(node && node.type === VfsNodeType.FILE)
}

export default {
  VfsNodeType,
  VfsMimeType,
  isDirNode,
  isFileNode
}

