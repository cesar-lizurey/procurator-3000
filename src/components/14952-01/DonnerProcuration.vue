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
    <form
      ref="donnerProcurationForm"
      novalidate="true"
    >
    <v-stepper-header>
      <v-stepper-step :complete="etape > 1" step="1">
        Pièces justificatives
        <small v-if="etape == 1">Ensemble des pièces qu'il faut présenter</small>
      </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="etape > 2" step="2">
        Identité du mandant
        <small v-if="etape == 2">Il s'agit de la personne qui donne sa procuration à une autre personne</small>
      </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="etape > 3" step="3">
        Contexte de la procuration
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
                v-if="prerequis.length > 1"
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
              md="5"
            >
              <v-text-field
                v-model="models.mandant.nom"
                label="Nom de naissance"
                :rules="regles.nom"
                :error="erreurs.mandant.nom"
                hide-details="auto"></v-text-field>
            </v-col>
            <v-col
              md="5"
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
              outlined
            ></v-select>
          </v-row>
          <v-row
            v-if="models.typeElection != 'mixte'"
          >
            <v-col
              cols="8"
            >
              <v-radio-group v-model="models.typeTour" row>
                <template v-slot:label>
                  <div><strong>Tour concerné:</strong></div>
                </template>
                <v-radio label="Premier" value="premier"></v-radio>
                <v-radio label="Second" value="second"></v-radio>
                <v-radio label="Les deux" value="deux"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row
            v-if="models.typeElection == 'mixte'"
          >
            <v-col
              cols="8"
            >
              <v-alert
                outlined
                type="warning"
                prominent
                border="left"
              >
              La procuration peut être établie pour une durée maximale d’un an sur le territoire national et de trois ans dans les ambassades ou postes consulaires pour les Français établis à l’étranger.
              </v-alert>
            </v-col>
            <v-col
              cols="4"
            >
              <v-dialog
                v-model="menuJusquau"
                persistent
                width="290px"
                >
                <template v-slot:activator="{ onJusquau }">
                  <v-text-field
                    v-model="jusquauFormatee"
                    label="Jusqu'au"
                    :error="erreurs.jusquau"
                    :rules="regles.dateNaissance"
                    prepend-icon="mdi-calendar-range"
                    readonly
                    @focus="menuJusquau = true"
                    v-on="onJusquau"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="models.jusquau"
                  no-title
                  :min="aujourdhui"
                  :max="finJusquau"
                  locale="fr"
                  first-day-of-week="1"
                  ref="dialogPicker"
                  @input="menuJusquau = false"
                ></v-date-picker>
              </v-dialog>
            </v-col>
          </v-row>
          <v-row>
            <v-col align="center">
              <v-btn
                v-if="models.motif!==''"
                color="primary"
                :disabled="!(models.motif.length * (models.jusquau.length + models.typeTour.length) > 0)"
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
                  <li>jouir de ses droits électoraux;</li>
                  <li>être inscrit dans la même commune que le mandant;</li>
                  <li>ne peut disposer de plus de deux procurations dont une seule établie en France.</li>
                </ul>
                Le mandataire ne reçoit plus de volet de procuration. C'est au mandant de le prévenir de la procuration.
                Le jour du scrutin, le mandataire se présente muni de sa propre pièce d'identité, au bureau de vote du mandant, et vote au nom de ce dernier, dans les mêmes conditions que les autres électeurs.
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
              cols="1">
              <v-text-field
                v-model="models.mandataire.adresseNum"
                label="Numéro"
                :error="erreurAdresseMandataire"
                :rules="regles.adresseNum"
                hide-details="auto"></v-text-field>
            </v-col>
            <v-col
              cols="1">
              <v-text-field
                v-model="models.mandataire.adresseBis"
                label="bis, ter, etc."
                :error="erreurAdresseMandataire"
                :rules="regles.adresseBis"
                hide-details="auto"></v-text-field>
            </v-col>
            <v-col
              cols="2">
              <v-text-field
                v-model="models.mandataire.adresseType"
                label="Type de voie"
                :error="erreurAdresseMandataire"
                :rules="regles.adresseType"
                hide-details="auto"></v-text-field>
            </v-col>
            <v-col
              cols="6">
              <v-text-field
                v-model="models.mandataire.adresseVoie"
                label="Nom de la voie"
                :error="erreurAdresseMandataire"
                :error-messages="erreurAdresseMessageMandataire"
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
                v-model="models.mandataire.communeResidence"
                label="Commune"
                :rules="regles.communeResidence"
                hide-details="auto"></v-text-field>
            </v-col>
            <v-col
              cols="2"
            >
              <v-text-field
                v-model="models.mandataire.codePostal"
                label="Code postal"
                :rules="regles.codePostal"
                hide-details="auto"></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-12">
            <v-col cols="12" sm="10" md="10">
              <v-checkbox
                v-model="criteresMandataire"
                value="inscrite"
                hide-details
                label="cette personne est inscrite sur la liste électorale de la même commune que moi."
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
                label="cette personne ne dispose pas de plus de deux procurations dont une seule établie en France."
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
                Je m'appelle {{ models.mandant.prenom }} {{ models.mandant.nom }}, je suis né(e) le {{ dateNaissanceMandantFormatee }} et j'habite {{ models.mandant.adresseNum }} {{ models.mandant.adresseBis }} {{ models.mandant.adresseType }} {{ models.mandant.adresseVoie }} {{ models.mandant.codePostal }} {{ models.mandant.communeResidence }}.
              </p>
              <p v-if="models.mandant.communeConsulat === 'commune'">
                Je suis inscrit(e) sur la commune de {{ models.mandant.communeInscription.commune }} et je ne pourrai pas voter en personne le jour J {{ motifs[models.motif].valeur.charAt(0).toLowerCase() }}{{ motifs[models.motif].valeur.slice(1) }}.
              </p>
              <p v-if="models.mandant.communeConsulat === 'consulat'">
                Je suis inscrit(e) sur la liste de "{{ models.mandant.consulat.nom }}" et je ne pourrai pas voter en personne le jour J {{ motifs[models.motif].valeur.charAt(0).toLowerCase() }}{{ motifs[models.motif].valeur.slice(1) }}.
              </p>
              <p>
                La personne qui votera à ma place sera {{ models.mandataire.prenom }} {{ models.mandataire.nom }}, né(e) le {{ dateNaissanceMandataireFormatee }} et demeurant {{ models.mandataire.adresseNum }} {{ models.mandataire.adresseBis }} {{ models.mandataire.adresseType }} {{ models.mandataire.adresseVoie }} {{ models.mandataire.codePostal }} {{ models.mandataire.communeResidence }}.
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
  name: 'DonnerProcuration1495201',
  watch: {
    menuDateNaissanceMandant (value) {
      value && this.$nextTick(() => { this.$refs.dialogPicker.activePicker = 'YEAR' })
    },
    menuDateNaissanceMandataire (value) {
      value && this.$nextTick(() => { this.$refs.dialogPicker.activePicker = 'YEAR' })
    },
    menuJusquau (value) {
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
      titre: "Demande de procuration - " + this.$route.params.typeElection,
      boutons: [
        {
          text: 'Retour à l\'accueil',
          href: '/',
          icon: 'arrow-left-circle',
          color: 'success'
        }
      ],
      aujourdhui: new Date().toISOString().slice(0, 10),
      isLoading: false,
      rechercheAPI: '',
      communesAPI: [],
      consulatAPI: [],
      search: null,
      searchConsulat: null,
      erreur: false,
      impressionEnCours: false,
      precisionImpossibilite: '',
      etape: 1,
      prerequis: [],
      precisionsMandant: false,
      precisionsMandataire: false,
      menuDateNaissanceMandant: false,
      menuDateNaissanceMandataire: false,
      menuJusquau: false,
      criteresMandataire: [],
      reponseDemande: 'En attente',
      motifs: {
        'prof': {
          valeur: 'En raison d\'obligations professionnelles'
        },
        'handicap': {
          valeur: "En raison d’un handicap"
        },
        'santé': {
          valeur: "Pour raison de santé"
        },
        'assistance': {
          valeur: "En raison de l’assistance apportée à une personne malade ou infirme"
        },
        'form': {
          valeur: 'En raison d\'obligations de formation'
        },
        'absence': {
          valeur: "Parce que je suis en vacances"
        },
        'commune': {
          valeur: "Parce que je réside dans une commune différente de celle où je suis inscrit(e) sur une liste électorale"
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
          communeInscription: false
        }
      },
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
        },
        mandataire: {
          nom: '',
          prenom: '',
          dateNaissance: '',
          adresseNum: '',
          adresseBis: '',
          adresseType: '',
          adresseVoie: '',
          codePostal: '',
          communeResidence: ''
        },
        motif: '',
        typeTour: '',
        'jusquau': ''
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
        ],
        jusquau: [
          value => /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/.test(value)
        ]
      }
    }
  },
  computed: {
    finJusquau () {
      var date = new Date()
      var ajout = (this.models.mandant.communeConsulat === 'commune') ? 1 : 3
      var fin = new Date(date.getFullYear() + ajout, date.getMonth(), date.getDay())
      return fin.toISOString().slice(0, 10)
    },
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
    valideMandant () {
      var m = this.models.mandant
      return ((m.nom === '') || (m.prenom === '') || (m.dateNaissance === '') || (m.codePostal === '') || !(/^\d{1}[0-9AB]{1}\d{3}$/.test(m.codePostal)) || (m.communeResidence === '') || (m.communeConsulat === '') || ((m.communeConsulat === 'commune') && ((!m.communeInscription) || (m.communeInscription === ''))) || ((m.communeConsulat === 'consulat') && (m.consulat === '')) || ((m.adresseNum === '') && (m.adresseBis === '') && (m.adresseVoie === '') && (m.adresseType === '')))
    },
    valideMandataire () {
      var m = this.models.mandataire
      return (this.criteresMandataire.length <= 2 || (m.nom === '') || (m.prenom === '') || (m.dateNaissance === '') || (m.codePostal === '') || !(/^\d{1}[0-9AB]{1}\d{3}$/.test(m.codePostal)) || (m.communeResidence === '') || ((m.adresseNum === '') && (m.adresseBis === '') && (m.adresseVoie === '') && (m.adresseType === '')))
    },
    erreurAdresseMandant () {
      return (this.models.mandant.adresseNum === '') && (this.models.mandant.adresseBis === '') && (this.models.mandant.adresseType === '') && (this.models.mandant.adresseVoie === '')
    },
    erreurAdresseMessageMandant () {
      return ((this.models.mandant.adresseNum === '') && (this.models.mandant.adresseBis === '') && (this.models.mandant.adresseType === '') && (this.models.mandant.adresseVoie === '')) ? 'Au moins un des quatre champs adresse doit être rempli.' : []
    },
    erreurAdresseMandataire () {
      return (this.models.mandataire.adresseNum === '') && (this.models.mandataire.adresseBis === '') && (this.models.mandataire.adresseType === '') && (this.models.mandataire.adresseVoie === '')
    },
    erreurAdresseMessageMandataire () {
      return ((this.models.mandataire.adresseNum === '') && (this.models.mandataire.adresseBis === '') && (this.models.mandataire.adresseType === '') && (this.models.mandataire.adresseVoie === '')) ? 'Au moins un des quatre champs adresse doit être rempli.' : []
    },
    dateNaissanceMandantFormatee () {
      return this.formatDate(this.models.mandant.dateNaissance)
    },
    dateNaissanceMandataireFormatee () {
      return this.formatDate(this.models.mandataire.dateNaissance)
    },
    jusquauFormatee () {
      return this.formatDate(this.models.jusquau)
    },
    ...mapState({
      config: state => state.serveur.config
    })
  },
  methods: {
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
