const path = require('path')
const { SheetsClient } = require('../../lib/gapi/sheetsClient.js')
const { scopes, oAuthCbConfig } = require('../config.js')

const createSheetsClient = () => {
  const sheets = new SheetsClient(scopes, oAuthCbConfig)
  return sheets.authorize(path.resolve('./credentials.json'))
}

module.exports = {
  createSheetsClient
}
