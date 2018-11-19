const { GoogleAuthClient } = require('./authClient.js')
const { google } = require('googleapis')
const { numericToA1 } = require('./tools.js')
const { SheetCollection } = require('../dataTypes/sheetCollection.js')

class SheetsClient extends GoogleAuthClient {
  constructor (scopes, oAuthCbConfig) {
    super(scopes, oAuthCbConfig)
    this._api = null
    this._sheetCollections = {}
    this._setSheetCollectionValues = this._setSheetCollectionValues.bind(this)
  }

  get sheetCollections () {
    return this._sheetCollections
  }

  authorize (credentialsPath) {
    return new Promise((resolve, reject) => {
      super.authorize(credentialsPath)
        .then(this._setApi.bind(this))
        .then(() => resolve(this))
        .catch(reject)
    })
  }

  getSheetValues (options) {
    return new Promise((resolve, reject) => {
      this._api.spreadsheets.values.get(options, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  populateSheetCollectionData (id) {
    return new Promise((resolve, reject) => {
      const promises = this.sheetCollections[id].sheets.map(sheet => {
        const { title, rowCount, columnCount } = sheet
        const maxCol = numericToA1(columnCount - 1)
        const range = `${title}!A1:${maxCol}${rowCount}`
        return this.getSheetValues({ spreadsheetId: id, range })
      })
      Promise.all(promises)
        .then(resArray => this._setSheetCollectionValues(resArray, id))
        .then(() => resolve(this))
        .catch(reject)
    })
  }

  getSheetCollection (options) {
    return new Promise((resolve, reject) => {
      this._api.spreadsheets.get(options, (err, res) => {
        if (err) {
          reject(err)
        } else {
          this._addSheetCollection(res)
          resolve(this)
        }
      })
    })
  }

  _setApi () {
    this._api = google.sheets({
      version: 'v4',
      auth: this._oAuth2Client
    })
  }

  _addSheetCollection (res) {
    const { spreadsheetId, properties, sheets } = res.data
    const { title } = properties
    const sheetCollection = new SheetCollection(spreadsheetId, title, sheets)
    this._sheetCollections[spreadsheetId] = sheetCollection
    return this.sheetCollections[spreadsheetId]
  }

  _setSheetCollectionValues (resArray, sheetCollectionId) {
    resArray.forEach(sheetData => {
      const { values, range } = sheetData.data
      const title = range.split('!')[0].replace(/\'/g, '')
      const sheet = this.sheetCollections[sheetCollectionId].sheets
        .find(sheet => sheet.title === title)
      sheet.cellData = values
    })
  }
}

module.exports = {
  SheetsClient
}
