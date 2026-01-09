import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('user-lang') || 'pt', 
  fallbackLocale: 'en',
  globalInjection: true,
  messages: messages
})

export default i18n