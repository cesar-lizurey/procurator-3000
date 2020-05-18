const state = {
  titre: '',
  listeBoutons: []
}

const getters = {
  titre: state => {
    return state.titre
  },
  listeBoutons: state => {
    return state.listeBoutons
  }
}

const mutations = {
  changeBoutons: (state, boutons) => {
    state.listeBoutons = []
    boutons.forEach(function (bouton) {
      state.listeBoutons.push(bouton)
    })
  },
  changeTitre: (state, titre) => {
    state.titre = titre
  }
}

const actions = {
  changeBoutons ({ commit }, boutons) {
    commit('changeBoutons', boutons)
  },
  changeTitre ({ commit }, titre) {
    commit('changeTitre', titre)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
