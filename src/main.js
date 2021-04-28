import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import Vuetify from 'vuetify'
import axios from 'axios'
import 'vuetify/dist/vuetify.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import '@mdi/font/css/materialdesignicons.css'
import './assets/style.css'

Vue.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true
});

Vue.use(Vuetify)

Vue.config.productionTip = false

Vue.prototype.$urlAPI = 'http://103.9.159.241:5000/api/'

Vue.prototype.$config = {
  headers: {
    "Authorization": "Bearer " + localStorage.getItem("token"),
  }
}

Vue.prototype.CallAPI = function (method, url, data, callResponse, callError) {
  switch (method) {
    case 'post':
      axios
        .post(this.$urlAPI + url, data, this.$config)
        .then(response => {
          if (response.data.statusCode === 401) {
            sessionStorage.clear()
            location.reload()
          }
          callResponse(response)
        })
        .catch(error => {
          callError(error)
        })
      break
    case 'get':
      axios
        .get(this.$urlAPI + url, this.$config)
        .then(response => {
          if (response.data.statusCode === 401) {
            sessionStorage.clear()
            location.reload()
          }
          callResponse(response)
        })
        .catch(error => {
          callError(error)
        })
      break
    case 'put':
      axios
        .put(this.$urlAPI + url, data, this.$config)
        .then(response => {
          if (response.data.statusCode === 401) {
            sessionStorage.clear()
            location.reload()
          }
          callResponse(response)
        })
        .catch(error => {
          callError(error)
        })
      break
    case 'delete':
      axios
        .delete(this.$urlAPI + url, this.$config)
        .then(response => {
          if (response.data.statusCode === 401) {
            sessionStorage.clear()
            location.reload()
          }
          callResponse(response)
        })
        .catch(error => {
          callError(error)
        })
      break
  }
}

new Vue({
  vuetify: new Vuetify(),
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
