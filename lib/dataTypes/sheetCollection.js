
class SheetCollection {
  constructor (spreadsheetId, title, sheetsData) {
    this._spreadsheetId = spreadsheetId
    this._title = title
    this._sheets = null
    this._buildSheets(sheetsData)
  }

  get title () {
    return this._title
  }

  get spreadsheetId () {
    return this._spreadsheetId
  }

  get sheets () {
    return this._sheets
  }

  get sheetNames () {
    return this._sheets.map(sheet => sheet.title)
  }

  getSheetByTitle (title) {
    return this._sheets.find(sheet => sheet.title === title)
  }

  _buildSheets (sheetsData) {
    this._sheets = sheetsData.map(data => {
      const { sheetId, title, gridProperties } = data.properties
      const { rowCount, columnCount } = gridProperties
      return new Sheet(sheetId, title, rowCount, columnCount)
    })
  }
}

class Sheet {
  constructor (sheetId, title, rowCount, columnCount) {
    this._sheetId = sheetId
    this._rowCount = rowCount
    this._columnCount = columnCount
    this._title = title
    this._cellData = null
  }

  get sheetId () {
    return this._sheetId
  }

  get rowCount () {
    return this._rowCount
  }

  get columnCount () {
    return this._columnCount
  }

  get title () {
    return this._title
  }

  get cellData () {
    return this._cellData
  }

  set cellData (data) {
    this._cellData = data
  }
}

module.exports = {
  SheetCollection
}
