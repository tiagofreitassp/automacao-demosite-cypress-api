## Automação - Demosite - Cypress - API

- Este projeto possui scripts de automações utilizando o Cypress no portal [Demosite](https://demoqa.com/).
- Fonte: [Github](https://github.com/tiagofreitassp/automacao-demosite-cypress-api)

---

## Requisitos

- Node.js
- NPM
- Visual Studio Code (recomendado)
- Cypress

---

## Antes de editar e executar

- Ao salvar o projeto localmente abra o CMD, Terminal ou o Terminal do Visual Studio Code e vá até o diretório e digite o comando **npm install** para baixar e instalar as dependências Node, sem isso, não será possível executar o projeto.
- Só precisa fazer este procedimento quando a pasta **node_modules** estiver ausente, lembre-se que não é recomendado esta pasta subir no GIT devido o tamanho do mesmo. Por isso nunca remova a linha **node_modules/** do arquivo gitignore.

---

## Cenários
- Os cenários de testes envolvem validar autenticação, gerar token, criar usuário, consultar livros, adicionar livros, editar livros e excluir livros.

---

## Ambiente

- Este projeto pode ser executado no Windows, MacOS e no Linux.

---

## Comandos de execuções

- **Abrir o cypress no Front-end:** npm run cypress:open
- **Executar o cypress no Back-end:** npm run cypress:run
- **Executar via linha de comando uma classe especifica:** npm run cypress:run --spec cypress/e2e/formuario.cy.js
- **Executar via linha de comando uma classe especifica com a janela do navegador aberta:** npm run cypress:run --spec cypress/e2e/formuario.cy.js --headed
- **Executar via linha de comando uma classe especifica com a janela do navegador aberta sem fecha-la no final da execução:** npm run cypress:run --spec cypress/e2e/formuario.cy.js --headed --no-exit

## Evidências

- As evidências e relatórios são salvos em cypress/report.

---

## Observações

## Links úteis

- [Documentação do Cypress](https://docs.cypress.io/app/get-started/why-cypress)
