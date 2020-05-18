/*
 * Copyright (c) 2020 César Lizurey <cesar@lizurey.fr>
 *
 * SPDX-License-Identifier: CC-BY-NC-SA-4.0
 * License-Filename: LICENSE.txt
 */

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const moment = require('moment')
var fillPdf = require("fill-pdf")
var encoding = require("encoding")
var fs = require('fs')
var printer = require("printer")
var util = require('util')
const { degrees, PDFDocument, rgb, StandardFonts } = require('pdf-lib')
const config = require('config')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Pour des besoins de développement
// app.use(function (req, res, next) {
//   console.log("ORIGIN: " + req.get('origin') + ' - ' + req.header('Origin'))
//   console.log("HOST: " + req.get('host'))
//   console.log(">> " + JSON.stringify(req.body))
//   next()
// })

Object.prototype.push = function (pushed) {
  for (const property in pushed) {
    this[property] = pushed[property]
  }
}

/* ------------------------------
             API
------------------------------ */

const Papa = require('papaparse')

function transfoCompare (c) {
  return c.normalize("NFD").replace(/-/g, ' ').replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/saint/g, 'st')
}

app.use(function (request, response, next) {
  response.header("Access-Control-Allow-Origin", "*")
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

// API pour avoir le liste des boutons des élections
app.get('/boutonsElections/:fonction', (req, res) => {
  var elections = []
  var cerfas = config.get('cerfas')
  for (const cerfa in cerfas) {
    for (const election in cerfas[cerfa]) {
      if (cerfas[cerfa].hasOwnProperty(election)) {
        if ((req.params.fonction != "resilier") || (election != "mixte")) {
          elections.push({
            text: cerfas[cerfa][election].titreBouton,
            href: '/'+req.params.fonction+'/'+cerfa+'/'+election,
            icon: cerfas[cerfa][election].icone,
            color: cerfas[cerfa][election].couleur,
            flex: 12
          })
        }
      }
    }
  }
  res.send(elections)
})

// API pour avoir les adresses des mairies
var csvMairie
fs.readFile('./docs/baseMairies.csv', 'utf8', function (err, data) {
  if (err) { throw err }
  csvMairie = Papa.parse(data, { header: true, fastMode: true })
})

app.get('/communes/:lettres?', (req, res) => {
  console.log("Commune recherchée: " + req.params.lettres)
  if (req.params.lettres) {
    res.send({ data: csvMairie.data.filter(ligne => ligne.commune ? transfoCompare(ligne.commune).indexOf(transfoCompare(req.params.lettres)) >= 0 : false) })
  } else {
    res.send(csvMairie)
  }
})

// API pour avoir les adresses des consulats
var csvConsulat
fs.readFile('./docs/baseAmbCons.csv', 'utf8', function (err, data) {
  if (err) { throw err }
  csvConsulat = Papa.parse(data, { header: true, fastMode: true })
})

app.get('/consulat/:lettres?', (req, res) => {
  console.log("Consulat recherchée: " + req.params.lettres)
  if (req.params.lettres) {
    res.send({ data: csvConsulat.data.filter(ligne => ligne.pays ? transfoCompare(ligne.pays).indexOf(transfoCompare(req.params.lettres)) >= 0 : false) })
  } else {
    res.send(csvConsulat)
  }
})

/* ------------------------------
             PDF
------------------------------ */

const MOTIFS_1590202 = ['prof', 'form', 'handicap', 'santé', 'absence', 'assistance']
const MOTIFS_1495201 = ['prof', 'handicap', 'santé', 'assistance', 'form', 'absence', 'commune']

app.use(function (req, res, next) {
  req.donneesAnnexes = {
    commune: config.get('commune'),
    date: moment().format("DD/MM/YYYY/HH/mm"),
    dateFormat: moment().format("DDMMYYYY/HH mm")
  }
  next()
})

const TYPE_LISTE = {
  "commune": 1,
  "consulat": 2
}
const TYPE_TOUR = {
  "premier": 1,
  "second": 2,
  "deux": 3
}

function chargerValeurs (req, res, next) {
  var donneesRecues = req.body
  req.pdfTemplatePath = "../../docs/cerfa_" + req.params.cerfa + ".pdf"
  fs.mkdirSync('output/' + req.body.typeElection + '/' + req.params.fonction, { recursive: true })
  req.nomFichier = 'output/' + req.body.typeElection + '/' + req.params.fonction + '/' + donneesRecues.mandant.nom + ' ' + donneesRecues.mandant.prenom + ' (' + req.donneesAnnexes.dateFormat.replace('/', '.').replace(' ', '') + ').pdf'
  switch (req.params.cerfa) {
    case '14952-01': {
      var adresse = []
      if (donneesRecues.mandant.communeConsulat === 'commune') {
        donneesRecues.mandant.communeInscription.adresse.split('|').forEach(function(ligne){
          adresse.push(ligne)
        })
        adresse.push(donneesRecues.mandant.communeInscription.codePostal + ' ' + donneesRecues.mandant.communeInscription.commune)
      }
      if (donneesRecues.mandant.communeConsulat === 'consulat') {
        adresse.push(donneesRecues.mandant.consulat.nom)
        donneesRecues.mandant.consulat.adresse.split('|').forEach(function(ligne){
          adresse.push(ligne)
        })
        adresse.push(donneesRecues.mandant.consulat.codePostal + ' ' + donneesRecues.mandant.consulat.ville, donneesRecues.mandant.consulat.pays)
      }
      req.adresse = adresse
      req.formData = {
        // 'topmostSubform[0].Page1[0].Champ_de_texte24[1]': '',   // je ne sais pas où est ce champ
        // 'topmostSubform[0].Page1[0].R?initialiser1[0]': '',  // ne sert à rien
        // 'topmostSubform[0].Page1[0].Imprimer1[0]': '',       // ne sert à rien
        'faitAHeure1': req.donneesAnnexes.dateFormat.split('/')[1],
        'faitAHeure2': req.donneesAnnexes.dateFormat.split('/')[1],
        'nomMandant1': donneesRecues.mandant.nom,
        'prenomMandant1': donneesRecues.mandant.prenom,
        'numAdresseMandant': donneesRecues.mandant.adresseNum,
        'bisAdresseMandant': donneesRecues.mandant.adresseBis,
        'typeAdresseMandant': donneesRecues.mandant.adresseType,
        'voieAdresseMandant': donneesRecues.mandant.adresseVoie,
        'codePostalMandant': donneesRecues.mandant.codePostal,
        'communeResidenceMandant': donneesRecues.mandant.communeResidence,
        'telephoneMandant': donneesRecues.mandant.telephone,
        'courrielMandant': donneesRecues.mandant.courriel,
        'dateNaissanceMandant': donneesRecues.mandant.dateNaissance.split('-').reverse().join(''),
        'communeInscription': (donneesRecues.mandant.communeConsulat === 'commune') ? donneesRecues.mandant.communeInscription.commune.replace(/cedex/i, '') : '',
        'dptInscription': (donneesRecues.mandant.communeConsulat === 'commune') ? donneesRecues.mandant.communeInscription.dptCollectivite ? donneesRecues.mandant.communeInscription.dptCollectivite.replace('–', '-') : '' : '',
        'consulatInscription': (donneesRecues.mandant.communeConsulat === 'consulat') ? donneesRecues.mandant.consulat.nom : '',
        'paysInscription': (donneesRecues.mandant.communeConsulat === 'consulat') ? donneesRecues.mandant.consulat.pays : '',
        'lieuProcuration1': req.donneesAnnexes.commune,
        'faitLe1': req.donneesAnnexes.dateFormat.split('/')[0],
        'communeConsulat1': TYPE_LISTE[donneesRecues.mandant.communeConsulat],
        'devant1': '',
        'nomMandant3': donneesRecues.mandant.nom,
        'prenomMandant3': donneesRecues.mandant.prenom,
        'faitLe3': req.donneesAnnexes.dateFormat.split('/')[0],
        'lieuProcuration2': req.donneesAnnexes.commune
      }
      switch (req.params.fonction) {
        case 'resiliation': {
          req.formData.push({
            'donnerProcuration1': 0,
            'donnerProcuration2': 0,
            'resilierProcuration1': 1,
            'resilierProcuration2': 1
          })
          break
        }
        case 'procuration': {
          req.formData.push({
            'nomMandataire1': donneesRecues.mandataire.nom,
            'prenomMandataire1': donneesRecues.mandataire.prenom,
            'numAdresseMandataire': donneesRecues.mandataire.adresseNum,
            'bisAdresseMandataire': donneesRecues.mandataire.adresseBis,
            'typeAdresseMandataire': donneesRecues.mandataire.adresseType,
            'voieAdresseMandataire': donneesRecues.mandataire.adresseVoie,
            'codePostalMandataire': donneesRecues.mandataire.codePostal,
            'communeMandataire': donneesRecues.mandataire.communeResidence,
            'dateNaissanceMandataire': donneesRecues.mandataire.dateNaissance.split('-').reverse().join(''),
            'typeElection1': donneesRecues.typeElection.replace('mixte',''),
            'datePremierTour1': (donneesRecues.typeElection === "mixte")?'':config.get('cerfas')[req.params.cerfa][req.body.typeElection].date,
            'jusquau1': (donneesRecues.typeElection === "mixte")?donneesRecues.jusquau.split('-').reverse().join(''):'',
            'donnerProcuration1': 1,
            'donnerProcuration2': 1,
            'resilierProcuration1': 0,
            'resilierProcuration2': 0,
            'electionOuDate1': (donneesRecues.typeElection === "mixte")?2:1,
            'premierSecondTour1': TYPE_TOUR[donneesRecues.typeTour],
            'nomMandant2': donneesRecues.mandant.nom,
            'prenomMandant2': donneesRecues.mandant.prenom,
            'faitLe2': req.donneesAnnexes.dateFormat.split('/')[0],
            'nomMandataire2': donneesRecues.mandataire.nom,
            'prenomMandataire2': donneesRecues.mandataire.prenom,
            'typeElection2': donneesRecues.typeElection,
            'datePremierTour2': config.get('cerfas')[req.params.cerfa][req.body.typeElection].date,
            'jusquau2': '',
            'electionOuDate2': (donneesRecues.typeElection === "mixte")?2:1,
            'premierSecondTour2': TYPE_TOUR[donneesRecues.typeTour],
            'raisonProcuration': MOTIFS_1495201.indexOf(donneesRecues.motif) + 1,
            'devant2': ''
          })
          break
        }
      }
      break
    }
    case '15902-02': {
      req.formData = {
        // 'topmostSubform[0].Page1[0].R?initialiser1[0]': ,  // ne sert à rien
        // 'topmostSubform[0].Page1[0].Imprimer1[0]': ,       // ne sert à rien
        // 'topmostSubform[0].Page1[0].R?initialiser1[0]': ,  // ne sert à rien
        'nomMandant1': donneesRecues.mandant.nom,
        'prenomMandant1': donneesRecues.mandant.prenom,
        'adresseNumMandant': donneesRecues.mandant.adresseNumLibelle,
        'adresseEtageMandant': donneesRecues.mandant.adresseEtage,
        'adresseLieuDitMandant': donneesRecues.mandant.adresseBP,
        'codePostalMandant': donneesRecues.mandant.codePostal,
        'communeMandant': donneesRecues.mandant.communeResidence.commune,
        'communeNaissanceMandant1': donneesRecues.mandant.communeNaissance,
        'jourNaissanceMandant': donneesRecues.mandant.dateNaissance.split('-')[2],
        'moisNaissanceMandant': donneesRecues.mandant.dateNaissance.split('-')[1],
        'anneeNaissanceMandant': donneesRecues.mandant.dateNaissance.split('-')[0],
        'communeInscriptionMandant': donneesRecues.mandant.communeInscription.commune,
        'lieuProcuration1': req.donneesAnnexes.commune,
        'jourProcuration1': req.donneesAnnexes.date.split('/')[0],
        'moisProcuration1': req.donneesAnnexes.date.split('/')[1],
        'anneeProcuration1': req.donneesAnnexes.date.split('/')[2],
        'heureProcuration1': req.donneesAnnexes.date.split('/')[3],
        'minuteProcuration1': req.donneesAnnexes.date.split('/')[4],
        'devant1': '',
        'nomMandant3': donneesRecues.mandant.nom,
        'prenomMandant3': donneesRecues.mandant.prenom,
        'jourNaissanceMandant2': donneesRecues.mandant.dateNaissance.split('-')[2],
        'moisNaissanceMandant2': donneesRecues.mandant.dateNaissance.split('-')[1],
        'anneeNaissanceMandant2': donneesRecues.mandant.dateNaissance.split('-')[0],
        'communeNaissanceMandant2': donneesRecues.mandant.communeNaissance,
        'communeInscriptionMandant2': donneesRecues.mandant.communeInscription.commune,
        'lieuProcuration3': req.donneesAnnexes.commune,
        'jourProcuration3': req.donneesAnnexes.date.split('/')[0],
        'moisProcuration3': req.donneesAnnexes.date.split('/')[1],
        'anneeProcuration3': req.donneesAnnexes.date.split('/')[2],
        'heureProcuration3': req.donneesAnnexes.date.split('/')[3],
        'minuteProcuration3': req.donneesAnnexes.date.split('/')[4],
        'devant2': ''
      }
      switch (req.params.fonction) {
        case 'resiliation': {
          req.formData.push({
            'donneResilie1': 2,
            'donneResilie2': 2
          })
          break
        }
        case 'procuration': {
          req.formData.push({
            'donneResilie1': 1,
            'donneResilie2': 1,
            'nomMandataire1': donneesRecues.mandataire.nom,
            'prenomMandataire1': donneesRecues.mandataire.prenom,
            'adresseNumMandataire': donneesRecues.mandataire.adresseNumLibelle,
            'adresseEtageMandataire': donneesRecues.mandataire.adresseEtage,
            'adresseLieuDitMandataire': donneesRecues.mandataire.adresseBP,
            'codePostalMandataire': donneesRecues.mandataire.codePostal,
            'communeMandataire': donneesRecues.mandataire.communeResidence.commune,
            'jourNaissanceMandataire': donneesRecues.mandataire.dateNaissance.split('-')[2],
            'moisNaissanceMandataire': donneesRecues.mandataire.dateNaissance.split('-')[1],
            'anneeNaissanceMandataire': donneesRecues.mandataire.dateNaissance.split('-')[0],
            'nomMandataire2': donneesRecues.mandataire.nom,
            'prenomMandataire2': donneesRecues.mandataire.prenom,
            'nomMandant2': donneesRecues.mandant.nom,
            'prenomMandant2': donneesRecues.mandant.prenom,
            'jourNaissanceMandataire2': donneesRecues.mandataire.dateNaissance.split('-')[2],
            'moisNaissanceMandataire2': donneesRecues.mandataire.dateNaissance.split('-')[1],
            'anneeNaissanceMandataire2': donneesRecues.mandataire.dateNaissance.split('-')[0],
            'lieuProcuration2': req.donneesAnnexes.commune,
            'jourProcuration2': req.donneesAnnexes.date.split('/')[0],
            'moisProcuration2': req.donneesAnnexes.date.split('/')[1],
            'anneeProcuration2': req.donneesAnnexes.date.split('/')[2],
            'motifProcuration': MOTIFS_1590202.indexOf(donneesRecues.motif) + 1
          })
          break
        }
      }
      break
    }
  }
  next()
}

function genererCerfa (req, res, next) {
  for (var prop in req.formData) {
    // if ((prop != 'mairie') && (prop != 'communeConsulat')) {
      req.formData[prop] = encoding.convert(req.formData[prop], 'latin-1')
    // }
  }
  fillPdf.generatePdf(req.formData, req.pdfTemplatePath, function (err, output) {
    if (!err) {
      fs.writeFile(req.nomFichier, output, (err) => {
        if (err) {
          res.status(500).send({
            retour: true,
            reponse: 'KO',
            titre: 'Erreur de génération de PDF',
            texte: err
          })
        }
        console.log("[FICHIER] Sauvegardé: " + req.nomFichier)
        next()
      })
    } else {
      res.status(500).send({
        retour: true,
        reponse: 'KO',
        titre: 'Erreur de génération de PDF',
        texte: err
      })
    }
  })
}

const ajouterAdresse = async function (req, res, next) {
  if ((req.params.cerfa !== '15902-02') && (typeof req.adresse !== 'undefined' && req.adresse.length > 0)) {
    fs.readFile(req.nomFichier, async function (err, data) {
      if (err) {
        res.status(500).send({
          retour: true,
          reponse: 'KO',
          titre: 'Erreur',
          texte: err
        })
      } else {
        const existingPdfBytes = data
        const pdfDoc = await PDFDocument.load(existingPdfBytes)
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
        const pages = pdfDoc.getPages()
        const firstPage = pages[0]
        const { width, height } = firstPage.getSize()
        var numLigne = 270
        req.adresse.forEach(function(ligne){
          firstPage.drawText(ligne, {
            x: 300,
            y: numLigne,
            size: 14,
            font: helveticaFont,
            color: rgb(0, 0, 0.1),
            rotate: degrees(-0)
          });
          numLigne -= 20
        })
        const pdfBytes = await pdfDoc.save()
        fs.writeFileSync(req.nomFichier, pdfBytes)
        console.log("[FICHIER] Adresse mairie ajoutée")
        next()
      }
    })
  }
  else {
    next()
  }
}

function gererCerfa (req, res, next) {
  var filename = req.nomFichier
  switch (req.params.pdf) {
    case 'impression' : {
      // console.log(printer.getPrinters())
      console.log('[GÉNÉRATION] Fichier: ' + filename)
      if (process.platform != 'win32') {
        printer.printFile({filename:filename,
          printer: process.env[3], // printer name, if missing then will print to default printer
          success:function(jobID){
            console.log("[IMPRESSION] ID impression: "+jobID)
            res.status(200).send({
              retour: true,
              reponse: 'OK',
              titre: 'Procuration imprimée',
              texte: "Le document est imprimé. Vous pouvez procéder à la vérification et la signature."
            })
          },
          error:function(err){
            console.log(err)
            res.status(500).send(err)
          }
        })
      } else {
        console.log('[ERREUR] Mauvais système: ' + process.platform)
        res.status(500).send({
          retour: true,
          reponse: 'KO',
          titre: 'Erreur',
          texte: 'Mauvais système: ' + process.platform
        })
      }
      break;
    }
    case 'telechargement': {
      var file = fs.createReadStream(filename)
      var stat = fs.statSync(filename)
      res.setHeader('Content-Length', stat.size)
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', 'attachment; filename=' + filename)
      file.pipe(res)
      break
    }
  }
}

app.post('/:pdf/:fonction/:cerfa', chargerValeurs, genererCerfa, ajouterAdresse, gererCerfa)

app.listen(config.get('port'))
