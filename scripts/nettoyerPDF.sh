#!/bin/bash
result=$(find ./output/ ! -type d |  wc -l)
if [ ${result} = 0 ]
  then
    printf "Il n'y a rien à effacer.\n"
  else
    printf "${result} fichiers ont été trouvés.\n"
    read -p "Voulez-vous effacer ces fichiers? (O/N)" -n 1 -r
    if [[ $REPLY =~ ^[Oo]$ ]]
      then
        find ./output/ ! -type d -exec rm '{}' \;
        printf "\nTous les fichiers ont été effacés.\n"
      else
        printf "\nAucun fichier n'a été effacé.\n"
    fi
fi
