const { existsSync, readFileSync } = require('fs')
const { join } = require('path')
const { getInnerDirs, filterFilesByExtension, camelize } = require('./tools.js')

class ProjectCompletion {
  constructor (projectsDirPath, classDataFilePath) {
    this._projectsDirPath = projectsDirPath
    this._classDataFilePath = classDataFilePath
    this._projectsFiles = {}
    this._classData = {}
    this._loadCourseTrackerData()
    this._getProjectFiles()
    this._summarizeProjectData()
  }

  get roster () {
    return this._classData.roster
  }

  get classRoom () {
    return this._classData.classRoom
  }

  getStudent (name) {
    name = name.toLowerCase()
    const studentIndex = this._classData.roster.findIndex(dev => {
      const fullName = `${dev.firstName} ${dev.lastName}`.toLowerCase()
      return fullName.includes(name)
    })
    const student = this._classData.roster[studentIndex]
    return [student, studentIndex]
  }

  _loadCourseTrackerData (classDataFilePath) {
    this._classData = JSON.parse(readFileSync(this._classDataFilePath))
  }

  _getProjectFiles () {
    process.assert(existsSync(this._projectsDirPath),
      `project folder does not exist at "${this._projectsDirPath}"`)
    const projects = getInnerDirs(this._projectsDirPath)
    projects.forEach(projectName => {
      const camelProjectName = camelize(projectName)
      this._projectsFiles[camelProjectName] = {}
      const projectDir = join(this._projectsDirPath, projectName)
      const jsonOutBoxDir = join(projectDir, 'json-outbox')
      process.assert(existsSync(jsonOutBoxDir),
        `No "json-outbox" folder found within "${projectDir}"`)
      const studentFiles = filterFilesByExtension(jsonOutBoxDir, [/.*\.json$/])
      studentFiles.map(fileName => {
        const studentName = fileName.replace('.json', '').replace('-', ' ')
        const [_, studentIndex] = this.getStudent(studentName)
        this._projectsFiles[camelProjectName][studentIndex] = join(this._projectsDirPath, projectName, 'json-outbox', fileName)
      })
    })
  }

  _summarizeProjectData () {
    const projects = Object.keys(this._projectsFiles)
    const { roster } = this._classData
    for (const studentIndex in roster) {
      const summary = {}
      const projectNames = []
      for (const projectName of projects) {
        const projectFiles = this._projectsFiles[projectName]
        const studentProjectFilePath = projectFiles[studentIndex]
        if (!studentProjectFilePath) continue
        const data = JSON.parse(readFileSync(studentProjectFilePath))
        const { requirements } = data

        const projectSummary = Object.entries(requirements).reduce((reqAcc, [reqCat, reqData]) => {
          const catSummary = Object.entries(reqData).reduce((reqCatAcc, [_, req]) => {
            reqCatAcc.count++ && reqAcc.count++
            req.fulfilled ? (reqCatAcc.fulfilled++ && reqAcc.fulfilled++) : reqCatAcc.dnm.push(req.spec)
            return reqCatAcc
          }, { count: 0, fulfilled: 0, dnm: [] })
          reqAcc.category[camelize(reqCat)] = {
            percentageComplete: catSummary.fulfilled / catSummary.count,
            dnm: catSummary.dnm
          }
          return reqAcc
        }, { count: 0, fulfilled: 0, category: {} })

        projectSummary.percentageComplete = projectSummary.fulfilled / projectSummary.count
        delete projectSummary.count
        delete projectSummary.fulfilled

        summary[camelize(projectName)] = projectSummary
        projectNames.push(camelize(projectName))
      }
      this._classData.roster[studentIndex].projects = summary
      this._classData.classRoom.projects = { graded: projectNames }
    }
  }
}

module.exports = {
  ProjectCompletion
}
