#!/bin/bash
# Inicia el backend FastAPI
cd "$(dirname "$0")"
if [ ! -d ".venv" ]; then
  echo "Creando entorno virtual..."
  python3 -m venv .venv
fi
echo "Activando entorno e instalando dependencias..."
. .venv/bin/activate
pip install -q -r requirements.txt
echo "Iniciando API en http://localhost:8000"
exec uvicorn app.main:app --reload --port 8000
