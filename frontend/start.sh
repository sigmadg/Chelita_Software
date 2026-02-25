#!/bin/bash
# Instala dependencias del frontend (solo si falta node_modules)
cd "$(dirname "$0")"
if [ ! -d "node_modules" ]; then
  echo "Instalando dependencias (puede tardar 1-2 minutos)..."
  npm install --no-audit --no-fund
  if [ $? -ne 0 ]; then
    echo "Error: npm install falló. Prueba: npm cache clean --force && npm install"
    exit 1
  fi
  echo "Dependencias instaladas."
else
  echo "node_modules ya existe, omitiendo install."
fi
echo "Iniciando servidor de desarrollo..."
exec npm run dev
