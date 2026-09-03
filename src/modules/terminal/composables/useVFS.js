import { ref, computed } from 'vue'
import { createVfsManifest } from '../core/vfs/manifest.js'
import { createVfsEngine, formatDisplayPath } from '../core/vfs/engine.js'

/**
 * Composable de gerenciamento reativo do Virtual File System (VFS).
 *
 * @param {Object} [options={}]
 * @param {Object} [options.services={}] - Serviços injetados (i18n, etc.).
 * @returns {Object} Instância e estado reativo do VFS.
 */
export function useVFS(options = {}) {
  const manifest = createVfsManifest(options.services || {})
  const vfs = createVfsEngine(manifest, options)

  const currentPath = ref(vfs.pwd())
  const displayPath = computed(() => formatDisplayPath(currentPath.value))

  // Intercepta cd para sincronizar a ref reativa do caminho
  const originalCd = vfs.cd.bind(vfs)
  vfs.cd = (target) => {
    const result = originalCd(target)
    currentPath.value = vfs.pwd()
    return result
  }

  return {
    vfs,
    currentPath,
    displayPath,
    cd: (target) => vfs.cd(target),
    pwd: () => vfs.pwd(),
    list: (target) => vfs.list(target),
    readFile: (target, locale) => vfs.readFile(target, locale),
    tree: (target, maxDepth) => vfs.tree(target, maxDepth),
    getCompletions: (partial) => vfs.getCompletions(partial)
  }
}

export default useVFS

