/**
 * Reglas de validación para el formulario de crear documento.
 * Autor: Ana Gabriela Ordoñez Güemes.
 * Devuelve un objeto { campo: 'mensaje de error' } o {} si todo es válido.
 */

const MIN_NOMBRE = 2
const MAX_NOMBRE = 80
const EDAD_MIN = 1
const EDAD_MAX = 120
const TELEFONO_MIN = 10
const TELEFONO_MAX = 15
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Solo letras, espacios y caracteres con tilde/ñ */
const SOLO_TEXTO = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/

export function validateCreateForm(form) {
  const errors = {}

  const nombre = (form.nombre || '').trim()
  if (!nombre) {
    errors.nombre = 'El nombre es obligatorio.'
  } else if (nombre.length < MIN_NOMBRE) {
    errors.nombre = `El nombre debe tener al menos ${MIN_NOMBRE} caracteres.`
  } else if (nombre.length > MAX_NOMBRE) {
    errors.nombre = `El nombre no puede superar ${MAX_NOMBRE} caracteres.`
  } else if (!SOLO_TEXTO.test(nombre)) {
    errors.nombre = 'El nombre solo puede contener letras y espacios.'
  }

  const apellido = (form.apellido || '').trim()
  if (!apellido) {
    errors.apellido = 'El apellido es obligatorio.'
  } else if (apellido.length < MIN_NOMBRE) {
    errors.apellido = `El apellido debe tener al menos ${MIN_NOMBRE} caracteres.`
  } else if (apellido.length > MAX_NOMBRE) {
    errors.apellido = `El apellido no puede superar ${MAX_NOMBRE} caracteres.`
  } else if (!SOLO_TEXTO.test(apellido)) {
    errors.apellido = 'El apellido solo puede contener letras y espacios.'
  }

  const edad = (form.edad || '').trim()
  if (!edad) {
    errors.edad = 'La edad es obligatoria.'
  } else {
    const num = parseInt(edad, 10)
    if (Number.isNaN(num)) {
      errors.edad = 'La edad debe ser un número.'
    } else if (num < EDAD_MIN || num > EDAD_MAX) {
      errors.edad = `La edad debe estar entre ${EDAD_MIN} y ${EDAD_MAX}.`
    }
  }

  const telefono = (form.telefono || '').replace(/\s/g, '')
  if (!telefono) {
    errors.telefono = 'El teléfono es obligatorio.'
  } else if (!/^\d+$/.test(telefono)) {
    errors.telefono = 'El teléfono solo puede contener números.'
  } else if (telefono.length < TELEFONO_MIN || telefono.length > TELEFONO_MAX) {
    errors.telefono = `El teléfono debe tener entre ${TELEFONO_MIN} y ${TELEFONO_MAX} dígitos.`
  }

  const correo = (form.correo || '').trim()
  if (!correo) {
    errors.correo = 'El correo electrónico es obligatorio.'
  } else if (!EMAIL_REGEX.test(correo)) {
    errors.correo = 'Introduce un correo electrónico válido (ej: nombre@dominio.com).'
  } else if (correo.length > 254) {
    errors.correo = 'El correo es demasiado largo.'
  }

  return errors
}
