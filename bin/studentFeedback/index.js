const { CSVData } = require('../../lib/dataTypes/CSVData.js')

class StudentFeedback {
  constructor (sheetCollection) {
    this._sheetCollection = sheetCollection
    this._roster = []
    this._classRoom = {
      students: {},
      diagnostics: {},
      studiesAndPractices: {}
    }
    this._csvs = {}
    this._constructRoster()
    this._constructDiagnostics()
    this._constructPracticesStudies()
    this._constructAttendance()
  }

  get roster () {
    return this._roster
  }

  get classRoom () {
    return this._classRoom
  }

  getStudent (name) {
    name = name.toLowerCase()
    const studentIndex = this._roster.findIndex(dev => {
      const fullName = `${dev.firstName} ${dev.lastName}`.toLowerCase()
      return fullName.includes(name)
    })
    const student = this._roster[studentIndex]
    return [student, studentIndex]
  }

  _camelize (str) {
    // https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case/2970667#2970667
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
      return index === 0 ? letter.toLowerCase() : letter.toUpperCase()
    }).replace(/\s+/g, '')
  }

  _populateAssignedUnassigned (csv, assignmentType, colRange) {
    assignmentType = this._camelize(assignmentType)
    const filterUnassigned = col => col.values.join('') === ''
    const filterAssigned = col => col.values.join('') !== ''
    const getNames = result => result.map(col => col.name)
    const unassigned = csv.getColumns(...colRange).filter(filterUnassigned)
    const assigned = csv.getColumns(...colRange).filter(filterAssigned)
    this.classRoom[assignmentType] = {
      assigned: getNames(assigned),
      unassigned: getNames(unassigned)
    }
  }

  _populateMissingAssignments (csv, assignmentType, missingFunc = val => val === '') {
    assignmentType = this._camelize(assignmentType)
    const { assigned } = this._classRoom[assignmentType]
    csv.getRows().forEach(row => {
      const missing = assigned.filter(name => missingFunc(row[name]))
      const fullName = `${row.firstName} ${row.lastName}`
      const [_, studentIndex] = this.getStudent(fullName)
      const student = this._roster[studentIndex]
      student[assignmentType] = { missing }
    })
  }

  _populateAttendance (csv) {
    const dateHeaders = csv.headers.slice(7)
    csv.getRows().map(row => {
      const attendance = dateHeaders.reduce((acc, header) => {
        switch (row[header]) {
          case 'L':
            acc.late.push(header)
            break
          case 'A':
            acc.absent.push(header)
            break
          case 'EA':
            acc.excusedAbsent.push(header)
            break
          case 'EL':
            acc.excusedLate.push(header)
            break
          case 'LC':
            acc.lateOrLeftEarlyExcused.push(header)
            break
        }
        return acc
      }, {
        late: [],
        absent: [],
        excusedAbsent: [],
        excusedLate: [],
        lateOrLeftEarlyExcused: []
      })
      const fullName = `${row.firstName} ${row.lastName}`
      const [_, studentIndex] = this.getStudent(fullName)
      const student = this._roster[studentIndex]
      student.attendance = { ...attendance }
    })
  }

  _addCSV (title, headerRow, rowRange, colRange, headerNames = {}) {
    const sheet = this._sheetCollection.getSheetByTitle(title)
    const { cellData } = sheet

    const csv = new CSVData(cellData, headerRow, rowRange, colRange)
    csv.setHeaders(headerNames)
    csv.dropEmpty()

    this._csvs[title] = csv
    return this._csvs[title]
  }

  _constructRoster () {
    const title = 'Course Roster and Progress'
    const headerRow = 6
    const rowRange = [7]
    const columnRange = [0, 7]
    const headerNames = {
      0: 'studentId',
      1: 'firstName',
      2: 'lastName',
      3: 'github',
      4: 'ghe',
      5: 'email',
      6: 'status'
    }
    const csv = this._addCSV(title, headerRow, rowRange, columnRange, headerNames)
    this._roster = csv.getRows()
    this._classRoom.students.enrolled = csv.getRows().filter(row => row.status === 'enrolled').length
    this._classRoom.students.total = csv.shape[0]
  }

  _constructDiagnostics () {
    const title = 'Diagnostics'
    const headerRow = 2
    const rowRange = [7]
    const columnRange = [0]
    const headerNames = {
      0: 'firstName',
      1: 'lastName',
      2: 'github',
      3: 'mean'
    }
    const csv = this._addCSV(title, headerRow, rowRange, columnRange, headerNames)
    this._populateAssignedUnassigned(csv, title, [4])
    this._populateMissingAssignments(csv, title)
  }

  _constructPracticesStudies () {
    const title = 'Practice & Study'
    const headerRow = 2
    const rowRange = [7]
    const columnRange = [0]
    const headerNames = {
      0: 'firstName',
      1: 'lastName',
      2: 'github',
      3: 'mean'
    }
    const csv = this._addCSV(title, headerRow, rowRange, columnRange, headerNames)
    this._populateAssignedUnassigned(csv, title, [4])
    this._populateMissingAssignments(csv, title, val => ['', '0.0'].includes(val))
  }

  _constructAttendance () {
    const title = 'Attendance'
    const headerRow = 8
    const rowRange = [10, 46]
    const columnRange = [1]
    const headerNames = {
      0: 'firstName',
      1: 'lastName',
      2: 'email',
      3: 'absences',
      4: 'excused',
      5: 'late',
      6: 'percentAttendance'
    }
    const csv = this._addCSV(title, headerRow, rowRange, columnRange, headerNames)
    csv.dropEmpty(1)
    this._populateAttendance(csv)
  }
}

module.exports = {
  StudentFeedback
}
