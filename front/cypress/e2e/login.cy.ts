context("Admin login and managing sessions", () => {
  before(() => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
      body: {
        token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ5b2dhQHN0dWRpby5jb20iLCJpYXQiOjE3MzYzNDMzMjAsImV4cCI6MTgzNjQyOTAyMH0.W6ymliWvtyYM6ILmTp4rCkVKgANMksp8o8VI0TWyDnovcny7Yi0SyN43FCajvTLd-IMq_frDVqsW3wFzB0YowA',
        type: 'Bearer',
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    })

    cy.intercept('GET', '/api/teacher', {
      statusCode: 200,
      body: [
        { id: 1, lastName: "DELAHAYE", firstName: "Margot" },
        { id: 2, lastName: "THIERCELIN", firstName: "Hélène" }
      ],
    }).as('getTeachers');

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []
    ).as('session')

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.url().should('include', '/sessions')
  })

  describe('Admin creates a new Session', () => {

    it('Type data with missing field, submit form not working', () => {

      cy.get('button').contains('Create').click();

      cy.get('input[formControlName=name]').type("Les bases du Yoga");
      cy.get('input[formControlName=date]').type("2025-01-15");
      cy.get('textarea[formControlName=description]').type("Apprendre le yoga.");

      cy.wait("@getTeachers");

      cy.get('button[type=submit]').should('be.disabled');
    });


    it('Type data and submit form', () => {
      cy.intercept("POST", "/api/session", {
        body: {
          id: 1,
          name: "Les bases du Yoga",
          date: "2025-01-15",
          teacher_id: 1,
          description: "Apprendre le yoga.",
          users: [],
          createdAt: "2025-01-08T17:01:31.519963",
          updatedAt: "2025-01-08T17:01:31.521037"
        },
      }).as("createSession");

      cy.intercept(
        "GET", "/api/session", [
        {
          id: 1,
          name: "Les bases du Yoga",
          date: "2025-01-15",
          teacher_id: 1,
          description: "Apprendre le yoga.",
          users: [],
          createdAt: "2025-01-08T17:01:31.519963",
          updatedAt: "2025-01-08T17:01:31.521037"
        }
      ]
      ).as("getUpdatedSessions");

      cy.get('mat-select[formControlName=teacher_id]').should('be.visible').click();
      cy.get('mat-option').contains("Margot DELAHAYE").click();
      cy.get('button[type=submit]').should("not.be.disabled").click();

      cy.wait("@createSession");
      cy.url().should("include", "/sessions");
    });
  });

  describe('Admin updates a Session', () => {

    it('Type new data and submit', () => {
      cy.intercept("GET", "/api/session/1", {
        body: {
          id: 1,
          name: "Les bases du Yoga",
          date: "2025-01-15",
          teacher_id: 1,
          description: "Apprendre le yoga.",
          users: [],
          createdAt: "2025-01-08T17:01:31.519963",
          updatedAt: "2025-01-08T17:01:31.521037"
        },
      }).as("getSession");

      cy.intercept('GET', '/api/teacher', {
        statusCode: 200,
        body: [
          { id: 1, lastName: "DELAHAYE", firstName: "Margot" },
          { id: 2, lastName: "THIERCELIN", firstName: "Hélène" }
        ],
      }).as('getTeachers');

      cy.intercept("PUT", "/api/session/1", {
        body: {
          id: 1,
          name: "Les bases du Yoga",
          date: "2025-01-15",
          teacher_id: 1,
          description: "Apprendre le yoga. Nombre limité de places",
          users: [],
          createdAt: "2025-01-08T17:01:31.519963",
          updatedAt: "2025-01-08T17:01:31.521037"
        },
      }).as("updateSession");

      cy.intercept(
        "GET", "/api/session", [
        {
          id: 1,
          name: "Les bases du Yoga",
          date: "2025-01-15",
          teacher_id: 1,
          description: "Apprendre le yoga. Nombre limité de places.",
          users: [],
          createdAt: "2025-01-08T17:01:31.519963",
          updatedAt: "2025-01-08T17:01:31.521037"
        }
      ]
      ).as("getUpdatedSessions");

      cy.get('button').contains('Edit').click();

      cy.get('textarea[formControlName=description]').type(" Nombre limité de places.");
      cy.get('button[type=submit]').should("not.be.disabled").click();

      cy.wait("@updateSession");
      cy.url().should("include", "/sessions");
    })
  });

  describe('Admin deletes a Session', () => {

    it('Delete a session', () => {
      cy.intercept("GET", "/api/session/1", {
        body: {
          id: 1,
          name: "Les bases du Yoga",
          date: "2025-01-15",
          teacher_id: 1,
          description: "Apprendre le yoga.",
          users: [],
          createdAt: "2025-01-08T17:01:31.519963",
          updatedAt: "2025-01-08T17:01:31.521037"
        },
      }).as("getSession");

      cy.intercept('GET', '/api/teacher/1', {
        statusCode: 200,
        body: {
          id: 1, lastName: "DELAHAYE",
          firstName: "Margot"
        },
      }).as('getTeacher');

      cy.intercept(
        {
          method: 'DELETE',
          url: '/api/session/1',
        },
        []
      ).as('deleteSession')

      cy.intercept(
        {
          method: 'GET',
          url: '/api/session',
        },
        []
      ).as('updateSession')

      cy.get('button').contains('Detail').click();

      cy.get('button').contains('Delete').click();

      cy.wait("@deleteSession");
      cy.wait("@updateSession");
      cy.url().should("include", "/sessions");
    })
  });

  describe('Admin info and logout', () => {

    it('Admin can see account data', () => {
      cy.intercept('GET', '/api/user/1', {
        body: {
          id: 1,
          email: "yoga@studio.com",
          username: 'userName',
          firstName: 'firstName',
          lastName: 'lastName',
          admin: true,
          createdAt: "2024-12-29T16:20:58",
          updatedAt: "2024-12-29T16:20:58"
        },
      })

      cy.get('span').contains('Account').click();
      cy.url().should("include", "/me");

    })

    it('Admin should logout', () => {

      cy.get('span').contains('Logout').click();

      cy.url().should('eq', Cypress.config().baseUrl); 

      cy.get('span').contains('Login').should('be.visible'); 

    })
  })

});