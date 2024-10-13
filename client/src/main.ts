import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

import ProgressSpinner from 'primevue/progressspinner';

const app = createApp(App)

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.component('ProgressSpinner', ProgressSpinner)

app.use(router)

app.mount('#app')
