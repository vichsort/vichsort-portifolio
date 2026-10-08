import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { fromMonthIndex } from '../core/graphData'

/** Formata índices de mês (ver graphData.monthIndex) no idioma ativo: "out. de 2025", "mai. 2025 – set. 2026". */
export function usePeriod() {
  const { locale } = useI18n()
  const formatter = computed(() => new Intl.DateTimeFormat(locale.value, { month: 'short', year: 'numeric' }))

  const month = (index) => {
    const { year, month } = fromMonthIndex(index)
    return formatter.value.format(new Date(year, month - 1, 1))
  }

  const period = (start, end) => (start === end ? month(start) : `${month(start)} – ${month(end)}`)

  return { month, period }
}
