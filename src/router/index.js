import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Questionnaire from '../views/Questionnaire.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/',                name: 'home',               component: Home },
  { path: '/questionnaire',   name: 'questionnaire',      component: Questionnaire }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
