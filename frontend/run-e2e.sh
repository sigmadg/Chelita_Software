#!/bin/bash
# Ejecuta las pruebas E2E de Cypress (arranca el servidor y lanza los tests).
# Uso: ./run-e2e.sh   o   bash run-e2e.sh
# No hace falta tener el backend ni el frontend corriendo; el script lo inicia todo.

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

if ! [ -d "node_modules/cypress" ]; then
  echo "Instalando dependencias..."
  npm install
fi

echo "Ejecutando E2E: se arrancará el servidor y luego Cypress..."
npm run e2e
