<template>
  <form
    ref="resilierProcurationForm"
    @submit="checkForm"
    novalidate="true"
  >
    <v-container>
      <v-dialog v-model="pieceIdentite" persistent max-width="600">
        <v-card>
          <v-card-title class="headline">Pièce d'identité</v-card-title>
          <v-card-text>
            Vous devez justifier de votre identité en produisant une pièce d’identité (carte nationale d'identité, passeport, permis de conduire, etc.). Constitue une pièce d’identité tout document officiel délivré par une administration publique comportant les noms, prénoms, date et lieu de naissance de l'intéressé ainsi que sa photographie, sa signature et l'identification de l'autorité qui a délivré le document, la date et le lieu de délivrance.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="pieceIdentite = false">J'ai une pièce d'identité</v-btn>
            <v-btn color="red darken-1" text @click="afficheErreur('identite')" >Je n'en ai pas</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="erreur" persistent max-width="600">
        <v-card>
          <v-card-title class="headline">Impossible de réaliser la procuration</v-card-title>
          <v-card-text>
            {{ precisionImpossibilite }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="erreur = ''">Je corrige mon choix</v-btn>
            <router-link
              to="/"
              exact>
              <v-btn color="red darken-1" text>C'est compris</v-btn>
            </router-link>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="reponseDemande.retour" persistent max-width="600">
        <v-card>
          <v-card-title class="headline">{{ reponseDemande.titre }}</v-card-title>
          <v-card-text>
            {{ reponseDemande.texte }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <router-link
              to="/"
              exact>
              <v-btn color="green darken-1" text>Revenir au formulaire vierge</v-btn>
            </router-link>
            <v-btn color="red darken-1" text @click="reponseDemande.retour = false">Rester sur le formulaire</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-row>
        <v-col
          md="5"
        >
          <v-text-field
            v-model="models.mandant.nom"
            label="Nom de naissance"
            :rules="regles.nom"
            hide-details="auto"></v-text-field>
        </v-col>
        <v-col
          md="5"
        >
          <v-text-field
            v-model="models.mandant.prenom"
            label="Prénoms"
            :rules="regles.prenom"
            hide-details="auto"></v-text-field>
        </v-col>
        <v-col
          md="2"
        >
          <v-dialog
            v-model="menuDateNaissanceMandant"
            persistent
            width="290px"
            >
            <template v-slot:activator="{ onMandant }">
              <v-text-field
                v-model="dateNaissanceMandantFormatee"
                label="Date de naissance"
                :rules="regles.dateNaissance"
                prepend-icon="mdi-calendar-range"
                readonly
                @focus="menuDateNaissanceMandant = true"
                v-on="onMandant"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="models.mandant.dateNaissance"
              no-title
              min="1920-01-01"
              max="2002-12-31"
              locale="fr"
              first-day-of-week="1"
              ref="dialogPicker"
              @input="menuDateNaissanceMandant = false"
            ></v-date-picker>
          </v-dialog>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          md="6"
        >
          <v-text-field
            v-model="models.mandant.courriel"
            label="Courriel"
            prepend-icon="mdi-email"
            :rules="regles.courriel"
            hide-details="auto"></v-text-field>
        </v-col>
        <v-col
          md="6"
        >
          <v-text-field
            v-model="models.mandant.telephone"
            label="Téléphone"
            prepend-icon="mdi-phone"
            :rules="regles.telephone"
            hide-details="auto"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="2"
          align-self="center"
        >
          <v-icon>mdi-home</v-icon>
          Adresse
        </v-col>
        <v-col
          cols="1">
          <v-text-field
            v-model="models.mandant.adresseNum"
            label="Numéro"
            :error="erreurAdresseMandant"
            :rules="regles.adresseNum"
            hide-details="auto"></v-text-field>
        </v-col>
        <v-col
          cols="1">
          <v-text-field
            v-model="models.mandant.adresseBis"
            label="bis, ter, etc."
            :error="erreurAdresseMandant"
            :rules="regles.adresseBis"
            hide-details="auto"></v-text-field>
        </v-col>
        <v-col
          cols="2">
          <v-text-field
            v-model="models.mandant.adresseType"
            label="Type de voie"
            :error="erreurAdresseMandant"
            :rules="regles.adresseType"
            hide-details="auto"></v-text-field>
        </v-col>
        <v-col
          cols="6">
          <v-text-field
            v-model="models.mandant.adresseVoie"
            label="Nom de la voie"
            :error="erreurAdresseMandant"
            :error-messages="erreurAdresseMessageMandant"
            :rules="regles.adresseVoie"
            hide-details="auto"></v-text-field>
        </v-col>

      </v-row>
      <v-row>
        <v-col
          cols="4"
          offset="2"
        >
          <v-text-field
            v-model="models.mandant.communeResidence"
            label="Commune"
            :rules="regles.communeResidence"
            hide-details="auto"></v-text-field>
        </v-col>
        <v-col
          cols="2"
        >
          <v-text-field
            v-model="models.mandant.codePostal"
            label="Code postal"
            :rules="regles.codePostal"
            hide-details="auto"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="3"
          align-self="center"
        >
          <v-icon>mdi-vote</v-icon>
          Inscription sur la liste électorale
        </v-col>
        <v-col>
          <v-radio-group v-model="models.mandant.communeConsulat" row>
            <v-radio label="Commune" value="commune"></v-radio>
            <v-radio label="Consulat" value="consulat"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col
          cols="6"
          v-if="models.mandant.communeConsulat == 'consulat'"
        >
          <v-autocomplete
            v-model="models.mandant.consulat"
            :items="consulatAPI"
            :loading="isLoading"
            :search-input.sync="searchConsulat"
            :filter="filtreNormaliseConsulat"
            clearable
            hide-details
            hide-selected
            item-text="nom"
            return-object
            label="Cherchez un pays..."
            solo
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-title>
                  Entrez le
                  <strong>pays</strong>
                </v-list-item-title>
              </v-list-item>
            </template>
            <template v-slot:selection="{ attr, on, item, selected }">
              <v-icon left>mdi-earth</v-icon>
              <span v-text="item.nom"></span>
            </template>
            <template v-slot:item="{ item }">
              <v-list-item-avatar
                color="indigo"
                class="headline font-weight-light white--text"
              >
                {{ item.codePays.toUpperCase() }}
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item.nom"></v-list-item-title>
                <v-list-item-subtitle v-text="item.ville + ', ' + item.pays"></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon>mdi-earth</v-icon>
              </v-list-item-action>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col
          cols="6"
          v-if="models.mandant.communeConsulat == 'commune'"
        >
          <v-autocomplete
            v-model="models.mandant.communeInscription"
            :items="communesAPI"
            :loading="isLoading"
            :search-input.sync="search"
            :filter="filtreNormalise"
            clearable
            hide-details
            hide-selected
            item-text="commune"
            return-object
            label="Cherchez une commune..."
            solo
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-title>
                  Entrez la
                  <strong>commune</strong>
                </v-list-item-title>
              </v-list-item>
            </template>
            <template v-slot:selection="{ attr, on, item, selected }">
              <v-icon left>mdi-city</v-icon>
              <span v-text="item.commune.replace(/cedex/i, '')"></span>
            </template>
            <template v-slot:item="{ item }">
              <v-list-item-avatar
                color="indigo"
                class="headline font-weight-light white--text"
              >
                {{ item.codePostal.slice(0,-3).length == 2 ? item.codePostal.slice(0,-3) : '0' + item.codePostal.slice(0,-3) }}
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item.commune.replace(/cedex/i, '')"></v-list-item-title>
                <v-list-item-subtitle v-text="item.adresse.replace(/\|/g, ' ') + ', ' + item.codePostal + ' ' + item.commune"></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon>mdi-city</v-icon>
              </v-list-item-action>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col align="center">
          <v-btn
            color="primary"
            :disabled="valideResiliation"
            :loading="impressionEnCours"
            @click="soumettreResiliation">Demander la résiliation</v-btn>
          <v-btn text @click="etape = 2">Annuler</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </form>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ResilierProcuration1495201',
  watch: {
    menuDateNaissanceMandant (value) {
      value && this.$nextTick(() => { this.$refs.dialogPicker.activePicker = 'YEAR' })
    },
    menuDateNaissanceMandataire (value) {
      value && this.$nextTick(() => { this.$refs.dialogPicker.activePicker = 'YEAR' })
    },
    searchConsulat (val) {
      var elt = this
      clearTimeout(elt.rechercheAPI)
      if (!val) return
      // si on n'a pas suffisamment de lettres, on ne recherche pas
      if (val.length >= 1 && val.length < 3) {
        elt.consulatAPI = []
        return
      }
      if (val.length >= 3) {
        elt.isLoading = true
      }
      elt.rechercheAPI = setTimeout(function () {
        fetch(elt.config.adresse + '/consulat/' + val)
          .then(res => res.json())
          .then(res => {
            elt.consulatAPI = res.data
          })
          .catch(err => {
            elt.consulatAPI = []
            elt.reponseDemande = {
              "retour": true,
              "reponse": "KO",
              "titre": "Erreur",
              "texte": err
            }
          })
          .finally(() => (elt.isLoading = false))
      }, 1500)
    },
    search (val) {
      var elt = this
      clearTimeout(elt.rechercheAPI)
      if (!val) return
      // si on n'a pas suffisamment de lettres, on ne recherche pas
      if (val.length >= 1 && val.length < 3) {
        elt.communesAPI = []
        return
      }
      if (val.length >= 3) {
        elt.isLoading = true
      }
      elt.rechercheAPI = setTimeout(function () {
        elt.isLoading = true
        fetch(elt.config.adresse + '/communes/' + val)
          .then(res => res.json())
          .then(res => {
            elt.communesAPI = res.data
          })
          .catch(err => {
            elt.communesAPI = []
            elt.reponseDemande = {
              "retour": true,
              "reponse": "KO",
              "titre": "Erreur",
              "texte": err
            }
          })
          .finally(() => (elt.isLoading = false))
      }, 1500)
    }
  },
  data () {
    return {
      titre: "Résiliation d'une procuration - " + this.$route.params.typeElection,
      boutons: [
        {
          text: 'Retour à l\'accueil',
          href: '/',
          icon: 'arrow-left-circle',
          color: 'success'
        }
      ],
      isLoading: false,
      rechercheAPI: '',
      communesAPI: [],
      consulatAPI: [],
      search: null,
      searchConsulat: null,
      erreur: false,
      precisionImpossibilite: '',
      impressionEnCours: false,
      pieceIdentite: true,
      menuDateNaissanceMandant: false,
      reponseDemande: { retour: false },
      models: {
        typeElection: this.$route.params.typeElection,
        cerfa: this.$route.params.cerfa,
        mandant: {
          nom: '',
          prenom: '',
          dateNaissance: '',
          adresseNum: '',
          adresseBis: '',
          adresseType: '',
          adresseVoie: '',
          codePostal: '',
          communeResidence: '',
          communeInscription: '',
          communeConsulat: '',
          consulat: '',
          telephone: '',
          courriel: ''
        }
      },
      regles: {
        nom: [
          value => !!value || 'Obligatoire'
        ],
        prenom: [
          value => !!value || 'Obligatoire'
        ],
        dateNaissance: [
          value => !!value || 'Obligatoire',
          value => /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/.test(value)
        ],
        communeResidence: [
          value => !!value || 'Obligatoire'
        ],
        communeInscription: [
          value => (value.commune || '').length > 0 || 'Obligatoire'
        ],
        codePostal: [
          value => !!value || 'Obligatoire',
          value => /^\d{1}[0-9AB]{1}\d{3}$/.test(value) || 'Invalide'
        ],
        consulat: [
          value => (!!value && this.models.mandant.communeConsulat === 'consulat') || 'Obligatoire'
        ],
        courriel: [
          value => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) || 'Invalide'
        ],
        telephone: [
        ]
      }
    }
  },
  computed: {
    motifsSelect () {
      var retour = []
      for (const property in this.motifs) {
        retour.push({
          value: property,
          text: this.motifs[property].valeur
        })
      }
      return retour
    },
    valideResiliation () {
      var m = this.models.mandant
      return ((m.nom === '') || (m.prenom === '') || (m.dateNaissance === '') || (m.codePostal === '') || !(/^\d{1}[0-9AB]{1}\d{3}$/.test(m.codePostal)) || (m.communeResidence === '') || (m.communeConsulat === '') || ((m.communeConsulat === 'commune') && ((!m.communeInscription) || (m.communeInscription === ''))) || ((m.communeConsulat === 'consulat') && (m.consulat === '')) || ((m.adresseNum === '') && (m.adresseBis === '') && (m.adresseVoie === '') && (m.adresseType === '')))
    },
    erreurAdresseMandant () {
      return (this.models.mandant.adresseEtage === '') && (this.models.mandant.adresseBP === '') && (this.models.mandant.adresseNumLibelle === '')
    },
    erreurAdresseMessageMandant () {
      return ((this.models.mandant.adresseEtage === '') && (this.models.mandant.adresseBP === '') && (this.models.mandant.adresseNumLibelle === '')) ? 'Au moins un des trois champs adresse doit être rempli.' : []
    },
    dateNaissanceMandantFormatee () {
      return this.formatDate(this.models.mandant.dateNaissance)
    },
    dateNaissanceMandataireFormatee () {
      return this.formatDate(this.models.mandataire.dateNaissance)
    },
    ...mapState({
      listeCommunes: state => state.communes.listeCommunes,
      config: state => state.serveur.config
    })
  },
  methods: {
    afficheErreur (type) {
      switch (type) {
        case 'identite': {
          // this.pieceIdentite = false
          this.precisionImpossibilite = "Si vous n'avez pas de pièce d'identité, il n'est pas possible d'établir une procuration."
          break
        }
      }
      this.erreur = true
    },
    filtreNormalise (item, queryText, itemText) {
      const textOne = item.commune.normalize("NFD").replace(/-/g, ' ').replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/saint/g, 'st').trim()
      const searchText = queryText.normalize("NFD").replace(/-/g, ' ').replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/saint/g, 'st').trim()

      return textOne.indexOf(searchText) > -1
    },
    filtreNormaliseConsulat (item, queryText, itemText) {
      const textOne = item.pays.normalize("NFD").replace(/-/g, ' ').replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
      const searchText = queryText.normalize("NFD").replace(/-/g, ' ').replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()

      return textOne.indexOf(searchText) > -1
    },
    formatDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    soumettreResiliation: function () {
      this.impressionEnCours = true
      let elt = this
      this.axios.post(elt.config.adresse + '/' + elt.config.fonction + '/resiliation/' + this.$route.params.cerfa, this.models,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/pdf'
          },
          responseType: (elt.config.fonction === "telechargement") ? "blob" : "json"
        })
        .then(function (response) {
          switch (elt.config.fonction) {
            case "impression": {
              elt.reponseDemande = response.data
              elt.impressionEnCours = false
              break
            }
            case "telechargement": {
              const blob = new Blob([response.data], { type: 'application/pdf' })
              const objectUrl = window.URL.createObjectURL(blob)
              window.open(objectUrl)
              elt.impressionEnCours = false
              break
            }
          }
        })
        .catch(function (error) {
          elt.reponseDemande = error
          elt.impressionEnCours = false
        })
    },
    checkForm: function () {
      this.etape = 2
    }
  },
  created: function () {
    this.$store.dispatch('titreBoutons/changeBoutons', this.boutons)
    this.$store.dispatch('titreBoutons/changeTitre', this.titre)
  }
}
</script>
