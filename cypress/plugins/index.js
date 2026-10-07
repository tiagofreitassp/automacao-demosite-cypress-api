// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

import utils from '../support/utils'
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

module.exports = (on, config) => {
  // --------  Lê dados de um arquivo Excel e os torna disponíveis como variável de ambiente --------
  const excelPath = path.join(config.projectRoot, 'cypress', 'fixtures', 'cenarios_e_massas.xlsx');
  if (fs.existsSync(excelPath)) {
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    config.expose.excelRows = JSON.stringify(rows);
  }

  return config;
};