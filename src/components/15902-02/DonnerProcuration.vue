<template>
  <v-stepper v-model="etape">
    <v-dialog v-model="erreur" persistent max-width="600">
      <v-card>
        <v-card-title class="headline">Impossible de réaliser la procuration</v-card-title>
        <v-card-text>
          {{ precisionImpossibilite }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="erreur = ''">Je corrige mon choix</v-btn>
          <v-btn color="red darken-1" text href="javascript:history.back()">C'est compris</v-btn>
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
    <form
      ref="donnerProcurationForm"
      novalidate="true"
    >
    <v-stepper-header>
      <v-stepper-step :complete="etape > 1" step="1">
        Pièces justificatives
        <small v-if="etape == 1">Ensemble des pièces qu'il faut présenter</small>
      </v-stepper-step>
      <v-stepper-step :complete="etape > 2" step="2">
        Identité du mandant
        <small v-if="etape == 2">Il s'agit de la personne qui donne sa procuration à une autre personne</small>
      </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="etape > 3" step="3">
        Motif de la procuration
        <small v-if="etape == 3">Une justification vous sera demandée</small>
      </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="etape > 4" step="4">
        Identité du mandataire
        <small v-if="etape == 4">Celui qui ira voter le jour J à votre place</small>
      </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="etape > 5" step="5">
        Relecture
        <small v-if="etape == 5">Confirmez l'ensemble des éléments</small>
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-container>
          <v-alert
            outlined
            type="warning"
            prominent
            border="left"
          >
            Si vous ne remplissez pas toutes les conditions suivantes, il ne vous est pas possible d'établir une procuration. Merci de cocher les conditions dès que vous les avez vérifiées.
          </v-alert>
          <v-checkbox
            v-model="prerequis"
            value="pieceIdentite"
            hide-details
          >
            <template v-slot:label>
              <div>
                J'ai une pièce d'identité
                <v-chip
                  class="ma-2"
                  color="green"
                  text-color="white"
                  @click.stop="precisionsMandant = true"
                >
                  <v-avatar left>
                    <v-icon>mdi-help-circle-outline</v-icon>
                  </v-avatar>
                  qu'est-ce qu'une pièce d'identité
                </v-chip>
              </div>
            </template>
          </v-checkbox>
          <v-checkbox
            v-model="prerequis"
            value="justificatifAbsence"
            hide-details
            label="J'ai les justificatifs de mon absence"
          ></v-checkbox>
          <v-checkbox
            v-model="prerequis"
            value="validiteMandataire"
            hide-details
          >
            <template v-slot:label>
              <div>
                La personne que je désigne pour voter à ma place respecte les critères
                <v-chip
                  class="ma-2"
                  color="green"
                  text-color="white"
                  @click.stop="precisionsMandataire = true"
                >
                  <v-avatar left>
                    <v-icon>mdi-help-circle-outline</v-icon>
                  </v-avatar>
                  quels sont les critères
                </v-chip>
              </div>
            </template>
          </v-checkbox>

          <v-row>
            <v-col align="center">
              <v-btn
                v-if="prerequis.length > 2"
                color="primary"
                @click="etape++"
                block
                x-large
              >Cliquez ici pour remplir votre identité</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-container>
          <v-dialog v-model="precisionsMandant" persistent max-width="600">
            <v-card>
              <v-card-title class="headline">Pièce d'identité</v-card-title>
              <v-card-text>
                Vous devez justifier de votre identité en produisant une pièce d’identité (carte nationale d'identité, passeport, permis de conduire, etc.). Constitue une pièce d’identité tout document officiel délivré par une administration publique comportant les noms, prénoms, date et lieu de naissance de l'intéressé ainsi que sa photographie, sa signature et l'identification de l'autorité qui a délivré le document, la date et le lieu de délivrance.
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="ajouterIdentite">J'ai une pièce d'identité</v-btn>
                <v-btn color="red darken-1" text @click="afficheErreur('identite')">Je n'en ai pas</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-row>
            <v-col
              md="3"
            >
              <v-text-field
                v-model="models.mandant.nom"
                label="Nom de naissance"
                :rules="regles.nom"
                :error="erreurs.mandant.nom"
                hide-details="auto"></v-text-field>
            </v-col>
            <v-col
              md="4"
            >
              <v-text-field
                v-model="models.mandant.prenom"
                label="Prénoms"
                :error="erreurs.mandant.prenom"
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
                    :error="erreurs.mandant.dateNaissance"
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
                :error="erreurs.mandant.communeNaissance"
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
                :error="erreurs.mandant.communeResidence"
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
                @focus="resetCP('mandant')"
                ref="codePostalmandant"
                v-model="models.mandant.codePostal"
                label="Code postal"
                :error="erreurs.mandant.codePostal"
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
                :error="erreurs.mandant.communeInscription"
                :rules="regles.communeInscription"
                persistent-hint
                single-line
                return-object
              ></v-select>
            </v-col>
          </v-row>
          <v-alert
            v-if="['Bélep','Ouvéa','Lifou','Maré','Île des Pins'].indexOf(models.mandant.communeInscription.commune) >= 0"
            outlined
            type="warning"
            prominent
            border="left"
          >
            Si vous êtes inscrit sur la liste spéciale à la consultation de l’une des cinq communes insulaires (Bélep, île des Pins, Lifou, Maré et Ouvéa) et avez demandé à voter de manière délocalisée à Nouméa pour la consultation du 6 septembre 2020, vous ne pouvez donner procuration qu’à un autre électeur également admis à voter de manière délocalisée à Nouméa. Vous ne pouvez donc pas donner procuration à un électeur qui viendrait voter en votre nom dans l’une des communes insulaires précitées.
          </v-alert>
          <v-row>
            <v-col align="center">
              <v-btn
                color="primary"
                :disabled="valideMandant"
                block
                x-large
                @click="etape++">Cliquez ici pour donner la raison de votre absence</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-container>
          <v-row
            align="center">
            <v-select
              v-model="models.motif"
              :items="motifsSelect"
              item-text="text"
              item-value="value"
              label="Justification du vote par procuration"
              @change="justification=false"
              outlined
            ></v-select>
          </v-row>
          <v-row>
            <v-checkbox
              v-if="models.motif!==''"
              v-model="justification"
              :label="motifs[models.motif].details"
            ></v-checkbox>
          </v-row>
          <v-row>
            <v-col align="center">
              <v-btn
                v-if="models.motif!==''"
                color="primary"
                :disabled="!justification"
                @click="etape++"
                block
                x-large
              >Cliquez ici pour remplir l'identité de la personne qui votera pour vous</v-btn>
              <v-btn text @click="etape--">Corriger l'étape précédente</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-stepper-content>

      <v-stepper-content step="4">
        <v-container>
          <v-dialog v-model="precisionsMandataire" persistent max-width="600">
            <v-card>
              <v-card-title class="headline">À qui donner procuration?</v-card-title>
              <v-card-text>
                Vous êtes libre du choix de votre mandataire. Le mandataire doit toutefois remplir les conditions suivantes:
                <ul>
                  <li>être inscrit sur la liste électorale spéciale à la consultation;</li>
                  <li>exercer son suffrage dans la même commune que vous. Il n’a néanmoins pas à être obligatoirement inscrit dans le même bureau de vote;</li>
                  <li>jouir de ses droits électoraux. Par exemple, il ne doit pas s'être vu retirer son droit de vote par jugement d’un tribunal;</li>
                  <li>ne pas avoir déjà été désigné mandataire par une autre personne, sauf si cette dernière réside à l'étranger.</li>
                </ul>
                Assurez-vous que la personne à qui vous souhaitez donner procuration est bien inscrite sur la liste électorale spéciale à la consultation dans la même commune que vous. Dans le cas contraire, votre mandataire ne pourra pas voter le jour du scrutin.
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="validerMandataire">C'est bon</v-btn>
                <v-btn color="red darken-1" text @click="afficheErreur('mandataire')">Ce n'est pas bon</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-row>
            <v-col
              md="5"
            >
              <v-text-field
                v-model="models.mandataire.nom"
                label="Nom de naissance"
                :rules="regles.nom"
                hide-details="auto"></v-text-field>
            </v-col>
            <v-col
              md="5"
            >
              <v-text-field
                v-model="models.mandataire.prenom"
                label="Prénoms"
                :rules="regles.prenom"
                hide-details="auto"></v-text-field>
            </v-col>
            <v-col
              md="2"
            >
              <v-dialog
                v-model="menuDateNaissanceMandataire"
                persistent
                width="290px"
                >
                <template v-slot:activator="{ onMandataire }">
                  <v-text-field
                    v-model="dateNaissanceMandataireFormatee"
                    label="Date de naissance"
                    :rules="regles.prenom"
                    prepend-icon="mdi-calendar-range"
                    readonly
                    @focus="menuDateNaissanceMandataire = true"
                    v-on="onMandataire"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="models.mandataire.dateNaissance"
                  no-title
                  min="1920-01-01"
                  max="2002-12-31"
                  ref="dialogPicker"
                  locale="fr"
                  first-day-of-week="1"
                  @input="menuDateNaissanceMandataire = false"
                ></v-date-picker>
              </v-dialog>
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
                v-model="models.mandataire.adresseNumLibelle"
                label="Numéro et libellé de la voie"
                :error="erreurAdresseMandataire"
                :error-messages="erreurAdresseMessageMandataire"
                :rules="regles.adresseNumLibelle"
                hide-details="auto"></v-text-field>
            </v-col>
            <v-col
              cols="2"
            >
              <v-select
                v-model="models.mandataire.communeResidence"
                :hint="models.mandataire.communeResidence.commune?`${models.mandataire.communeResidence.codePostal}, Province ${models.mandataire.communeResidence.province}`:''"
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
                v-model="models.mandataire.adresseEtage"
                label="Étage, escalier, appartement - immeuble, bâtiment"
                :error="erreurAdresseMandataire"
                :rules="regles.adresseEtage"
                hide-details="auto"></v-text-field>
            </v-col>
            <v-col
              cols="4"
            >
              <v-text-field
                v-model="models.mandataire.adresseBP"
                label="Lieu-dit, boîte postale, commune déléguée"
                :error="erreurAdresseMandataire"
                :rules="regles.adresseBP"
                hide-details="auto"></v-text-field>
            </v-col>
            <v-col
              cols="2"
            >
              <v-text-field
                v-model="models.mandataire.codePostal"
                @focus="resetCP('mandataire')"
                ref="codePostalmandataire"
                label="Code postal"
                :rules="regles.codePostal"
                :hint="this.models.mandataire.communeResidence.codePostal!==''?`Pourrait être ${this.models.mandataire.communeResidence.codePostal}`:''"
                hide-details="auto"></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-12">
            <v-col cols="12" sm="10" md="10">
              <v-checkbox
                v-model="criteresMandataire"
                value="inscrite"
                hide-details
                label="cette personne est inscrite sur la liste électorale spéciale à la consultation."
              ></v-checkbox>
              <v-checkbox
                v-model="criteresMandataire"
                value="commune"
                hide-details
                label="cette personne exerce son suffrage dans la même commune que moi."
              ></v-checkbox>
              <v-checkbox
                v-model="criteresMandataire"
                value="droits"
                hide-details
                label="cette personne jouit de ses droits électoraux. Par exemple, elle ne s'est pas vu retirer son droit de vote par jugement d’un tribunal."
              ></v-checkbox>
              <v-checkbox
                v-model="criteresMandataire"
                value="unique"
                hide-details
                label="cette personne n'a pas été désignée mandataire par une autre personne, sauf si cette dernière réside à l'étranger."
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-row>
            <v-col align="center">
              <v-btn
                color="primary"
                :disabled="valideMandataire"
                block
                x-large
                @click="etape++">Relire les éléments avant d'imprimer</v-btn>
              <v-btn text @click="etape--">Corriger l'étape précédente</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-stepper-content>

      <v-stepper-content step="5">
        <v-container>
          <v-row
            align="center">
          </v-row>
          <v-row
            justify="center"
            v-if="models.motif">
            <v-alert
              outlined
              type="success"
              prominent
              border="left"
            >
              <p>
                Je m'appelle {{ models.mandant.prenom }} {{ models.mandant.nom }}, je suis né(e) le {{ dateNaissanceMandantFormatee }} et j'habite {{ models.mandant.adresseEtage }} {{ models.mandant.adresseNumLibelle }} {{ models.mandant.adresseBP }} {{ models.mandant.codePostal }} {{ models.mandant.communeResidence.commune }}.
              </p>
              <p>
                Je suis inscrit(e) sur la commune de {{ models.mandant.communeInscription.commune }} et je ne pourrai pas voter en personne le jour J {{ motifs[models.motif].valeur.charAt(0).toLowerCase() }}{{ motifs[models.motif].valeur.slice(1) }}.
              </p>
              <p>
                La personne qui votera à ma place sera {{ models.mandataire.prenom }} {{ models.mandataire.nom }}, né(e) le {{ dateNaissanceMandataireFormatee }} et demeurant {{ models.mandataire.adresseEtage }} {{ models.mandataire.adresseNumLibelle }} {{ models.mandataire.adresseBP }} {{ models.mandataire.codePostal }} {{ models.mandataire.communeResidence.commune }}.
              </p>
            </v-alert>
          </v-row>
          <v-row>
            <v-col align="center">
              <v-btn
                color="success"
                block
                x-large
                :loading="impressionEnCours"
                @click="soumettreProcuration">Créer la procuration</v-btn>
              <v-btn text @click="etape--">Corriger l'étape précédente</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-stepper-content>

    </v-stepper-items>
    </form>
  </v-stepper>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'DonnerProcuration1590202',
  watch: {
    menuDateNaissanceMandant (value) {
      value && this.$nextTick(() => { this.$refs.dialogPicker.activePicker = 'YEAR' })
    },
    menuDateNaissanceMandataire (value) {
      value && this.$nextTick(() => { this.$refs.dialogPicker.activePicker = 'YEAR' })
    }
  },
  data () {
    return {
      titre: "Demande de procuration pour le referendum",
      boutons: [
        {
          text: 'Retour à l\'accueil',
          href: '/',
          icon: 'arrow-left-circle',
          color: 'success'
        }
      ],
      erreur: false,
      precisionImpossibilite: '',
      impressionEnCours: false,
      etape: 1,
      prerequis: [],
      precisionsMandant: false,
      precisionsMandataire: false,
      menuDateNaissanceMandant: false,
      menuDateNaissanceMandataire: false,
      justification: false,
      criteresMandataire: [],
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
      erreurs: {
        mandant: {
          nom: false,
          prenom: false,
          dateNaissance: false,
          dateNaissance1: false,
          communeResidence: false,
          codePostal: false,
          communeInscription: false,
          communeNaissance: false
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
        },
        mandataire: {
          nom: '',
          prenom: '',
          dateNaissance: '',
          adresseEtage: '',
          adresseNumLibelle: '',
          adresseBP: '',
          codePostal: '',
          communeResidence: { commune: '', codePostal: '', province: '' }
        },
        motif: ''
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
    libelleJustification () {
      return this.models.motif
    },
    /*
    adresseMandantRemplie () {
      return !((this.models.mandant.adresseEtage === '') && (this.models.mandant.adresseNumLibelle === '') && (this.models.mandant.adresseBP === ''))
    },
    reglesAdresseCalculee () {
      return [
        value => this.adresseMandantRemplie || "Il faut remplir au moins un champ d'adresse."
      ]
    },
    */
    valideMandant () {
      var m = this.models.mandant
      return ((m.nom === '') || (m.prenom === '') || (m.dateNaissance === '') || (m.codePostal === '') || !(/^988\d{2}$/.test(m.codePostal)) || (m.communeResidence.commune === '') || (m.communeInscription === '') || ((m.adresseEtage === '') && (m.adresseBP === '') && (m.adresseNumLibelle === '')))
    },
    valideMandataire () {
      var m = this.models.mandataire
      return (this.criteresMandataire.length <= 3 || (m.nom === '') || (m.prenom === '') || (m.dateNaissance === '') || (m.codePostal === '') || !(/^988\d{2}$/.test(m.codePostal)) || (m.communeResidence.commune === '') || ((m.adresseEtage === '') && (m.adresseBP === '') && (m.adresseNumLibelle === '')))
    },
    erreurAdresseMandant () {
      return (this.models.mandant.adresseEtage === '') && (this.models.mandant.adresseBP === '') && (this.models.mandant.adresseNumLibelle === '')
    },
    erreurAdresseMessageMandant () {
      return ((this.models.mandant.adresseEtage === '') && (this.models.mandant.adresseBP === '') && (this.models.mandant.adresseNumLibelle === '')) ? 'Au moins un des trois champs adresse doit être rempli.' : []
    },
    erreurAdresseMandataire () {
      return (this.models.mandataire.adresseEtage === '') && (this.models.mandataire.adresseBP === '') && (this.models.mandataire.adresseNumLibelle === '')
    },
    erreurAdresseMessageMandataire () {
      return ((this.models.mandataire.adresseEtage === '') && (this.models.mandataire.adresseBP === '') && (this.models.mandataire.adresseNumLibelle === '')) ? 'Au moins un des trois champs adresse doit être rempli.' : []
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
          this.precisionsMandant = false
          this.precisionImpossibilite = "Si vous n'avez pas de pièce d'identité, il n'est pas possible d'établir une procuration."
          break
        }
        case 'mandataire': {
          this.precisionsMandataire = false
          this.precisionImpossibilite = "La personne que vous souhaitez désigner ne remplit pas les conditions pour être mandataire, il est donc impossible de réaliser la procuration."
          break
        }
      }
      this.erreur = true
    },
    ajouterIdentite () {
      if (this.prerequis.indexOf('pieceIdentite') < 0) {
        this.prerequis.push('pieceIdentite')
      }
      this.precisionsMandant = false
    },
    validerMandataire () {
      if (this.prerequis.indexOf('validiteMandataire') < 0) {
        this.prerequis.push('validiteMandataire')
      }
      this.precisionsMandataire = false
    },
    resetCP (type) {
      this.$refs['codePostal' + type].resetValidation()
    },
    formatDate (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    soumettreProcuration: function () {
      this.impressionEnCours = true
      let elt = this
      this.axios.post(elt.config.adresse + '/' + elt.config.fonction + '/procuration/' + this.$route.params.cerfa, this.models,
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
    }
  },
  created: function () {
    this.$store.dispatch('titreBoutons/changeBoutons', this.boutons)
    this.$store.dispatch('titreBoutons/changeTitre', this.titre)
  }
}
</script>
