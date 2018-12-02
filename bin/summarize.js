const fs = require('fs')
const { StudentFeedback } = require('./studentFeedback/index.js')
const { createSheetsClient } = require('./sheetsApi/index.js')

const courseTrackerId = '1FtwouNfcAWYmU6Efq6MBN0CqYYLtoF_sd8RlnCYdxtQ'

const handleSheetData = (client, outFile) => {
  const { sheetCollections } = client
  const sheetCollection = sheetCollections[courseTrackerId]
  const feedback = new StudentFeedback(sheetCollection)
  const classRoom = feedback.classRoom
  const roster = feedback.roster
  const allData = JSON.stringify({
    classRoom,
    roster
  }, null, 4)
  console.log(allData)
  if (outFile) {
    fs.writeFileSync(outFile, allData)
  }
}

async function summarize (outFile) {
  try {
    const client = await createSheetsClient()
    await client.getSheetCollection({ spreadsheetId: courseTrackerId })
    await client.populateSheetCollectionData(courseTrackerId)
    await handleSheetData(client, outFile)
  } catch (err) {
    console.error(err)
  }
}

module.exports = summarize
