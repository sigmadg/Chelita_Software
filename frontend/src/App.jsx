import { useState } from 'react'
// Chelita Software - Reto Fullstack | Autor: Ana Gabriela Ordoñez Güemes
import { createDocument, getDocument, downloadPdfFromBase64 } from './api'
import { validateCreateForm } from './validation'
import { Button, Card, FormField, Message, CodeDisplay } from './components'

const INITIAL_FORM = {
  nombre: '',
  apellido: '',
  edad: '',
  telefono: '',
  correo: '',
}

export default function App() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [documentCode, setDocumentCode] = useState('')
  const [downloadCode, setDownloadCode] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)
  const [downloadError, setDownloadError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    const errors = validateCreateForm(form)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    setFormErrors({})
    setLoading(true)
    try {
      const result = await createDocument(form)
      setDocumentCode(result.document_code)
      setMessage({
        type: 'success',
        text: 'Documento creado correctamente. Guarda el código para descargarlo.',
      })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadByCode = async (e) => {
    e.preventDefault()
    const code = downloadCode.trim()
    setDownloadError('')
    setMessage({ type: '', text: '' })
    if (!code) {
      setDownloadError('Ingresa el código del documento.')
      return
    }
    if (code.length !== 10) {
      setDownloadError('El código debe tener exactamente 10 caracteres.')
      return
    }
    setLoading(true)
    try {
      const result = await getDocument(code)
      downloadPdfFromBase64(result.document_b64, `documento-${code}.pdf`)
      setMessage({ type: 'success', text: 'PDF descargado correctamente.' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <>
      <header className="app-header">
        <span className="app-badge">Documentos PDF</span>
        <h1 className="app-title">Chelita Software</h1>
        <p className="app-subtitle">
          Crea documentos PDF y descárgalos con un código único
        </p>
      </header>

      <div className="cards-grid">
      <Card title="Crear documento PDF">
        <form onSubmit={handleSubmit}>
          <FormField
            id="nombre"
            label="Nombre"
            value={form.nombre}
            onChange={updateField('nombre')}
            required
            error={formErrors.nombre}
          />
          <FormField
            id="apellido"
            label="Apellido"
            value={form.apellido}
            onChange={updateField('apellido')}
            required
            error={formErrors.apellido}
          />
          <FormField
            id="edad"
            label="Edad"
            type="text"
            inputMode="numeric"
            value={form.edad}
            onChange={updateField('edad')}
            required
            error={formErrors.edad}
          />
          <FormField
            id="telefono"
            label="Teléfono"
            type="tel"
            value={form.telefono}
            onChange={updateField('telefono')}
            required
            error={formErrors.telefono}
          />
          <FormField
            id="correo"
            label="Correo electrónico"
            type="email"
            value={form.correo}
            onChange={updateField('correo')}
            required
            error={formErrors.correo}
          />
          <Button type="submit" loading={loading}>
            Crear PDF y obtener código
          </Button>
        </form>
        {documentCode && (
          <>
            <p style={{ marginBottom: 0, fontWeight: 600, fontSize: '0.9375rem' }}>
              Código del documento
            </p>
            <CodeDisplay code={documentCode} />
          </>
        )}
        {message.text && <Message type={message.type}>{message.text}</Message>}
      </Card>

      <Card title="Descargar PDF por código">
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
          Ingresa el código de 10 caracteres que recibiste al crear el documento.
        </p>
        <form onSubmit={handleDownloadByCode}>
          <div className="download-section">
            <FormField
              id="download-code"
              label="Código"
              value={downloadCode}
              onChange={(e) => setDownloadCode(e.target.value.toUpperCase())}
              placeholder="Ej: EJ21243DIK"
              maxLength={10}
              error={downloadError}
            />
            <Button type="submit" loading={loading}>
              Descargar PDF
            </Button>
          </div>
        </form>
        {message.text && <Message type={message.type}>{message.text}</Message>}
      </Card>
      </div>
    </>
  )
}
