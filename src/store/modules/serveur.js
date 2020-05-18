const state = {
  config: {
    adresse: "http://localhost:9114",
    fonction: "telechargement"
  }
}

const getters = {
  serveur: state => {
    return state.serveur
  }
}

export default {
  namespaced: true,
  state,
  getters
}
