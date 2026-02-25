/**
 * API client for Chelita PDF backend.
 * Autor: Ana Gabriela Ordoñez Güemes.
 * Parsea JSON de forma segura para evitar "Unexpected end of JSON input"
 * cuando el servidor devuelve cuerpo vacío o no-JSON (400, 404, 500, etc.).
 */
const API_BASE = ''

/** Mensajes por código HTTP cuando la respuesta no trae JSON válido. */
const DEFAULT_MESSAGES = {
  400: 'Solicitud incorrecta',
  401: 'No autorizado',
  404: 'Recurso no encontrado',
  422: 'Datos de entrada no válidos',
  500: 'Error interno del servidor',
}

/**
 * Obtiene el cuerpo de la respuesta como JSON.
 * Si el cuerpo está vacío o no es JSON, devuelve { detail, status_code } según el status.
 */
async function safeJson(res) {
  const text = await res.text()
  if (!text || text.trim() === '') {
    const detail = DEFAULT_MESSAGES[res.status] || `Error ${res.status}`
    return { detail, status_code: res.status }
  }
  try {
    return JSON.parse(text)
  } catch {
    const detail = DEFAULT_MESSAGES[res.status] || (text.slice(0, 100) || `Error ${res.status}`)
    return { detail, status_code: res.status }
  }
}

export async function createDocument(data) {
  const res = await fetch(`${API_BASE}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await safeJson(res)
  if (!res.ok) throw new Error(json.detail || 'Error al crear documento')
  return json
}

export async function getDocument(code) {
  const res = await fetch(`${API_BASE}/document/${encodeURIComponent(code)}`)
  const json = await safeJson(res)
  if (!res.ok) throw new Error(json.detail || 'Error al obtener documento')
  return json
}

export function downloadPdfFromBase64(base64, filename = 'documento.pdf') {
  const link = document.createElement('a')
  link.href = `data:application/pdf;base64,${base64}`
  link.download = filename
  link.click()
}
