<script setup>
import { useI18n } from 'vue-i18n'
import { LayoutGrid, List, RotateCcw, Sparkles, Link2, X } from 'lucide-vue-next'
import { useListingView } from '@/shared/composables/useListingView'
import BaseSearchInput from './BaseSearchInput.vue'
import BaseSelect from './BaseSelect.vue'

/**
 * Barra das listagens: busca, filtros, contador, "limpar" e grade/lista.
 * Com refLabel, mostra o chip do filtro ?ref= (useRefFilter), removível à parte do "limpar".
 * Os dados vêm do useListingFilters da página; os textos, dos dicionários dela.
 */
defineProps({
  search: { type: String, default: '' },
  searchPlaceholder: { type: String, default: '' },
  // [{ key, label, allLabel, options }]
  filters: { type: Array, default: () => [] },
  selected: { type: Object, required: true },
  countText: { type: String, default: '' },
  clearLabel: { type: String, default: '' },
  hasActiveFilters: { type: Boolean, default: false },
  refLabel: { type: String, default: '' }
})

const emit = defineEmits(['update:search', 'select', 'clear', 'clearRef'])

const { t } = useI18n()
const { view } = useListingView()

const VIEWS = [
  { id: 'grid', icon: LayoutGrid },
  { id: 'list', icon: List }
]
</script>

<template>
  <div class="listing-toolbar">
    <div class="filters-row">
      <div class="search-box">
        <BaseSearchInput
          :model-value="search"
          :placeholder="searchPlaceholder"
          @update:model-value="(value) => emit('update:search', value)"
        />
      </div>

      <div class="selects-group">
        <BaseSelect
          v-for="filter in filters"
          :key="filter.key"
          :model-value="selected[filter.key]"
          :options="filter.options"
          :label="filter.label"
          :placeholder="filter.label"
          :all-label="filter.allLabel"
          @update:model-value="(value) => emit('select', filter.key, value)"
        />
      </div>
    </div>

    <div class="meta-row">
      <div class="meta-info">
        <span class="count">
          <Sparkles :size="13" class="count-icon" aria-hidden="true" />
          {{ countText }}
        </span>

        <span v-if="refLabel" class="ref-chip">
          <Link2 :size="13" aria-hidden="true" />
          <span>{{ refLabel }}</span>
          <button
            type="button"
            class="ref-chip-remove"
            :title="t('common.remove_filter')"
            @click="emit('clearRef')"
          >
            <X :size="12" aria-hidden="true" />
            <span class="sr-only">{{ t('common.remove_filter') }}</span>
          </button>
        </span>
      </div>

      <div class="meta-actions">
        <button v-if="hasActiveFilters" type="button" class="clear-btn" @click="emit('clear')">
          <RotateCcw :size="14" aria-hidden="true" />
          <span>{{ clearLabel }}</span>
        </button>

        <div class="view-toggle" role="radiogroup" :aria-label="t('common.view_label')">
          <button
            v-for="option in VIEWS"
            :key="option.id"
            type="button"
            role="radio"
            class="view-btn"
            :class="{ active: view === option.id }"
            :aria-checked="view === option.id"
            :title="t(`common.view_${option.id}`)"
            @click="view = option.id"
          >
            <component :is="option.icon" :size="16" aria-hidden="true" />
            <span class="sr-only">{{ t(`common.view_${option.id}`) }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.listing-toolbar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* Busca à esquerda e selects à direita, todos com a mesma altura e alinhados pela base */
.filters-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.search-box {
  flex: 1;
  min-width: 260px;
  max-width: 440px;
}

.selects-group {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.meta-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.ref-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.3rem 0.25rem 0.65rem;
  border-radius: var(--radius-full);
  background-color: var(--primary-subtle);
  border: 1px solid var(--primary-border);
  color: var(--primary);
  font-size: var(--text-xs);
  font-weight: 600;
}

.ref-chip-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border: none;
  border-radius: var(--radius-full);
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.ref-chip-remove:hover {
  background-color: var(--primary);
  color: var(--text-on-primary);
}

.count {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--text-muted);
}

.count-icon {
  color: var(--primary);
}

.meta-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.clear-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.9rem;
  border-radius: var(--radius-full);
  background-color: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-size: var(--text-xs);
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
}

.clear-btn:hover {
  color: var(--text-on-primary);
  background-color: var(--primary);
  border-color: var(--primary);
}

.view-toggle {
  display: inline-flex;
  padding: 0.2rem;
  gap: 0.2rem;
  background-color: var(--bg-surface-2);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
}

.view-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.view-btn:hover {
  color: var(--text-primary);
}

.view-btn.active {
  background-color: var(--primary);
  color: var(--text-on-primary);
}

.view-btn:focus-visible,
.clear-btn:focus-visible,
.ref-chip-remove:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

@media (max-width: 640px) {
  .search-box {
    max-width: none;
    min-width: 100%;
  }

  .selects-group {
    width: 100%;
  }

  .selects-group > * {
    flex: 1 1 150px;
    min-width: 0;
  }
}
</style>
