const fs = require('fs')
const { StudentFeedback } = require('./studentFeedback/index.js')
const { createSheetsClient } = require('./sheetsApi/index.js')

const courseTrackerId = '1FtwouNfcAWYmU6Efq6MBN0CqYYLtoF_sd8RlnCYdxtQ'

const handleSheetData = (client, outfile) => {
  const { sheetCollections } = client
  const sheetCollection = sheetCollections['1FtwouNfcAWYmU6Efq6MBN0CqYYLtoF_sd8RlnCYdxtQ']
  const feedback = new StudentFeedback(sheetCollection)
  const classRoom = feedback.classRoom
  const roster = feedback.roster
  const allData = JSON.stringify({
    classRoom,
    roster
  }, null, 4)
  console.log(allData)
  if (outfile) {
    fs.writeFileSync(outfile, allData)
  }
}

const summarize = outfile => {
  createSheetsClient()
    .then(client => client.getSheetCollection({ spreadsheetId: courseTrackerId }))
    .then(client => client.populateSheetCollectionData(courseTrackerId))
    .then(client => handleSheetData(client, outfile))
    .catch(console.error)
}

module.exports = summarize
