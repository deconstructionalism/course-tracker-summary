const { CSVData } = require('../../lib/dataTypes/CSVData.js')

class StudentFeedback {
  constructor (sheetCollection) {
    this._sheetCollection = sheetCollection
    this._roster = []
    this._classRoom = {
      students: {},
      diagnostics: {
        assigned: [],
        unassigned: []
      },
      studiesAndPractices: {
        assigned: [],
        unassigned: []
      }
    }
    this._csvs = {}
    this._constructRoster()
    this._checkDiagnostics()
    this._checkPracticesStudies()
  }

  get roster () {
    return this._roster
  }

  get classRoom () {
    return this._classRoom
  }

  getStudent (name) {
    name = name.toLowerCase()
    return this._roster.filter(dev => {
      const fullName = `${dev.firstName} ${dev.lastName}`.toLowerCase()
      return fullName.includes(name)
    })
  }

  _addCSV (title, headerRow, rowRange, colRange, headerNames = {}) {
    const sheet = this._sheetCollection.getSheetByTitle(title)
    const { cellData } = sheet

    const csv = new CSVData(cellData, headerRow, rowRange, colRange)
    csv.setHeaders(headerNames)
    this._csvs[title] = csv
  }

  _constructRoster () {
    const title = 'Course Roster and Progress'
    const headerNames = {
      0: 'studentId',
      1: 'firstName',
      2: 'lastName',
      3: 'github',
      4: 'ghe',
      5: 'email',
      6: 'status'
    }
    this._addCSV(title, 6, [7, 45], [0, 7], headerNames)
    const csv = this._csvs[title]

    for (let i = 0; i < csv.shape[0]; i++) {
      const row = csv.indexRows(i)
      const devData = {}
      row.forEach(col => {
        devData[col.columnName] = col.values[0]
      })
      this._roster.push(devData)
    }
    this._classRoom.students.enrolled = this._roster.filter(dev => dev.status === 'enrolled').length
    this._classRoom.students.total = this._roster.length
  }

  _checkDiagnostics () {
    const title = 'Diagnostics'
    const headerNames = {
      0: 'firstName',
      1: 'lastName',
      2: 'github',
      3: 'mean'
    }
    this._addCSV(title, 2, [7, 44], [0, 30], headerNames)
    const csv = this._csvs[title]

    for (let i = 4; i < csv.shape[1]; i++) {
      const col = csv.indexColumns(i)
      const joinedCol = col[0].values.join('')
      if (joinedCol.length > 0) {
        this._classRoom.diagnostics.assigned.push(col[0].columnName)
      } else {
        this._classRoom.diagnostics.unassigned.push(col[0].columnName)
      }
    }

    for (let i = 0; i < csv.shape[0]; i++) {
      const row = csv.indexRows(i)
      const diagnosticsData = {
        missing: []
      }
      row.forEach((col, index) => {
        if (index > 3) {
          const { columnName, values } = col
          if (this._classRoom.diagnostics.assigned.includes(columnName) && values[0] === '') {
            diagnosticsData.missing.push(columnName)
          }
        }
      })
      const dev = this._roster.find(dev => dev.firstName === row[0].values[0] && dev.lastName === row[1].values[0])
      dev.diagnostics = diagnosticsData
    }
  }

  _checkPracticesStudies () {
    const title = 'Practice & Study'
    const headerNames = {
      0: 'firstName',
      1: 'lastName',
      2: 'github',
      3: 'mean'
    }
    this._addCSV(title, 2, [7, 44], [0, 38], headerNames)
    const csv = this._csvs[title]

    for (let i = 4; i < csv.shape[1]; i++) {
      const col = csv.indexColumns(i)
      const joinedCol = col[0].values.join('')
      if (joinedCol.length > 0) {
        this._classRoom.studiesAndPractices.assigned.push(col[0].columnName)
      } else {
        this._classRoom.studiesAndPractices.unassigned.push(col[0].columnName)
      }
    }

    for (let i = 0; i < csv.shape[0]; i++) {
      const row = csv.indexRows(i)
      const studiesAndPracticesData = {
        missing: []
      }
      row.forEach((col, index) => {
        if (index > 3) {
          const { columnName, values } = col
          if (this._classRoom.studiesAndPractices.assigned.includes(columnName) && values[0] === '0.0') {
            studiesAndPracticesData.missing.push(columnName)
          }
        }
      })
      const dev = this._roster.find(dev => dev.firstName === row[0].values[0] && dev.lastName === row[1].values[0])
      dev.studiesAndPractices = studiesAndPracticesData
    }
  }
}

module.exports = {
  StudentFeedback
}
