import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

// after pinia is installed, initialize auth store so axios header is set if token exists
import { useAuthStore } from './stores/auth'
const auth = useAuthStore()
auth.init()

app.mount('#app')
