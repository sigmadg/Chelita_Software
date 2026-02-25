/**
 * E2E: Crear documento PDF (con API interceptada).
 * No requiere backend en ejecución. La API se simula con cy.intercept().
 */
describe('Crear documento PDF', () => {
  const fakeCode = 'AB12CD34EF'

  beforeEach(() => {
    cy.intercept('POST', '/create', {
      statusCode: 200,
      body: { success: true, document_code: fakeCode },
    }).as('createDocument')
    cy.visit('/')
  })

  it('muestra el encabezado y el formulario de crear documento', () => {
    cy.contains('h1', 'Chelita Software').should('be.visible')
    cy.contains('Crear documento PDF').should('be.visible')
    cy.get('input#nombre').should('be.visible')
    cy.get('input#apellido').should('be.visible')
    cy.get('input#edad').should('be.visible')
    cy.get('input#telefono').should('be.visible')
    cy.get('input#correo').should('be.visible')
    cy.contains('button', 'Crear PDF y obtener código').should('be.visible')
  })

  it('al enviar el formulario muestra el código y mensaje de éxito', () => {
    cy.get('input#nombre').type('María')
    cy.get('input#apellido').type('López')
    cy.get('input#edad').type('30')
    cy.get('input#telefono').type('5512345678')
    cy.get('input#correo').type('maria@test.com')

    cy.contains('button', 'Crear PDF y obtener código').click()

    cy.wait('@createDocument').its('request.body').should('deep.equal', {
      nombre: 'María',
      apellido: 'López',
      edad: '30',
      telefono: '5512345678',
      correo: 'maria@test.com',
    })

    cy.contains(fakeCode).should('be.visible')
    cy.contains(/documento creado correctamente/i).should('be.visible')
  })

  it('muestra error cuando la API falla', () => {
    cy.intercept('POST', '/create', {
      statusCode: 500,
      body: { detail: 'Error del servidor' },
    }).as('createFail')

    cy.get('input#nombre').type('A')
    cy.get('input#apellido').type('B')
    cy.get('input#edad').type('1')
    cy.get('input#telefono').type('1')
    cy.get('input#correo').type('a@b.com')
    cy.contains('button', 'Crear PDF y obtener código').click()

    cy.wait('@createFail')
    cy.contains('Error del servidor').should('be.visible')
  })
})
