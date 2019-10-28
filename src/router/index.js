import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Questionnaire from '../views/Questionnaire.vue'
import Admin from '../views/Admin.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/questionnaire/:prenom/:nom/:societe',
        name: 'questionnaire',
        component: Questionnaire,
        props: true
    },
    {
        path: '/admin',
        name: 'admin',
        component: Admin
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router