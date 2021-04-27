import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const messages = {
  en: {
    welcomeMsg: 'Welcome to Your Vue.js App'
  },
  vi: {
    welcomeMsg: 'Chào mừng đến với ứng dụng Vue.js của bạn'
  }
}

const i18n = new VueI18n({
  locale: 'vi', // set locale
  fallbackLocale: 'vi', // set fallback locale
  messages // set locale messages
})

export default i18n
