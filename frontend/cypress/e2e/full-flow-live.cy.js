/**
 * E2E: Flujo completo con API real (backend y frontend en ejecución).
 * Requiere: backend en http://localhost:8000 y frontend en http://localhost:5173.
 * Ejecutar solo cuando quieras validar integración real: npm run e2e:live
 */
describe('Flujo completo (API real)', { tags: '@live' }, () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('crea un documento y luego lo descarga por código', () => {
    // Crear documento (API real)
    cy.get('input#nombre').type('Cypress')
    cy.get('input#apellido').type('E2E')
    cy.get('input#edad').type('25')
    cy.get('input#telefono').type('5511223344')
    cy.get('input#correo').type('cypress@e2e.test')
    cy.contains('button', 'Crear PDF y obtener código').click()

    cy.contains(/documento creado correctamente/i, { timeout: 10000 }).should('be.visible')

    // Obtener el código mostrado (está en un elemento con clase code-display__value)
    cy.get('.code-display__value').invoke('text').then((code) => {
      const trimmed = code.trim()
      expect(trimmed).to.have.length(10)

      // Descargar usando ese código
      cy.get('input#download-code').type(trimmed)
      cy.contains('button', 'Descargar PDF').click()

      cy.contains(/pdf descargado correctamente/i, { timeout: 10000 }).should('be.visible')
    })
  })
})
