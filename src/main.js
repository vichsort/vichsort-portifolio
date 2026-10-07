import '@/core/styles/index.css'
import { createApp } from 'vue'
import UnderConstruction from './UnderConstruction.vue'
import i18n from '@/core/i18n'

const app = createApp(UnderConstruction)

app.use(i18n)

app.mount('#app')
