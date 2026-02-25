/**
 * E2E: Descargar PDF por código (con API interceptada).
 * No requiere backend en ejecución.
 */
describe('Descargar PDF por código', () => {
  const fakeCode = 'XY98ZZ1234'
  const fakeB64 = 'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQlQKL0YxIDEyIFRmCjEwMCA3MDAgVGQKKEhlbGxvIFBERikgVGoKRVQKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQo+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDE0NyAwMDAwMCBuIAowMDAwMDAwMjM2IDAwMDAwIG4gCjAwMDAwMDAzMTggMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA2Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgozOTkKJSVFT0YK' // PDF mínimo en base64

  beforeEach(() => {
    cy.intercept('GET', `/document/${fakeCode}`, {
      statusCode: 200,
      body: { success: true, document_b64: fakeB64 },
    }).as('getDocument')
    cy.visit('/')
  })

  it('muestra la sección de descarga por código', () => {
    cy.contains('Descargar PDF por código').should('be.visible')
    cy.get('input#download-code').should('be.visible')
    cy.contains('button', 'Descargar PDF').should('be.visible')
  })

  it('con código vacío muestra error de validación', () => {
    cy.contains('button', 'Descargar PDF').click()
    cy.contains(/ingresa el código del documento/i).should('be.visible')
  })

  it('con código corto muestra error de 10 caracteres', () => {
    cy.get('input#download-code').type('ABC')
    cy.contains('button', 'Descargar PDF').click()
    cy.contains(/exactamente 10 caracteres/i).should('be.visible')
  })

  it('con código válido llama a la API y muestra éxito', () => {
    cy.get('input#download-code').type(fakeCode)
    cy.contains('button', 'Descargar PDF').click()

    cy.wait('@getDocument')
    cy.contains(/pdf descargado correctamente/i).should('be.visible')
  })

  it('muestra error cuando el documento no existe (404)', () => {
    cy.intercept('GET', '/document/NONEXISTEN', {
      statusCode: 404,
      body: { detail: 'Documento no encontrado' },
    }).as('getDocument404')

    cy.get('input#download-code').type('NONEXISTEN')
    cy.contains('button', 'Descargar PDF').click()

    cy.wait('@getDocument404')
    cy.contains('Documento no encontrado').should('be.visible')
  })
})
