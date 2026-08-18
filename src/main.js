import '@/core/styles/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/core/router'
import i18n from '@/core/i18n'

const app = createApp(App)

app.use(router)
app.use(i18n)

app.mount('#app')