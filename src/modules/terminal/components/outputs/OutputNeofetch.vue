<script setup>
import { computed } from 'vue'

/**
 * Saída do neofetch: logo em ASCII à esquerda, informações à direita e a
 * faixa de cores do tema embaixo. Em tela estreita o logo vai para cima.
 */
const props = defineProps({
  content: { type: Object, required: true }
})

// Cada caractere do logo ganha a cor de um neon (como o logo colorido do neofetch)
const COLORS = { ')': 'cyan', '<': 'magenta', '(': 'pink', '.': 'muted' }

/** Linhas do logo em trechos da mesma cor, para não gerar um span por caractere. */
const logoLines = computed(() =>
  props.content.logo.split('\n').map((line) => {
    const runs = []
    for (const char of line) {
      const color = COLORS[char] || 'plain'
      const last = runs.at(-1)
      if (last?.color === color) last.text += char
      else runs.push({ color, text: char })
    }
    return runs
  })
)

const SWATCHES = ['cyan', 'magenta', 'pink', 'yellow', 'orange', 'primary']
</script>

<template>
  <div class="neofetch">
    <pre class="logo" aria-hidden="true"><template v-for="(runs, i) in logoLines" :key="i"><span
      v-for="(run, j) in runs"
      :key="j"
      :class="`c-${run.color}`"
    >{{ run.text }}</span>{{ '\n' }}</template></pre>

    <div class="info">
      <p class="title">{{ content.title }}</p>
      <p class="rule" aria-hidden="true">{{ '-'.repeat(content.title.length) }}</p>
      <dl>
        <div v-for="[key, value] in content.rows" :key="key" class="row">
          <dt>{{ key }}:</dt>
          <dd>{{ value }}</dd>
        </div>
      </dl>
      <div class="swatches" aria-hidden="true">
        <span v-for="swatch in SWATCHES" :key="swatch" :class="`bg-${swatch}`" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.neofetch {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 1.5rem 2rem;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: 1.6;
}

.logo {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  line-height: 1.15;
}

.c-cyan {
  color: var(--neon-cyan);
}

.c-magenta {
  color: var(--neon-magenta);
}

.c-pink {
  color: var(--neon-pink);
}

.c-muted {
  color: var(--text-muted);
}

.title {
  color: var(--neon-cyan);
  font-weight: 700;
}

.rule {
  color: var(--text-muted);
}

.row {
  display: flex;
  gap: 0.5rem;
}

dt {
  color: var(--neon-magenta);
  font-weight: 700;
}

dd {
  margin: 0;
  color: var(--text-secondary);
}

.swatches {
  display: flex;
  gap: 0;
  margin-top: 0.75rem;
}

.swatches span {
  width: 1.5rem;
  height: 0.9rem;
}

.bg-cyan {
  background: var(--neon-cyan);
}

.bg-magenta {
  background: var(--neon-magenta);
}

.bg-pink {
  background: var(--neon-pink);
}

.bg-yellow {
  background: var(--neon-yellow);
}

.bg-orange {
  background: var(--neon-orange);
}

.bg-primary {
  background: var(--primary);
}
</style>
