import { ref, computed } from 'vue'
import { createVfsManifest } from '../core/vfs/manifest.js'
import { VfsEngine, formatDisplayPath } from '../core/vfs/engine.js'

/**
 * VFS com o diretório atual reativo, para o prompt e o título da janela.
 *
 * @returns {{ vfs: VfsEngine, currentPath: import('vue').Ref<string>, displayPath: import('vue').ComputedRef<string> }}
 */
export function useVFS() {
  const currentPath = ref('/')
  const vfs = new VfsEngine(createVfsManifest(), {
    onChange: (path) => {
      currentPath.value = path
    }
  })
  const displayPath = computed(() => formatDisplayPath(currentPath.value))

  return { vfs, currentPath, displayPath }
}
