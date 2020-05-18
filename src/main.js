/*
 * Copyright (c) 2020 César Lizurey <cesar@lizurey.fr>
 *
 * SPDX-License-Identifier: CC-BY-NC-SA-4.0
 * License-Filename: LICENSE.txt
 */

import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify'
import VueRouter from 'vue-router'
import 'es6-promise/auto'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)
Vue.use(VueRouter)
Vue.config.productionTip = false

const routes = [
  { path: '/', component: () => import('./components/Accueil.vue') },
  { path: '/:fonction', component: () => import('./components/BoutonsFonction.vue') },
  { path: '/:fonction/:cerfa/:typeElection', component: () => import('./components/Formulaire.vue') }
]

const router = new VueRouter({
  routes
})

new Vue({
  vuetify,
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
