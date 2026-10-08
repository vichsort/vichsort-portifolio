/**
 * Tipos e constantes do Virtual File System (VFS).
 */

export const VfsNodeType = {
  DIR: 'dir',
  FILE: 'file'
} as const

export const VfsMimeType = {
  TEXT_PLAIN: 'text/plain',
  TEXT_MARKDOWN: 'text/markdown',
  APPLICATION_JSON: 'application/json',
  APPLICATION_PDF: 'application/pdf'
} as const

export type VfsMime = (typeof VfsMimeType)[keyof typeof VfsMimeType]

export interface VfsFile {
  type: typeof VfsNodeType.FILE
  mime: VfsMime
  /** Conteúdo gerado no idioma pedido; sem ele, o arquivo é binário (resume.pdf). */
  getContent?: (locale: string) => string | Promise<string>
}

export interface VfsDir {
  type: typeof VfsNodeType.DIR
  children: Record<string, VfsNode>
}

export type VfsNode = VfsFile | VfsDir

/** Se um nó do VFS é um diretório válido. */
export function isDirNode(node: VfsNode | null | undefined): node is VfsDir {
  return Boolean(node && node.type === VfsNodeType.DIR && typeof node.children === 'object')
}

/** Se um nó do VFS é um arquivo válido. */
export function isFileNode(node: VfsNode | null | undefined): node is VfsFile {
  return Boolean(node && node.type === VfsNodeType.FILE)
}
