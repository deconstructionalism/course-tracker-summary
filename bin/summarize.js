const path = require('path')
const fs = require('fs')
const { SheetsClient } = require('../lib/gapi/sheetsClient.js')
const { scopes, oAuthCbConfig } = require('../bin/config.js')
const { StudentFeedback } = require('../lib/studentFeedback.js')

const summarize = (outfile) => {

  const prettyData = dataObj => JSON.stringify(dataObj, null, 4)

  const handleSheetData = sheetCollection => {
    const feedback = new StudentFeedback(sheetCollection)
    const classRoom = feedback.classRoom
    const roster = feedback.roster
    const allData = prettyData({
      classRoom,
      roster
    })
    console.log(allData)
    if (outfile) {
      fs.writeFileSync(outfile, allData)
    }
  }

  const spreadsheetId = '1FtwouNfcAWYmU6Efq6MBN0CqYYLtoF_sd8RlnCYdxtQ'

  const sheets = new SheetsClient(scopes, oAuthCbConfig)

  sheets.authorize(path.resolve('./credentials.json'))
    .then(() => sheets.getSheetCollection({ spreadsheetId }))
    .then(() => sheets.populateSheetCollectionData(spreadsheetId))
    .then(handleSheetData)
    .catch(console.err)
}

module.exports = summarize
