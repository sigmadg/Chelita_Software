#!/bin/bash
# Ejecuta Cypress en modo interactivo (interfaz gráfica).
# Uso: ./run-cypress-open.sh   o   bash run-cypress-open.sh
#
# IMPORTANTE: Antes de abrir un spec en Cypress, arranca el frontend en otra terminal:
#   cd "ruta/a/frontend" && npm run dev
# Cuando veas "Local: http://localhost:5173", ya puedes hacer clic en un spec en Cypress.

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

if ! [ -d "node_modules/cypress" ]; then
  echo "Instalando dependencias..."
  npm install
fi

echo "Abriendo Cypress. Si aun no esta el servidor, en otra terminal ejecuta:"
echo "  cd \"$DIR\" && npm run dev"
echo ""
exec npm run cypress:open
