<template>
  <div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Accueil',
  data () {
    return {
      titre: "",
      boutons: []
    }
  },
  computed: {
    ...mapState({
      config: state => state.serveur.config
    })
  },
  async created () {
    let elt = this
    this.axios.get(elt.config.adresse + '/boutonsElections/' + this.$route.params.fonction, {
      responseType: 'json'
    })
      .then(response => (this.boutons = response.data))
      .finally(() => {
        var titres = {
          donner: "Donner une procuration",
          resilier: "Résilier une procuration"
        }
        this.$store.dispatch('titreBoutons/changeBoutons', this.boutons)
        this.$store.dispatch('titreBoutons/changeTitre', titres[this.$route.params.fonction])
      })
  }
}
</script>
