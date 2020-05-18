import Vue from 'vue'
import Vuex from 'vuex'
import titreBoutons from './modules/titreBoutons'
import communes from './modules/communes'
import serveur from './modules/serveur'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    titreBoutons,
    communes,
    serveur
  }
})
