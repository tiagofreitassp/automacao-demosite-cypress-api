// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import sessionStore from './sessionStore';
import utils from './utils';

Cypress.Commands.add('account', (username, password) => {
    const user = username+'_'+utils.obterDataHora();
    sessionStore.username = user;
    sessionStore.password = password;
    cy.log(`Criando cadastro para o usuário '${user}' com a senha '${password}'`);

    cy.criarCadastro();
    cy.autorizacao();
    cy.gerarToken();
    cy.consultaConta();
});

Cypress.Commands.add('criarCadastro', () => {
    const baseUrl = Cypress.config('baseUrl');

    cy.request({
        method: 'POST',
        url: `${baseUrl}/Account/v1/User`,
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: {
            userName: sessionStore.username,
            password: sessionStore.password
        }
    }).then((response) => {
        expect(response.status).to.eq(201);

        const userId = response.body.userID || response.body.userId;
        sessionStore.userID = userId;

        cy.log(`Conta criada com o userID '${userId}' e o Usuário '${sessionStore.username}'`);
    });
});

Cypress.Commands.add('autorizacao', () => {
    const baseUrl = Cypress.config('baseUrl');

    cy.request({
        method: 'POST',
        url: `${baseUrl}/Account/v1/Authorized`,
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: {
            userName: sessionStore.username,
            password: sessionStore.password
        }
    }).then((response) => {
        expect(response.status).to.eq(200);
        cy.log('Autorização bem-sucedida para o usuário: ' + sessionStore.username);
    });
});

Cypress.Commands.add('gerarToken', () => {
    const baseUrl = Cypress.config('baseUrl');

    cy.request({
        method: 'POST',
        url: `${baseUrl}/Account/v1/GenerateToken`,
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: {
            userName: sessionStore.username,
            password: sessionStore.password
        }
    }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('token');
        expect(response.body).to.have.property('expires');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('result');

        const token = response.body.token;
        sessionStore.token = token;
        cy.log(`Token gerado para o usuário '${sessionStore.username}': '${token}'`);
    });
});

Cypress.Commands.add('consultaConta', () => {
    const baseUrl = Cypress.config('baseUrl');

    cy.request({
        method: 'GET',
        url: `${baseUrl}/Account/v1/User/${sessionStore.userID}`,
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': `Bearer ${sessionStore.token}`
        }
    }).then((response) => {
        expect(response.status).to.eq(200);
        cy.log(`Consulta da conta do usuário '${sessionStore.username}' realizada com sucesso.`);
    });
});

Cypress.Commands.add('excluirConta', () => {
    const baseUrl = Cypress.config('baseUrl');
    const token = sessionStore.token || sessionStore.apiToken;
    const userId = sessionStore.userID;

    // 1. Obtém o retorno de usuarioExistePorId e armazena na variável exists
    cy.usuarioExistePorId(userId).then((exists) => {
        // 2. IF para verificar se o status code retornou 200
        if (exists.status === 200) {
            cy.excluirCadastroPorId(userId).then((response) => {
                expect(response.status).to.be.oneOf([200, 204]);
            });
        }
    });

    // 3. Depois do IF: requisição GET validando que o status NÃO seja 200
    cy.request({
        method: 'GET',
        url: `${baseUrl}/Account/v1/User/${userId}`,
        failOnStatusCode: false, // Impede que o Cypress interrompa o teste ao receber 401/404
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then((response) => {
        expect(response.status).to.not.eq(200);
        cy.log(`Cadastro com o userID '${userId}' foi excluído com sucesso`);
    });
});

Cypress.Commands.add('usuarioExistePorId', (userId) => {
    const baseUrl = Cypress.config('baseUrl');
    const token = sessionStore.token || sessionStore.apiToken;

    return cy.request({
        method: 'GET',
        url: `${baseUrl}/Account/v1/User/${userId}`,
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
});

Cypress.Commands.add('excluirCadastroPorId', (userId) => {
    const baseUrl = Cypress.config('baseUrl');
    const token = sessionStore.token || sessionStore.apiToken;

    return cy.request({
        method: 'POST',
        url: `${baseUrl}/Account/v1/User/${userId}`,
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
});