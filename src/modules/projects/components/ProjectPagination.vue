<script setup>
import { useI18n } from 'vue-i18n'
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'

defineProps({
  prevProject: {
    type: Object,
    default: null
  },
  nextProject: {
    type: Object,
    default: null
  }
})

const { t } = useI18n()
</script>

<template>
  <nav v-if="prevProject || nextProject" class="project-pagination" aria-label="Navegação entre projetos">
    <!-- Slot Esquerdo (Anterior) -->
    <div class="pagination-slot left-slot">
      <router-link
        v-if="prevProject"
        :to="`/projects/${prevProject.id}`"
        class="pagination-btn prev-btn surface-card interactive"
      >
        <div class="icon-circle">
          <ArrowLeft :size="18" />
        </div>
        <div class="btn-content">
          <span class="direction-label">{{ t('project_detail.prev_project') }}</span>
          <span class="project-name-label" :title="prevProject.title">{{ prevProject.title }}</span>
        </div>
      </router-link>
    </div>

    <!-- Slot Direito (Próximo) -->
    <div class="pagination-slot right-slot">
      <router-link
        v-if="nextProject"
        :to="`/projects/${nextProject.id}`"
        class="pagination-btn next-btn surface-card interactive"
      >
        <div class="btn-content text-right">
          <span class="direction-label">{{ t('project_detail.next_project') }}</span>
          <span class="project-name-label" :title="nextProject.title">{{ nextProject.title }}</span>
        </div>
        <div class="icon-circle">
          <ArrowRight :size="18" />
        </div>
      </router-link>
    </div>
  </nav>
</template>

<style scoped>
.project-pagination {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-2xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--border-subtle);
  width: 100%;
}

.pagination-slot {
  display: flex;
  width: 100%;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: 1.15rem 1.4rem;
  border-radius: var(--radius-lg);
  width: 100%;
  min-height: 80px;
  text-decoration: none;
  transition: all var(--transition-fast);
  box-sizing: border-box;
}

.next-btn {
  justify-content: flex-end;
}

.pagination-btn:hover {
  border-color: var(--primary-border);
  transform: translateY(-2px);
  box-shadow: var(--shadow-card);
}

.icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  min-width: 42px;
  border-radius: var(--radius-full);
  background-color: var(--bg-surface-2);
  color: var(--text-secondary);
  flex-shrink: 0;
  transition: all var(--transition-fast);
}

.pagination-btn:hover .icon-circle {
  background-color: var(--primary);
  color: var(--text-on-primary);
}

.btn-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.text-right {
  text-align: right;
  align-items: flex-end;
}

.direction-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.project-name-label {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

@media (max-width: 640px) {
  .project-pagination {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
}
</style>
