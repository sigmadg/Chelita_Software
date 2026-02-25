import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

vi.mock('./api', () => ({
  createDocument: vi.fn(),
  getDocument: vi.fn(),
  downloadPdfFromBase64: vi.fn(),
}))

import { createDocument, getDocument, downloadPdfFromBase64 } from './api'

describe('App', () => {
  beforeEach(() => {
    vi.mocked(createDocument).mockReset()
    vi.mocked(getDocument).mockReset()
    vi.mocked(downloadPdfFromBase64).mockReset()
  })

  it('renderiza el encabezado y las dos secciones', () => {
    render(<App />)
    expect(screen.getByText('Chelita Software')).toBeInTheDocument()
    expect(screen.getByText('Crear documento PDF')).toBeInTheDocument()
    expect(screen.getByText('Descargar PDF por código')).toBeInTheDocument()
  })

  it('muestra el formulario de crear documento con todos los campos', () => {
    render(<App />)
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/edad/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /crear pdf y obtener código/i })).toBeInTheDocument()
  })

  it('al crear documento exitosamente muestra el código y mensaje de éxito', async () => {
    const user = userEvent.setup()
    vi.mocked(createDocument).mockResolvedValue({ success: true, document_code: 'TEST123456' })

    render(<App />)
    await user.type(screen.getByLabelText(/nombre/i), 'María')
    await user.type(screen.getByLabelText(/apellido/i), 'López')
    await user.type(screen.getByLabelText(/edad/i), '30')
    await user.type(screen.getByLabelText(/teléfono/i), '5512345678')
    await user.type(screen.getByLabelText(/correo electrónico/i), 'maria@test.com')
    fireEvent.click(screen.getByRole('button', { name: /crear pdf y obtener código/i }))

    await waitFor(() => {
      expect(createDocument).toHaveBeenCalledWith({
        nombre: 'María',
        apellido: 'López',
        edad: '30',
        telefono: '5512345678',
        correo: 'maria@test.com',
      })
    })

    await waitFor(() => {
      expect(screen.getByText('TEST123456')).toBeInTheDocument()
    })
    expect(screen.getAllByText(/documento creado correctamente/i).length).toBeGreaterThanOrEqual(1)
  })

  it('al fallar crear documento muestra mensaje de error', async () => {
    const user = userEvent.setup()
    vi.mocked(createDocument).mockRejectedValue(new Error('Error de red'))

    render(<App />)
    await user.type(screen.getByLabelText(/nombre/i), 'María')
    await user.type(screen.getByLabelText(/apellido/i), 'López')
    await user.type(screen.getByLabelText(/edad/i), '30')
    await user.type(screen.getByLabelText(/teléfono/i), '5512345678')
    await user.type(screen.getByLabelText(/correo electrónico/i), 'maria@test.com')
    fireEvent.click(screen.getByRole('button', { name: /crear pdf y obtener código/i }))

    await waitFor(() => {
      expect(screen.getAllByText('Error de red').length).toBeGreaterThanOrEqual(1)
    })
  })

  it('al enviar formulario vacío muestra errores de validación y no llama createDocument', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /crear pdf y obtener código/i }))

    await waitFor(() => {
      expect(screen.getByText(/el nombre es obligatorio/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/el apellido es obligatorio/i)).toBeInTheDocument()
    expect(screen.getByText(/la edad es obligatoria/i)).toBeInTheDocument()
    expect(screen.getByText(/el teléfono es obligatorio/i)).toBeInTheDocument()
    expect(screen.getByText(/el correo electrónico es obligatorio/i)).toBeInTheDocument()
    expect(createDocument).not.toHaveBeenCalled()
  })

  it('nombre con un solo carácter muestra error de validación', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/nombre/i), 'A')
    await user.type(screen.getByLabelText(/apellido/i), 'López')
    await user.type(screen.getByLabelText(/edad/i), '30')
    await user.type(screen.getByLabelText(/teléfono/i), '5512345678')
    await user.type(screen.getByLabelText(/correo electrónico/i), 'maria@test.com')
    fireEvent.click(screen.getByRole('button', { name: /crear pdf y obtener código/i }))

    await waitFor(() => {
      expect(screen.getByText(/el nombre debe tener al menos 2 caracteres/i)).toBeInTheDocument()
    })
    expect(createDocument).not.toHaveBeenCalled()
  })

  it('correo inválido muestra error de validación', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/nombre/i), 'María')
    await user.type(screen.getByLabelText(/apellido/i), 'López')
    await user.type(screen.getByLabelText(/edad/i), '30')
    await user.type(screen.getByLabelText(/teléfono/i), '5512345678')
    await user.type(screen.getByLabelText(/correo electrónico/i), 'correo-sin-arroba')
    fireEvent.click(screen.getByRole('button', { name: /crear pdf y obtener código/i }))

    await waitFor(() => {
      expect(screen.getByText(/correo electrónico válido/i)).toBeInTheDocument()
    })
    expect(createDocument).not.toHaveBeenCalled()
  })

  it('validación descarga: código vacío muestra error', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /descargar pdf/i }))

    await waitFor(() => {
      expect(screen.getByText(/ingresa el código del documento/i)).toBeInTheDocument()
    })
    expect(getDocument).not.toHaveBeenCalled()
  })

  it('validación descarga: código con menos de 10 caracteres muestra error', async () => {
    const user = userEvent.setup()
    render(<App />)
    const codeInput = screen.getByPlaceholderText('Ej: EJ21243DIK')
    await user.type(codeInput, 'ABC')
    fireEvent.click(screen.getByRole('button', { name: /descargar pdf/i }))

    await waitFor(() => {
      expect(screen.getByText(/exactamente 10 caracteres/i)).toBeInTheDocument()
    })
    expect(getDocument).not.toHaveBeenCalled()
  })

  it('al descargar con código válido llama getDocument y downloadPdfFromBase64', async () => {
    const user = userEvent.setup()
    vi.mocked(getDocument).mockResolvedValue({ success: true, document_b64: 'b64content' })

    render(<App />)
    const codeInput = screen.getByPlaceholderText('Ej: EJ21243DIK')
    await user.type(codeInput, '1234567890')
    fireEvent.click(screen.getByRole('button', { name: /descargar pdf/i }))

    await waitFor(() => {
      expect(getDocument).toHaveBeenCalledWith('1234567890')
    })
    await waitFor(() => {
      expect(downloadPdfFromBase64).toHaveBeenCalledWith('b64content', 'documento-1234567890.pdf')
    })
  })
})
