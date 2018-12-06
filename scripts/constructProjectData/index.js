const { ProjectCompletion } = require('../../bin/projectCompletionSummary.js')
const { checkFilesExist } = require('../tools.js')
const { writeFileSync } = require('fs')
const { paths } = require('../config.js')

const { classDataFilePath } = paths

const constructProjectData = () => {
  process.assert(process.argv.length === 3, 'must pass single directory path to project-eval-server" argument!')
  const projectsDirPath = process.argv[2]

  checkFilesExist([classDataFilePath, projectsDirPath])

  const projectCompletionData = new ProjectCompletion(projectsDirPath, classDataFilePath)
  const { classRoom, roster } = projectCompletionData
  const allData = JSON.stringify({ classRoom, roster }, null, 4)
  writeFileSync(classDataFilePath, allData)
}

constructProjectData()
