import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

var isAuthenticated = false
if (localStorage.getItem('token')) isAuthenticated = true

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    beforeEnter: (to, from, next) => {
      if (to.name == 'Login' && isAuthenticated) {
        next({ name: 'Home' })
      }
      next()
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// router.beforeEach((to, from, next) => {
//   if (to.name != 'Login' && to.name != 'Register' && !isAuthenticated) next({ name: 'Login' })
//   next()
// })

export default router
