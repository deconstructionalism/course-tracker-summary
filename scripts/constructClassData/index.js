const { SheetsClient } = require('../../lib/gapi/sheetsClient.js')
const { scopes, oAuthCbConfig } = require('../config.js')
const { CourseTracker } = require('../../bin/courseTrackerSummary.js')
const { writeFileSync } = require('fs')
const { checkFilesExist } = require('../tools.js')

const courseTrackerId = '1FtwouNfcAWYmU6Efq6MBN0CqYYLtoF_sd8RlnCYdxtQ'
const credentialsFilePath = './credentials.json'
const tokenFilePath = './token.json'
const classDataOutFilePath = './data/classData.json'

async function constructClassData () {
  checkFilesExist([credentialsFilePath, tokenFilePath])

  try {
    const client = new SheetsClient(scopes, oAuthCbConfig)
    await client.authorize(credentialsFilePath, tokenFilePath)
    await client.getSheetCollection({ spreadsheetId: courseTrackerId })
    await client.populateSheetCollectionData(courseTrackerId)
    await constructStudentData(client)
  } catch (err) {
    console.error(err)
  }
}

const constructStudentData = (client) => {
  const { sheetCollections } = client
  const courseTrackerSheet = sheetCollections[courseTrackerId]
  const courseTrackerData = new CourseTracker(courseTrackerSheet)
  const { classRoom, roster } = courseTrackerData
  const allData = JSON.stringify({ classRoom, roster }, null, 4)
  writeFileSync(classDataOutFilePath, allData)
}

constructClassData()
