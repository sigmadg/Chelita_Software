# Reto Chelita Software - Fullstack

Solución al reto: API en FastAPI para editar una plantilla PDF y frontend en React para crear y descargar documentos.

**Autor:** Ana Gabriela Ordoñez Güemes

## Requisitos

- Python 3.10+
- Node.js 18+

## Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # En Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

La API quedará en `http://localhost:8000`. Documentación: `http://localhost:8000/docs`.

### Endpoints

- **POST /create**  
  Body: `{ "nombre", "apellido", "edad", "telefono", "correo" }`  
  Respuesta: `{ "success": true, "document_code": "XXXXXXXXXX" }` (código único 10 caracteres).

- **GET /document/{code}**  
  Respuesta: `{ "success": true, "document_b64": "..." }` (PDF en base64).

### Colección Postman

En la carpeta **`postman/`** hay una colección para validar la API desde Postman:

- **`Chelita_Software_PDF_API.postman_collection.json`**

**Uso:**

1. Arranca el backend (FastAPI) en `http://localhost:8000`.
2. En Postman: **Import** → selecciona el archivo `.json` de la carpeta `postman`.
3. Ejecuta en este orden:
   - **Health check** — comprueba que el servidor responda.
   - **Crear documento PDF** — envía los datos y recibe el código; el script de la petición guarda el código en la variable `document_code`.
   - **Obtener documento PDF** — usa `{{document_code}}` para descargar el PDF en base64.

La colección incluye también peticiones de ejemplo para errores 400 (código corto) y 404 (código inexistente).  
Variable de colección: `base_url` = `http://localhost:8000` (cambia si usas otro host/puerto).

### Tests unitarios

```bash
cd backend
pip install -r requirements.txt
pytest -v
```

Se ejecutan tests de endpoints (create, get document, health, validación 422, errores 400/404) y de servicio PDF (generación de código y PDF). También hay un test de integración del flujo completo (crear → obtener por código).

### Test E2E de la API

Para validar la API contra un servidor en marcha (por ejemplo antes de desplegar):

```bash
# Con el backend corriendo en otro terminal:
cd backend && source .venv/bin/activate
python ../scripts/e2e_api_test.py
```

Opcional: `API_BASE_URL=http://otro-host:8000 python scripts/e2e_api_test.py`

## Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173`. El proxy de Vite redirige `/create` y `/document` al backend en el puerto 8000.

**Alternativa sin Node/npm:** si `npm install` o `npm run dev` fallan o no inician:

1. Asegúrate de que el **backend** esté corriendo (en otra terminal):  
   `cd backend && . .venv/bin/activate && uvicorn app.main:app --reload --port 8000`
2. Abre en el navegador el archivo **`frontend/index-standalone.html`** (doble clic o “Abrir con” tu navegador), o sirve la carpeta con un servidor y abre ese HTML, por ejemplo:  
   `cd frontend && python3 -m http.server 8080`  
   y luego entra a `http://localhost:8080/index-standalone.html`.

Ese HTML usa React por CDN y no requiere `npm install` ni `npm run dev`.

### Tests automatizados (frontend)

```bash
cd frontend
npm install
npm run test:run
```

Se ejecutan tests con Vitest y React Testing Library: cliente API (createDocument, getDocument, downloadPdfFromBase64) y componente App (formularios, validación, flujo crear documento y descargar por código). Modo watch: `npm run test`.

### Tests E2E con Cypress

Los tests E2E usan **Cypress** y simulan la API con `cy.intercept()`, así que **no hace falta tener el backend en marcha**. El comando `npm run e2e` arranca el frontend, espera a que esté listo y ejecuta Cypress en modo headless.

**Ejecutar todos los tests E2E (arranca el servidor automáticamente):**

```bash
cd frontend
npm install
npm run e2e
```

**Ejecutar Cypress con el servidor ya en marcha** (por ejemplo si ya tienes `npm run dev` en otra terminal):

```bash
npm run cypress:run
```

**Interfaz interactiva de Cypress:**

```bash
npm run cypress:open
```

**Specs incluidos:**

- **create-document.cy.js**: formulario de crear documento, envío correcto, código mostrado, error cuando la API falla.
- **download-by-code.cy.js**: sección de descarga, validación (código vacío, código corto), descarga con código válido, error 404.

Por defecto se excluye **full-flow-live.cy.js**, que usa la API real (backend + frontend en marcha). Para ejecutarlo:

```bash
# Terminal 1: backend
cd backend && source .venv/bin/activate && uvicorn app.main:app --reload --port 8000

# Terminal 2: frontend
cd frontend && npm run dev

# Terminal 3: Cypress contra API real
cd frontend && npm run e2e:live
```

### Funcionalidad

1. **Crear documento**: formulario con nombre, apellido, edad, teléfono y correo. Al enviar se genera el PDF y se muestra un código de 10 caracteres.
2. **Descargar por código**: campo para pegar el código y botón para descargar el PDF.

## Estructura del PDF generado

- Título centrado: "Chelita Software - Fullstack Test"
- Campos: Nombre, Apellido, Edad, Telefono, Correo con los valores enviados.

## Documentación

En la carpeta **`docs/`** se incluye un manual en LaTeX:

- **`Manual_Chelita_Software.tex`**: manual de configuración y explicación de funcionalidad (requisitos, pasos de configuración del backend y frontend, descripción de la API, flujo de la aplicación y tests).

Para generar el PDF del manual (requiere LaTeX instalado, por ejemplo `texlive-full` o `texlive-latex-extra` + `babel-spanish`):

```bash
cd docs
pdflatex Manual_Chelita_Software.tex
pdflatex Manual_Chelita_Software.tex
```

Se generará `Manual_Chelita_Software.pdf`.

## Evaluación

- Diseño: API REST con FastAPI, almacenamiento en memoria por código, frontend React con formulario y descarga.
- Buenas prácticas: PEP8 en backend, modelos Pydantic, separación de capas (models, pdf_service, store).
- Tests: `pytest` para servicio PDF (código único, generación) y para endpoints (create, get document, errores 400/404).
