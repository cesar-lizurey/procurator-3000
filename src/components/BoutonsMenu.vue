<template>
  <div>
    <v-app-bar
      color="blue accent-4"
      dense
      dark
      >
      <router-link
          to="/"
          exact>
        <v-btn icon>
          <v-icon>mdi-home</v-icon>
        </v-btn>
      </router-link>
      <v-toolbar-title>{{ titre }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="text-center">
        <v-bottom-sheet v-model="aPropos" inset>
          <template v-slot:activator="{ on: sheet }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on: tooltip }">
                <v-btn
                  class="mx-2"
                  fab
                  dark
                  small
                  v-on="{ ...tooltip, ...sheet }"
                  color="light-blue">
                  <v-icon dark>mdi-help-circle-outline</v-icon>
                </v-btn>
              </template>
              <span>À propos</span>
            </v-tooltip>
          </template>
          <v-sheet class="text-center">
            <div class="my-3">Développé par César LIZUREY</div>
            <div class="my-3">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn href="https://www.facebook.com/cesar.lizurey" target="_blank" class="mx-2" color="primary" fab x-small dark v-on="on">
                    <v-icon>mdi-facebook</v-icon>
                  </v-btn>
                </template>
                <span>Facebook</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn href="https://twitter.com/CesarLizurey" target="_blank" class="mx-2" color="primary" fab x-small dark v-on="on">
                    <v-icon>mdi-twitter</v-icon>
                  </v-btn>
                </template>
                <span>Twitter</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn href="https://www.linkedin.com/in/cesarlizurey" target="_blank" class="mx-2" color="primary" fab x-small dark v-on="on">
                    <v-icon>mdi-linkedin</v-icon>
                  </v-btn>
                </template>
                <span>LinkedIn</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn href="mailto:cesar@lizurey.fr" class="mx-2" color="light-blue" fab x-small dark v-on="on">
                    <v-icon>mdi-email</v-icon>
                  </v-btn>
                </template>
                <span>Courriel</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn href="http://cesar.lizurey.fr" target="_blank" class="mx-2" color="orange" fab x-small dark v-on="on">
                    <v-icon>mdi-firefox</v-icon>
                  </v-btn>
                </template>
                <span>Site internet</span>
              </v-tooltip>
            </div>
            <div class="my-3">
              <div class="my-2">
                <v-btn  href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr" target="_blank" text small color="primary">Licence: BY-NC-SA 4.0</v-btn>
              </div>
            </div>
            <div class="my-3">
              <v-btn href="https://github.com/cesar-lizurey/procurator-3000/" target="_blank" class="ma-2" tile outlined color="primary">
                <v-icon left>mdi-github</v-icon> Page GitHub du projet
              </v-btn>
            </div>
            <v-btn
              class="mt-6"
              text
              color="error"
              @click="aPropos = !aPropos"
            >Fermer</v-btn>
          </v-sheet>
        </v-bottom-sheet>
      </div>
    </v-app-bar>
    <v-container class="grey lighten-5">
      <v-row
        justify="center"
        align-content="center"
        v-for="bouton in listeBoutons" :key="bouton.text">
        <router-link
          class="py-2"
          :to="bouton.href"
          exact>
          <v-btn class="mx-10" x-large :color=bouton.color dark>
            <v-icon left>mdi-{{ bouton.icon }}</v-icon>
            {{ bouton.text }}
          </v-btn>
        </router-link>
      </v-row>
      <v-spacer></v-spacer>
    </v-container>
  </div>

</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'BoutonsMenu',
  data () {
    return {
      aPropos: false
    }
  },
  computed: mapState({
    listeBoutons: state => state.titreBoutons.listeBoutons,
    titre: state => state.titreBoutons.titre
  })
}
</script>
