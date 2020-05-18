<template>
  <div>
  </div>
</template>

<script>
export default {
  name: 'Accueil',
  data () {
    return {
      titre: "Accueil",
      boutons: [
        {
          text: 'Je souhaite donner une procuration',
          href: '/donner',
          icon: 'email-plus',
          color: 'success',
          flex: 12
        },
        {
          text: 'Je souhaite résilier une procuration',
          href: '/resilier',
          icon: 'trash-can',
          color: 'warning',
          flex: 12
        }
      ]
    }
  },
  created: function () {
    this.$store.dispatch('titreBoutons/changeBoutons', this.boutons)
    this.$store.dispatch('titreBoutons/changeTitre', this.titre)
  }
}
</script>
