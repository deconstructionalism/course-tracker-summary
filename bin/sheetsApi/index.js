const path = require('path')
const { SheetsClient } = require('../../lib/gapi/sheetsClient.js')
const { scopes, oAuthCbConfig } = require('../config.js')

const createSheetsClient = () => {
  const sheets = new SheetsClient(scopes, oAuthCbConfig)
  return sheets.authorize(path.resolve('./credentials.json'))
}

// fix this
const getSpreadSheet = (client, spreadsheetId) => {
  return new Promise((resolve, reject) => {
    client.getSheetCollection({ spreadsheetId })
      .then(client => client.populateSheetCollectionData(spreadsheetId))
      .then(resolve(client))
      .catch(err => reject(err))
  })
}

module.exports = {
  createSheetsClient,
  getSpreadSheet
}
