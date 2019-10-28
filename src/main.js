import Vue from 'vue'
import App from './App.vue'
import router from './router'
import PouchDB from 'pouchdb'
import './registerServiceWorker'

Vue.config.productionTip = false

// expose the DB in all vue components
Vue.prototype.$pouchdb = new PouchDB('questionnaire')
//Vue.prototype.$pouchdb.sync('http://localhost:8001/questionnaire')

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
