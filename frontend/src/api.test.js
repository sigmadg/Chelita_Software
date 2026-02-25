import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createDocument, getDocument, downloadPdfFromBase64 } from './api'

describe('api', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('createDocument', () => {
    it('envía POST a /create y devuelve document_code', async () => {
      const mockData = {
        nombre: 'Test',
        apellido: 'User',
        edad: '25',
        telefono: '1234567890',
        correo: 'test@example.com',
      }
      const mockResponse = { success: true, document_code: 'AB12CD34EF' }
      vi.stubGlobal('fetch', vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        })
      ))

      const result = await createDocument(mockData)

      expect(fetch).toHaveBeenCalledWith('/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockData),
      })
      expect(result).toEqual(mockResponse)
      expect(result.document_code).toBe('AB12CD34EF')
    })

    it('lanza Error cuando la respuesta no es ok', async () => {
      vi.stubGlobal('fetch', vi.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ detail: 'Error del servidor' }),
        })
      ))

      await expect(
        createDocument({
          nombre: 'A',
          apellido: 'B',
          edad: '1',
          telefono: '1',
          correo: 'a@b.com',
        })
      ).rejects.toThrow('Error del servidor')
    })
  })

  describe('getDocument', () => {
    it('envía GET a /document/{code} y devuelve document_b64', async () => {
      const mockB64 = 'base64content'
      vi.stubGlobal('fetch', vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, document_b64: mockB64 }),
        })
      ))

      const result = await getDocument('AB12CD34EF')

      expect(fetch).toHaveBeenCalledWith('/document/AB12CD34EF')
      expect(result.document_b64).toBe(mockB64)
    })

    it('codifica el código en la URL', async () => {
      vi.stubGlobal('fetch', vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, document_b64: 'x' }),
        })
      ))

      await getDocument('AB/CD')

      expect(fetch).toHaveBeenCalledWith('/document/AB%2FCD')
    })

    it('lanza Error cuando la respuesta no es ok', async () => {
      vi.stubGlobal('fetch', vi.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ detail: 'Documento no encontrado' }),
        })
      ))

      await expect(getDocument('XXXXXXXXXX')).rejects.toThrow('Documento no encontrado')
    })
  })

  describe('downloadPdfFromBase64', () => {
    it('crea un enlace con data URL y dispara click', () => {
      const link = { href: '', download: '', click: vi.fn() }
      vi.spyOn(document, 'createElement').mockReturnValue(link)

      downloadPdfFromBase64('dGVzdA==', 'mi-doc.pdf')

      expect(document.createElement).toHaveBeenCalledWith('a')
      expect(link.href).toContain('data:application/pdf;base64,dGVzdA==')
      expect(link.download).toBe('mi-doc.pdf')
      expect(link.click).toHaveBeenCalled()
    })
  })
})
