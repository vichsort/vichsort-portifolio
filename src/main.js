import '@/core/styles/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/core/router'
import i18n from '@/core/i18n'

const app = createApp(App)

app.use(router)
app.use(i18n)

// Monta só com a primeira página resolvida (o chunk dela já baixado): até lá fica a tela de
// carregamento do index.html, em vez da navbar e do footer colados sem conteúdo no meio
router.isReady().then(() => app.mount('#app'))