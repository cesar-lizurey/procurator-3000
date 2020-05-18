const state = {
  listeCommunes: [
    { commune: 'Bélep', codePostal: '98811', province: 'Nord' },
    { commune: 'Boulouparis', codePostal: '98812', province: 'Sud' },
    { commune: 'Bourail', codePostal: '98870', province: 'Sud' },
    { commune: 'Canala', codePostal: '98813', province: 'Nord' },
    { commune: 'Dumbéa', codePostal: '98835', province: 'Sud' },
    { commune: 'Farino', codePostal: '98881', province: 'Sud' },
    { commune: 'Hienghène', codePostal: '98815', province: 'Nord' },
    { commune: 'Houaïlou', codePostal: '98816', province: 'Nord' },
    { commune: 'Île des Pins', codePostal: '98832', province: 'Sud' },
    { commune: 'Kaala-Gomen', codePostal: '98817', province: 'Nord' },
    { commune: 'Koné', codePostal: '98859', province: 'Nord' },
    { commune: 'Kouaoua', codePostal: '98818', province: 'Nord' },
    { commune: 'Koumac', codePostal: '98850', province: 'Nord' },
    { commune: 'La Foa', codePostal: '98880', province: 'Sud' },
    { commune: 'Lifou', codePostal: '98820', province: 'Îles Loyauté' },
    { commune: 'Maré', codePostal: '98828', province: 'Îles Loyauté' },
    { commune: 'Moindou', codePostal: '98819', province: 'Sud' },
    { commune: 'Mont-Dore', codePostal: '98809', province: 'Sud' },
    { commune: 'Nouméa', codePostal: '98800', province: 'Sud' },
    { commune: 'Ouégoa', codePostal: '98821', province: 'Nord' },
    { commune: 'Ouvéa', codePostal: '98814', province: 'Îles Loyauté' },
    { commune: 'Païta', codePostal: '98889', province: 'Sud' },
    { commune: 'Poindimié', codePostal: '98822', province: 'Nord' },
    { commune: 'Ponérihouen', codePostal: '98823', province: 'Nord' },
    { commune: 'Pouébo', codePostal: '98824', province: 'Nord' },
    { commune: 'Pouembout', codePostal: '98825', province: 'Nord' },
    { commune: 'Poum', codePostal: '98826', province: 'Nord' },
    { commune: 'Poya', codePostal: '98827', province: 'Nord' },
    { commune: 'Sarraméa', codePostal: '98882', province: 'Sud' },
    { commune: 'Thio', codePostal: '98829', province: 'Sud' },
    { commune: 'Touho', codePostal: '98831', province: 'Nord' },
    { commune: 'Voh', codePostal: '98833', province: 'Nord' },
    { commune: 'Yaté', codePostal: '98834', province: 'Sud' }
  ]
}

const getters = {
  listeCommunes: state => {
    return state.listeCommunes
  }
}

export default {
  namespaced: true,
  state,
  getters
}
