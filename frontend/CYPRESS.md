# Cómo ejecutar las pruebas con Cypress

## Opción 1: Ejecución automática (recomendada)

Desde la carpeta **frontend** (o desde cualquier sitio usando el script):

```bash
cd "/home/sigmadg/Documentos/Chelita Software/frontend"
./run-e2e.sh
```

O sin script:

```bash
cd "/home/sigmadg/Documentos/Chelita Software/frontend"
npm run e2e
```

Ese comando **arranca solo el frontend** en http://localhost:5173 y luego lanza Cypress en modo headless. No hace falta tener el backend. Los tests interceptan la API.

---

## Opción 2: Interfaz gráfica de Cypress

Para ver el navegador y los tests paso a paso:

### Paso 1 – Terminal 1: arrancar el frontend

```bash
cd "/home/sigmadg/Documentos/Chelita Software/frontend"
npm run dev
```

Espera a ver algo como: `Local: http://localhost:5173`. **Deja esta terminal abierta.**

### Paso 2 – Terminal 2: abrir Cypress

```bash
cd "/home/sigmadg/Documentos/Chelita Software/frontend"
npm run cypress:open
```

O usando el script (desde cualquier carpeta):

```bash
"/home/sigmadg/Documentos/Chelita Software/frontend/run-cypress-open.sh"
```

### Paso 3 – En la ventana de Cypress

1. Elige **"E2E Testing"**.
2. Elige un navegador (Chrome o Electron).
3. Verás la lista de specs:
   - **create-document.cy.js**
   - **download-by-code.cy.js**
4. **Haz clic en uno** (por ejemplo `create-document.cy.js`).
5. Se abrirá el navegador y verás cómo se ejecutan los tests (cada paso resaltado).

---

## Si algo falla

- **"Cannot connect to localhost:5173"**: el frontend no está corriendo. Ejecuta en otra terminal `npm run dev` dentro de `frontend` y vuelve a lanzar Cypress.
- **Ruta con espacios**: usa siempre comillas, por ejemplo `cd "/home/sigmadg/Documentos/Chelita Software/frontend"`.
- **"npm run cypress:open" no hace nada**: asegúrate de estar en la carpeta `frontend` (donde está `package.json` y la carpeta `cypress`).
