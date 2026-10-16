/// <reference types="cypress" />

import '../support/commandsAccount'

const rows = Cypress.expose('excelRows') ? JSON.parse(Cypress.expose('excelRows')) : [];

describe('Cenário 1 - Adicionar livro', () => {
  let currentRowIndex = null;

  if (!rows.length) {
    it('Nenhuma linha encontrada na planilha', () => {
      cy.log('Sem dados no arquivo XLSX para executar os testes!');
    });
    return;
  }

  // Executa após CADA teste para registrar o resultado
  afterEach(function () {
    if (currentRowIndex === null) return;

    const testState = this.currentTest.state; // 'passed' ou 'failed'
    const status = testState === 'passed' ? 'Passed' : 'Failed';

    //Exclui o cadastro independente do resultado do teste
    cy.excluirConta();

    // Captura mensagem de erro do Cypress/Mocha se houver falha
    const errorMsg = testState === 'failed' && this.currentTest.err
      ? this.currentTest.err.message
      : '';

    cy.task('updateExcelStatus', {
      rowIndex: currentRowIndex,
      status: status,
      errorMsg: errorMsg,
      tab: 0
    });
  });

  rows.forEach((row, idx) => {
    let executar = (row.EXECUTE || '').toUpperCase();

    if (executar === 'SIM') {
      it(row.CENARIO + ` ${idx + 1}`, () => {
        currentRowIndex = idx; // Guarda o índice da linha da planilha atual

        const massas = {
          isbn: row.ISBN,
          title: row.TITLE,
          subtitle: row.SUBTITLE,
          author: row.AUTHOR,
          publisher: row.PUBLISHER,
          pages: row.PAGES,
          description: row.DESCRIPTION,
          website: row.WEBSITE
        };

        //Realizar cadastro e autenticação do usuário
        cy.account(row.USERNAME, row.PASSWORD);

        //Adicionar o livro à coleção do usuário
        //Consultar se livro esta na coleção
        //Excluir livro da coleção do usuário

        // Se alguma asserção ou cy.request() falhar, o Cypress interrompe o it()
        // e o afterEach() captura automaticamente o estado 'failed' e o erro.
      });
    }
  });
});