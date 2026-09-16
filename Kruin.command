#!/bin/zsh
set -u
SCRIPT_DIR="${0:A:h}"
open "$SCRIPT_DIR/Kruin.html"
if [[ $? -ne 0 ]]; then
  echo "FOUT: 3B Kruin-beheer kon niet worden geopend."
  read "?Druk op Enter om te sluiten."
  exit 1
fi
