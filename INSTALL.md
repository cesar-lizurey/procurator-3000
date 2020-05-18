# Installation

Dans la mesure où certaines dépendances sont essentielles et pas forcément natives de votre environnement, il faut bien prêter attention à disposer de tous les prérequis pour que tout se déroule correctement.

## Prérequis

### NodeJS

Il faut commencer par installer NodeJS. Pour cela, il faut d'abord le [télécharger](https://nodejs.org/fr/download/) puis [respecter la procédure d'installation](https://github.com/nodejs/help/wiki/Installation/).

### Git

Une des dépendances est à rechercher sur GitHub, et nécessitera donc de disposer de Git sur la machine. Il faut donc l'installer via la commande `apt-get install git`

### pdftk

Le Procurator 3000 gère des PDF par l'intermédiaire d'un paquet se basant sur `pdftk`, il faut donc l'installer. Si jamais la commande `sudo apt-get install pdftk` ne fonctionne pas, voici la manière la plus simple:

```
sudo add-apt-repository ppa:malteworld/ppa
sudo apt update
sudo apt install pdftk
```

### Installation de paquets annexes

Selon la distribution de Linux que vous utilisez, il est possible qu'il manque des paquets, voici lesquels installer (le script d'installation de l'appli lancera ces commandes si vous ne l'avez pas fait):

```
sudo apt-get update
sudo apt install node-gyp
sudo apt install libcups2-dev
sudo apt-get install build-essential
sudo npm install -g graceful-fs
```

## Installation

Après avoir téléchargé l'application ou avoir exécuté

> `git clone https://github.com/cesar-lizurey/procurator-3000.git`

il suffit d'éxécuter dans le dossier `procurator-3000`

> `npm i`

Afin de ne pas être pollué par d'autres installations, il est possible de se débarrasser de toutes les données non nécessaires:

```
npm cache clean -f
sudo rm -rf node_modules package-lock.json
npm rebuild
```

## Lancement de l'appli

Le serveur peut être lancé via la commance `node index.js`.

Pour accéder au client, il suffit d'ouvrir le fichier `index.html` qui se trouve dans le répertoire `dist`.

# Configuration

## [OPTIONNEL] Configuration de l'imprimante

Une dernière chose à faire peut certainement être de modifier les paramètres d'impression afin d'éviter de gaspiller de l'encre. Voici les deux paramètres recommandés:

* options de l'imprimante > mode de sortie: noir uniquement en niveau de gris
* options des tâches d'imprimante > qualité de l'impression: normale

## [OPTIONNEL] Lancement de l'application au démarrage

Attention, ceci est à réaliser une fois l'application installée.

Il y a de fortes chances pour que l'utilisateur du Procurator 3000 ne soit pas un technicien. Il ne faut donc pas qu'il ait à entrer des commandes pour lancer l'application au démarrage de la machine. Dans ce cas, la librairie `pm2` est toute désignée:

```
sudo npm install pm2@latest -g
pm2 start index.js
pm2 startup systemd
```

Il s'affichera le message suivant dans la console:


> `[PM2] Init System found: systemd`
> `[PM2] To setup the Startup Script, copy/paste the following command:`
> `sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u XXX --hp /home/XXX`

En notant ce qu'il y a à la place des "XXX", il suffira de lancer les commandes suivantes:

```
pm2 save
sudo systemctl start pm2-XXX
```

## Serveur

Une fois installé, il est possible de configurer le Procurator 3000 en modifiant le fichier `default.json` qui se trouve dans le répertoire `config`.

Il s'agit d'un JSON qui comprend les éléments suivants:

* port: le port de l'application sur le serveur;
* commune: commune de rédaction des CERFA, s'il n'en existe qu'une, sinon laisser une chaîne de caractère vide;
* cerfas: iront dessous tous les CERFA. Actuellement il y a "15902-02" et "14952-01". Il est possible de n'en mettre qu'un. Ou zéro aussi, mais l'application perd de son intérêt, du coup.

Au sein de la clé "14952-01" il peut y avoir plusieurs clés pour autant de types d'élection. La clé "mixte" a ceci de particulier qu'elle permet de faire une procuration pour plusieurs élections. À chacune de ces clés correspond un objet qui se compose des clés suivantes:

