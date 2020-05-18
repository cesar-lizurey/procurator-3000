<template>
  <form
    ref="resilierProcurationForm"
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
            <v-btn color="red darken-1" text href="javascript:history.back()">Je n'en ai pas</v-btn>
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
      <v-alert
        outlined
        type="warning"
        prominent
        border="left"
      >
        Vous ne pouvez pas résilier par ce formulaire une procuration établie pour un autre scrutin. Par ce formulaire, vous ne pouvez donc résilier qu’une procuration également établie pour la consultation sur l’accession de la Nouvelle-Calédonie à la pleine souveraineté. Les autres procurations que vous auriez établies pour les autres scrutins demeurent valables.
      </v-alert>
      <v-row>
        <v-col
          md="3"
        >
          <v-text-field
            v-model="models.mandant.nom"
            label="Nom de naissance"
            :rules="regles.nom"
            hide-details="auto"></v-text-field>
        </v-col>
        <v-col
          md="4"
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
        <v-col
          md="3"
        >
          <v-text-field
            v-model="models.mandant.communeNaissance"
            label="Commune de naissance"
            :rules="regles.communeNaissance"
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
          cols="8">
          <v-text-field
            v-model="models.mandant.adresseNumLibelle"
            label="Numéro et libellé de la voie"
            :error="erreurAdresseMandant"
            :error-messages="erreurAdresseMessageMandant"
            :rules="regles.adresseNumLibelle"
            hide-details="auto"></v-text-field>
        </v-col>
        <v-col
          cols="2"
        >
          <v-select
            v-model="models.mandant.communeResidence"
            :hint="models.mandant.communeResidence.commune?`${models.mandant.communeResidence.codePostal}, Province ${models.mandant.communeResidence.province}`:''"
            :items="listeCommunes"
            item-text="commune"
            item-value="commune"
            label="Commune"
            :rules="regles.communeResidence"
            persistent-hint
            single-line
            return-object
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="4"
          offset="2"
        >
          <v-text-field
            v-model="models.mandant.adresseEtage"
            label="Étage, escalier, appartement - immeuble, bâtiment"
            :error="erreurAdresseMandant"
            :error-messages="erreurAdresseMessageMandant"
            :rules="regles.adresseEtage"
            hide-details="auto"></v-text-field>
        </v-col>
        <v-col
          cols="4"
        >
          <v-text-field
            v-model="models.mandant.adresseBP"
            label="Lieu-dit, boîte postale, commune déléguée"
            :error="erreurAdresseMandant"
            :error-messages="erreurAdresseMessageMandant"
            :rules="regles.adresseBP"
            hide-details="auto"></v-text-field>
        </v-col>
        <v-col
          cols="2"
        >
          <v-text-field
            @focus="resetCP()"
            ref="codePostal"
            v-model="models.mandant.codePostal"
            label="Code postal"
            :rules="regles.codePostal"
            :hint="this.models.mandant.communeResidence.codePostal!==''?`Pourrait être ${this.models.mandant.communeResidence.codePostal}`:''"
            hide-details="auto"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="4"
          align-self="center"
        >
          <v-icon>mdi-vote</v-icon>
          Commune d'inscription sur la liste électorale
        </v-col>
        <v-col
          cols="2"
        >
          <v-select
            v-model="models.mandant.communeInscription"
            :items="listeCommunes"
            item-text="commune"
            item-value="commune"
            label="Commune"
            :rules="regles.communeInscription"
            persistent-hint
            single-line
            return-object
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col align="center">
          <v-btn
            color="primary"
            :disabled="valideResiliation"
            :loading="impressionEnCours"
            @click="soumettreResiliation">Demander la résiliation</v-btn>
          <v-btn text @click="etape++">Annuler</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </form>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ResilierProcuration1590202',
  watch: {
    menuDateNaissanceMandant (value) {
      value && this.$nextTick(() => { this.$refs.dialogPicker.activePicker = 'YEAR' })
    }
  },
  data () {
    return {
      titre: "Résiliation d'une procuration pour le referendum",
      boutons: [
        {
          text: 'Retour à l\'accueil',
          href: '/',
          icon: 'arrow-left-circle',
          color: 'success'
        }
      ],
      pieceIdentite: true,
      impressionEnCours: false,
      menuDateNaissanceMandant: false,
      reponseDemande: 'En attente',
      motifs: {
        'prof': {
          valeur: 'En raison d\'obligations professionnelles',
          details: 'Je produis toutes justifications de nature à emporter la conviction de l\'autorité habilitée à établir la procuration.'
        },
        'form': {
          valeur: 'En raison d\'obligations de formation',
          details: 'Je produis une attestation fournie par l\'organisme de formation, signée et datée.'
        },
        'handicap': {
          valeur: "En raison d’un handicap",
          details: "Je produis tout document officiel justifiant une situation de handicap."
        },
        'santé': {
          valeur: "Pour raison de santé",
          details: "Je produis un certificat médical, signé et daté."
        },
        'absence': {
          valeur: "En raison d’une absence de Nouvelle-Calédonie",
          details: "Je produis toutes justifications de nature à emporter la conviction de l’autorité habilitée à établir la procuration, et notamment l'une des pièces suivantes : autorisation d'absence établie par l'employeur au titre des congés annuels, titres de transport, contrat de location, réservation d’hébergement, facture d'achat d'un voyage."
        },
        'assistance': {
          valeur: "En raison de l’assistance apportée à une personne malade ou infirme",
          details: "Je produis une attestation signée et datée de la personne assistée, ainsi qu’un certificat médical ou tout document officiel justifiant de la situation handicapant la personne assistée. Lorsque la personne assistée se trouve dans l’impossibilité de signer l’attestation, la signature peut être apposée par une personne de son choix qui fait suivre sa signature de la mention suivante : l’électeur ne peut signer lui-même."
        }
      },
      models: {
        typeElection: this.$route.params.typeElection,
        cerfa: this.$route.params.cerfa,
        mandant: {
          nom: '',
          prenom: '',
          dateNaissance: '',
          adresseEtage: '',
          adresseNumLibelle: '',
          adresseBP: '',
          codePostal: '',
          communeResidence: { commune: '', codePostal: '', province: '' },
          communeInscription: '',
          communeNaissance: ''
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
        communeNaissance: [
          value => !!value || 'Obligatoire'
        ],
        communeResidence: [
          value => (value.commune || '').length > 0 || 'Obligatoire'
        ],
        communeInscription: [
          value => (value.commune || '').length > 0 || 'Obligatoire'
        ],
        codePostal: [
          value => !!value || 'Obligatoire',
          value => /^988\d{2}$/.test(value) || 'Format incorrect'
        ]
      }
    }
  },
  computed: {
    valideResiliation () {
      var m = this.models.mandant
      return ((m.nom === '') || (m.prenom === '') || (m.dateNaissance === '') || (m.codePostal === '') || !(/^988\d{2}$/.test(m.codePostal)) || (m.communeResidence.commune === '') || (m.communeInscription === '') || ((m.adresseEtage === '') && (m.adresseBP === '') && (m.adresseNumLibelle === '')))
    },
    erreurAdresseMandant () {
      var m = this.models.mandant
      return (m.adresseEtage === '') && (m.adresseBP === '') && (m.adresseNumLibelle === '')
    },
    erreurAdresseMessageMandant () {
      var m = this.models.mandant
      return ((m.adresseEtage === '') && (m.adresseBP === '') && (m.adresseNumLibelle === '')) ? 'Au moins un des trois champs adresse doit être rempli.' : []
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
    resetCP () {
      this.$refs.codePostal.resetValidation()
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
