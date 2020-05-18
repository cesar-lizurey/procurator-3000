#!/bin/bash
echo -e "\n\e[96m###############################\nINSTALLATION DU PROCURATOR 3000\n###############################\n\e[0m"

if perl < /dev/null > /dev/null 2>&1  ; then
  echo -e "[\e[32mOK\e[0m] PERL installé, vous pourrez utiliser le script d'actualisation des données.\n"
else
  echo -e "[\e[33mATTENTION\e[0m] PERL n'est pas installé, vous ne pourrez pas utiliser le script d'actualisation des données.\n"
fi

read -p "Cette machine est-elle un serveur Procurator 3000? (O/N)" -n 1 -r serveur
if [[ $serveur =~ ^[Oo]$ ]]
  then
    echo "{" > 'default.json'
    printf "\n"
    read -p "Sur quel port l'application doit-elle écouter (par défaut: 9114)? " -r port
    if [ -z "$port" ] ||  ! [[ "$port" =~ ^[0-9]+$ ]]
      then
        port="9114"
    fi
    echo "  \"port\": $port," >> 'default.json'

    read -p "Quelle commune est concernée par les procurations (ne rien mettre si c'est utilisé par plusieurs communes)? " -r commune
    echo "  \"commune\": \"$commune\"," >> 'default.json'

    echo "  \"cerfas\": {" >> 'default.json'
    read -p "Le serveur doit-il gérer les procurations pour le referendum d'autodétermination? (O/N)" -n 1 -r nc
    if [[ $nc =~ ^[Oo]$ ]]
      then
        echo "    \"15902-02\": {" >> 'default.json'
        echo "      \"referendum\": {" >> 'default.json'
        echo "        \"date\": \"\"," >> 'default.json'
        echo "        \"titreBouton\": \"Pour le referendum d'autodétermination de la Nouvelle-Calédonie\"," >> 'default.json'
        echo "        \"icone\": \"flag\"," >> 'default.json'
        echo "        \"couleur\": \"success\"" >> 'default.json'
        echo "      }" >> 'default.json'
        echo -n "    }" >> 'default.json'
    fi

    printf "\n"
    read -p "Le serveur doit-il gérer d'autres procurations? (O/N)" -n 1 -r autre
    if [[ $autre =~ ^[Oo]$ ]]
      then
        if [[ $nc =~ ^[Oo]$ ]]
          then
            echo "," >> 'default.json'
        fi
        echo "    \"14952-01\": {" >> 'default.json'
        printf "\nMettre quel type de vote (au pluriel: 'municipales', 'législatives'), et dès que vous avez terminé mettez \"F\". Appuyez sur entrée après chaque élection:\n"
        election="O"
        nbElection=0

        while [ $election != "F" ]
        do
          read -r election
          if [[ $election != "F" ]]
            then
              ((nbElection=nbElection+1))
              if [[ $nbElection > 1 ]]
                then
                  echo "," >> 'default.json'
              fi
              echo "      \"$election\": {" >> 'default.json'
              read -p "--> quelle est la date de ce vote, au format JJMMAAAA, par exemple 25031985 pour le 25 mars 1985: " -r date
              echo "        \"date\": \"$date\"," >> 'default.json'
              echo "        \"titreBouton\": \"Pour les $election\"," >> 'default.json'
              echo "        \"icone\": \"vote\"," >> 'default.json'
              echo "        \"couleur\": \"warning\"" >> 'default.json'
              echo -n "      }" >> 'default.json'
              echo "Autre élection (au pluriel: 'municipales', 'législatives')? Sinon mettre \"F\": "
          fi

        done

        if [[ $nbElection > 1 ]]
          then
            echo "," >> 'default.json'
            echo "      \"mixte\": {" >> 'default.json'
            echo "        \"date\": \"\"," >> 'default.json'
            echo "        \"titreBouton\": \"Pour plusieurs élections\"," >> 'default.json'
            echo "        \"icone\": \"vote-outline\"," >> 'default.json'
            echo "        \"couleur\": \"purple\"" >> 'default.json'
            echo -n "      }" >> 'default.json'
        fi
        echo "" >> 'default.json'
        echo "    }" >> 'default.json'
        echo "  }" >> 'default.json'
        echo "}" >> 'default.json'

        mv default.json ./config/
    fi

fi

printf "\n"
read -p "Cette machine est-elle un client Procurator 3000? (O/N)" -n 1 -r client
if [[ $client =~ ^[Oo]$ ]]
  then
    printf "\n"
    read -p "À quelle adresse le client contactera-t-il le serveur (par défaut \"http://localhost:9114\")? " -r adresse
    if [ -z "$adresse" ]
      then
        adresse="http://localhost:9114"
    fi
    echo "const state = {" > 'serveur.js'
    echo "  config: {" >> 'serveur.js'
    echo "    adresse: \"$adresse\"," >> 'serveur.js'

    read -p "Ce client [T]éléchargera-t-il les PDF ou les [I]mprimera-t-il? (T/I)" -n 1 -r fonction
    if [[ $fonction =~ ^[Tt]$ ]]
      then
        echo "    fonction: \"telechargement\"" >> 'serveur.js'
      else
        echo "    fonction: \"impression\"" >> 'serveur.js'
    fi
    echo "  }" >> 'serveur.js'
    echo "}" >> 'serveur.js'

    echo "const getters = {" >> 'serveur.js'
    echo "  serveur: state => {" >> 'serveur.js'
    echo "    return state.serveur" >> 'serveur.js'
    echo "  }" >> 'serveur.js'
    echo "}" >> 'serveur.js'
    echo "export default {" >> 'serveur.js'
    echo "  namespaced: true," >> 'serveur.js'
    echo "  state," >> 'serveur.js'
    echo "  getters" >> 'serveur.js'
    echo "}" >> 'serveur.js'

    mv serveur.js ./src/store/modules/
  else
    if [[ $serveur =~ ^[Nn]$ ]]
      then
        printf "\nDonc vous ne voulez ni installer de serveur ou de client. J'ai du mal à cerner ce que vous voulez faire. Pensez à consulter.\n"
    fi
fi

echo -e "\n\n\e[36m-------------------------------------\nFIN DU PARAMÉTRAGE DU PROCURATOR 3000\n-------------------------------------\n\e[0m"

echo -e "\n\n\e[36m------------------------------------\nINSTALLATION DES PAQUETS NÉCESSAIRES\n------------------------------------\n\e[0m"

sudo apt-get update
sudo apt install node-gyp
sudo apt install libcups2-dev
sudo apt-get install build-essential
sudo npm install -g graceful-fs

echo -e "\n\n\e[36m------------------------------------------\n FIN D'INSTALLATION DES PAQUETS NÉCESSAIRES\n------------------------------------------\n\e[0m"
