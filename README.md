![Logo Procurator 3000][logo_procurator]

Licence: [BY-NC-SA 4.0](./LICENCE.md)

# Qu'est-ce que c'est

Le Procurator 3000, en dépit de son nom imposant le respect le plus total, n'est en réalité qu'un simple assistant de rédaction de procuration. Il permet au travers d'une expérience utilisateur dirigée vers l'ergonomie de faciliter les démarches, et ainsi de produire un document officiel sans erreur, avec un gain de temps considérable.

# Les origines

En tant que gendarme, il nous incombe la tâche fastidieuse de réaliser des procurations. Ce n'est pas notre cœur de métier et cela nous prend un nombre d'heures nous éloignant de nos missions premières, comme le contact avec le citoyen et la prévention des crimes, des délits et de tout trouble à l'ordre public.

Les difficultés sont multiples:

* pénurie de CERFA cartonnés rose;
* ratures du citoyen;
* champs mal remplis;
* incohérences entre les champs;
* oubli des conditions de validité d'une procuration;
* saturation des accueils des unités, entraînant une gêne pour le public ayant une véritable urgence;
* pas forcément d'accès à internet (recherche des adresses de mairie, des imprimés, etc.);
* etc.

Les technologies existent pourtant pour faciliter à la fois le travail des gendarmes mais également les formalités que doivent accomplir les citoyens désireux de donner ou résilier une procuration.

# Ce qui est couvert

Le Procurator 3000 permet de générer toutes les demandes et les résiliations de procuration pour les élections françaises (municipales, présidentielles, etc.), referendum d'autodétermination de Nouvelle-Calédonie compris.

Les documents sont sauvegardés en format PDF et/ou peuvent être imprimés directement.