* date: date du premier tour de l'élection;
* titreBouton: ce qui doit être affiché à l'utilisateur pour qu'il sélectionne l'élection dans le client;
* icone: icône qui sera affichée dans le bouton, avant le texte de celui-ci. Les icônes sont à chercher parmi les [Material Design Icons](https://materialdesignicons.com/);
* couleur: il s'agit de la couleur du bouton de l'élection. Les couleurs sont à choisir parmi les couleurs de [Vuetify](https://vuetifyjs.com/en/styles/colors/).

On peut ainsi avoir le fichier suivant (il s'agit bien d'un exemple):

```javascript
{
  "port": 9114,
  "commune": "COMMUNE",
  "cerfas": {
    "15902-02": {
      "referendum": {
        "date": "",
        "titreBouton": "Pour le referendum d'autodétermination de la Nouvelle-Calédonie",
        "icone": "flag",
        "couleur": "success"
      }
    },
    "14952-01": {
      "mixte":{
        "date": "",
        "titreBouton": "Pour plusieurs élections",
        "icone": "vote-outline",
        "couleur": "purple"
      },
      "municipales":{
        "date": "15032020",
        "titreBouton": "Pour les municipales",
        "icone": "vote",
        "couleur": "warning"
      },
      "présidentielles":{
        "date": "25031985",
        "titreBouton": "Pour les présidentielles",
        "icone": "vote",
        "couleur": "warning"
      },
      "législatives":{
        "date": "01042020",
        "titreBouton": "Pour les législatives",
        "icone": "vote",
        "couleur": "warning"
      }
    }
  }
}
```

Ce qui aura l'effet suivant dans le client:

![Exemple de boutons][exemple_boutons]

## Client

Le client est lui aussi configurable. Il suffit pour cela de modifier les paramètres dans le répertoire `src` pour ensuite générer une nouvelle version de l'application en exécutant `npm run build` (la nouvelle version de l'application sera dans le dossier `dist`). Le fichier à modifier est `src/store/modules/serveur.js`, qui a un début ressemblant à ceci:

```javascript
const state = {
  config: {
    adresse: "ADRESSESERVEUR",
    fonction: "FONCTIONSERVEUR"
  }
}
```

Le paramètre `adresse` peut prendre la valeur `http://localhost:9114`, par exemple, ou toute autre adresse permettant d'envoyer les requêtes à l'endroit où vous avez installé le serveur.
Le paramètre `fonction` permet de choisir ce que l'on demande au serveur. Il y a deux possibilités, et quoiqu'il arrive une copie du PDF est sauvegardée sur le serveur:

* `telechargement`: lorsque le client contactera le serveur, il recevra un fichier PDF qui s'ouvrira dans un nouvel onglet;
* `impression`: la requête que le client envoie aura pour effet de demander au serveur d'imprimer directement le CERFA rempli.

N'oubliez pas de déplacer le contenu du dossier `dist` à l'emplacement où vous souhaitez que le client soit accessible.

# Fonctionnalités spéciales

## Nettoyage des PDF

L'application génère un PDF pour chaque demande de procuration ou résiliation. Il faudra au bout d'un moment faire le ménage, ne serait-ce que pour respecter les critères de la CNIL, à moins que vous ayez déclaré un fichier des CERFA.

Il suffit de lancer la commande `npm run nettoyerPDF`. Il vous sera demandé une confirmation avant de supprimer tous les PDF se trouvant dans le répertoire `output`.

## Actualisation des données

L'application est livrée avec deux jeux de données: les adresses des mairies et celles des représentations françaises à l'étranger. Ces données servent à remplir la partie "adresse" des documents, afin que l'utilisateur n'ait pas à les chercher.

Néanmoins, il est possible que des données aient changé entre l'installation de l'application et son utilisation. Afin de disposer des données à jour, il est possible de lancer la commande `npm run actualiserDonnees`. Attention, il vous faut avoir PERL sur l'ordinateur ainsi qu'une connexion internet pour que le script aille chercher les données. Voici les données qui sont utilisées:

* [Service-public.fr - Annuaire de l’administration - Base de données locales](https://www.data.gouv.fr/fr/datasets/service-public-fr-annuaire-de-l-administration-base-de-donnees-locales);
* [Liste des départements français métropolitains, d'outre mer et les COM ainsi que leurs préfectures](https://www.data.gouv.fr/fr/datasets/liste-des-departements-francais-metropolitains-doutre-mer-et-les-com-ainsi-que-leurs-prefectures/);
* [Coordonnées des représentations diplomatiques](https://www.data.gouv.fr/fr/datasets/coordonnees-des-representations-diplomatiques).

## Statistiques

Dans la mesure où il n'y a pas de base de données, les statistiques se basent uniquement sur les fichiers PDF générés. Les statistiques sont disponibles en lançant la commande `npm run genererStats`. De manière assez basique, il est possible d'avoir les éléments suivants:

* nombre de procurations (total et par type);
* nombre de résiliations (total et par type d'élection).


[exemple_boutons]: ./docs/exemple_boutons.png "Example de boutons"
