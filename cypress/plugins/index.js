// cypress/plugins/index.js
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

module.exports = (on, config) => {
  const excelPath = path.join(config.projectRoot, 'cypress', 'fixtures', 'cenarios_e_massas.xlsx');

  // Leitura inicial para carregar dados
  if (fs.existsSync(excelPath)) {
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    config.expose.excelRows = JSON.stringify(rows);
  }

  // Task para atualizar o Status e Erro na planilha
  on('task', {
    updateExcelStatus({ rowIndex, status, errorMsg, tab }) {
      if (!fs.existsSync(excelPath)) {
        throw new Error(`Planilha não encontrada em: ${excelPath}`);
      }

      const workbook = XLSX.readFile(excelPath);
      const sheetName = workbook.SheetNames[tab];
      const sheet = workbook.Sheets[sheetName];

      // Converte para matriz de linhas (AOA - Array of Arrays) preservando o cabeçalho
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

      const headerRow = data[0];
      
      // Localiza (ou cria) os índices das colunas STATUS e ERRO (case-insensitive)
      let statusColIdx = headerRow.findIndex(col => String(col).trim().toUpperCase() === 'STATUS');
      let errorColIdx = headerRow.findIndex(col => String(col).trim().toUpperCase() === 'ERRO');

      if (statusColIdx === -1) {
        statusColIdx = headerRow.length;
        headerRow.push('STATUS');
      }
      if (errorColIdx === -1) {
        errorColIdx = headerRow.length;
        headerRow.push('ERRO');
      }

      // rowIndex 0 corresponde à linha 1 de dados (linha 2 na planilha, logo após o cabeçalho)
      const targetRowIdx = rowIndex + 1;

      // Garante que a linha exista e tenha tamanho suficiente
      if (!data[targetRowIdx]) {
        data[targetRowIdx] = [];
      }

      data[targetRowIdx][statusColIdx] = status;
      data[targetRowIdx][errorColIdx] = errorMsg || '';

      // Regrava a planilha com os dados atualizados
      const updatedSheet = XLSX.utils.aoa_to_sheet(data);
      workbook.Sheets[sheetName] = updatedSheet;
      XLSX.writeFile(workbook, excelPath);

      return null; // tasks do Cypress devem retornar um valor ou null
    }
  });

  return config;
};