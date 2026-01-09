import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('user-lang') || 'pt', 
  fallbackLocale: 'en',
  globalInjection: true,
  messages: {}
})

export default i18n