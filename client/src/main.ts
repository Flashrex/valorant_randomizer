import './assets/main.css'
import "/node_modules/flag-icons/css/flag-icons.min.css";

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n';

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

import ProgressSpinner from 'primevue/progressspinner';

import deDE from './locales/de-DE.json';
import enUS from './locales/en-US.json';
import esES from './locales/es-ES.json';
import fiFI from './locales/fi-FI.json';
import frFR from './locales/fr-FR.json';
import itIT from './locales/it-IT.json';

const app = createApp(App)

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.component('ProgressSpinner', ProgressSpinner)

app.use(router)

const i18n = createI18n({
    locale: 'de',
    fallbackLocale: 'us',
    messages: {
        de: deDE,
        us: enUS,
        es: esES,
        fi: fiFI,
        fr: frFR,
        it: itIT
    }
})

app.use(i18n)

app.mount('#app')