Les procurations couvertes sont celles rédigeables sur les CERFA 14952-01 (municipales, législatives, présidentielles, etc.) ainsi que 15902-02 (référendum d'autodétermination de la Nouvelle-Calédonie).

# Les options

Il est possible d'utiliser le Procurator 3000 sur un ordinateur indépendant déconnecté du réseau, mais également d'installer un client Procurator 3000 sur un ou plusieurs ordinateurs qui iront envoyer leurs requêtes à un serveur Procurator 3000 distant; celui-ci peut imprimer directement les documents ou renvoyer un document PDF aux ordinateurs qui en font la demande.

L'utilisation du Procurator 3000 peut imprimer directement le document officiel (également sauvegardé sur le serveur) qui doit simplement être validé par un agent habilité.

Cet outil est particulièrement utile entre les mains de délégués d'OPJ désignés par un magistrat, comme l'[article R72 du Code Électoral](https://www.legifrance.gouv.fr/affichCodeArticle.do?idArticle=LEGIARTI000006354586&cidTexte=LEGITEXT000006070239&dateTexte=20061013) en donne la possibilité.

# Démonstration

Une version de l'application est disponible ici: [https://cesar.lizurey.fr/procurator-3000](https://cesar.lizurey.fr/procurator-3000). Cette application permet de télécharger les PDF générés, elle n'imprimera rien.

Attention, __aucun document n'est sauvegardé__, donc pensez bien à télécharger le document, car il ne sera pas récupérable.

Attention pour les utilisateurs ultramarins: l'heure du serveur est métropolitaine, donc si vous utilisez l'application, __les CERFAS seront édités avec l'heure de Paris__.

# Technique

Cette partie s'adresse à ceux qui veulent installer le Procurator 3000 et/ou en comprendre le fonctionnement.

## Fonctionnement du Procurator 3000

Le Procurator 3000 se divise en deux parties:

* le serveur: développé en NodeJS, il contient l'ensemble des API ainsi que la génération des PDF, et l'envoi à l'imprimante si le serveur est relié à une imprimante;
* le client: c'est une page HTML qui permet de remplir un formulaire. Ce client consomme les API et À l'issue du remplissage du formulaire, il envoie les données aux serveur, pour soit imprimer le CERFA rempli, soit le télécharger sur le poste du client.

Les API sont les suivantes:

* `/boutonsElections/:fonction`: permet de récupérer les boutons afin que l'utilisateur puisse choisir entre tous les CERFA possibles. La fonction est soit "résilier", soit "donner", selon que l'on veuille respectivement résilier ou donner une procuration;
* `/communes/:lettres?`: permet de récupérer la liste des adresses des mairies des communes. Attention, le client ne va consommer cette API uniquement si au moins trois caractères sont remplis;
* `/consulat/:lettres?`: permet de récupérer la liste des adresses des représentations de la France à l'étranger.

## Modes d'utilisation

Il y a trois modes d'utilisation, qui dépendent de l'organisation de chaque service souhaitant mettre en place l'outil.

### 1. Indépendant

Il s'agit du mode le plus pratique si on ne souhaite pas dépendre du réseau et que l'on souhaite emporter le Procurator 3000 avec soi, dans le cas des procurations à domicile, par exemple, ou lorsque des délégués civils sont désignés pour réaliser les procurations et qu'ils ne peuvent avoir accès à l'intranet institutionnel.

Dans ce cas, le serveur et le client sont installés sur la même machine, cette machine étant idéalement reliée à une imprimante portable pour plus de commodités. Ce dispositif est mobile, et est à la base du développement de l'outil.

### 2. Centralisé

Ici, le serveur et le client sont également installés sur la même machine, mais chaque utilisateur accède au client via son navigateur, par exemple à l'adresse `http://monintranet.fr/procurator`. Il n'y a pas de client à installer sur les postes des utilisateurs. Cela permet en une installation de permettre à plusieurs utilisateurs sur un même réseau d'utiliser l'outil. Dans ce mode, chaque utilisateur, accédant donc au même client, aura accès à la même fonction pour le CERFA, soit l'impression ou le téléchargement.

Dans ce cas, il faut prêter attention à la configuration de la commune dans le serveur. En effet, dans le cas d'utilisateurs répartis dans différentes communes, il faut que le serveur n'impose pas de commune.

### 3. Décentralisé

Ce mode, qui peut être complémentaire du précédent, consiste à installer des clients différents selon les machines. Ainsi chaque client peut indépendamment être configuré pour télécharger ou imprimer directement les CERFA.

Par exemple, les utilisateurs à proximité de l'imprimante auront accès au client centralisé qui leur permet d'imprimer directement, les autres, par leur client local, ne pourront que télécharger le CERFA pour l'envoyer ou l'imprimer ultérieurement.

## Prérequis

Le Procurator 3000, du moins sa partie serveur, est fait pour être installé sur un Linux. Bien évidemment, la partie client peut être utilisée sur n'importe quel système d'exploitation.

### [OPTIONNEL] PERL

PERL est nécessaire pour actualiser les données (adresses des mairies et des représentations françaises à l'étranger), comme décrit dans le paragraphe "Fonctionnalités spéciales". Les modules suivants sont utilisés, il faudra les installer au préalable:

```perl
use Term::ANSIColor;
use utf8;
use strict;
use warnings;
use JSON qw( decode_json );
use File::Find::Rule qw( );
use Term::ProgressBar;
use XML::Simple;
use Data::Dumper;
use Scalar::Util qw(looks_like_number);
use File::Slurp;
```

## Installation & configuration

Les instructions pour installer et configurer le procurator se trouvent [ici](./INSTALL.md).

## Contribuer au code

[Règles de contribution](./CONTRIBUTING.md)

## Technologies utilisées

![NodeJS][logo_nodejs]
![VueJS][logo_vuejs]
![Vuetify][logo_vuetify]
![Bootstrap][logo_perl]


[logo_procurator]: ./docs/logo01.jpg "Logo du Procurator 3000"
[logo_nodejs]: ./docs/nodejs_logo.png "NodeJS"
[logo_vuejs]: ./docs/vue_logo.png "VueJS"
[logo_vuetify]: ./docs/vuetify_logo.png "Vuetify"
[logo_perl]: ./docs/perl_logo.png "Perl"
