#!/bin/bash
NBPROCU="$(ls -1q ./output/*/procuration/*.pdf | wc -l)"
echo "Nombre total de procurations: ${NBPROCU}"
NBRESI="$(ls -1q ./output/*/resiliation/*.pdf | wc -l)"
echo "Nombre total de résiliations: ${NBRESI}"
echo "Nombre par type d'élection:"
for D in ./output/*; do
    if [ -d "${D}" ]; then
        echo "--> ${D/.\/output\//}"
        if [ -d "${D}/procuration/" ]; then
          NBPROCU="$(ls -1q ${D}/procuration/*.pdf | wc -l)"
        else
          NBPROCU=0
        fi
        if [ -d "${D}/resiliation/" ]; then
          NBRESI="$(ls -1q ${D}/resiliation/*.pdf | wc -l)"
        else
          NBRESI=0
        fi
        echo "  Procurations: ${NBPROCU} - Résiliations: ${NBRESI}"
    fi
done
