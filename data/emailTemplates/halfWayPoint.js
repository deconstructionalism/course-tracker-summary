
/*
| DATA DESCRIPTION |
> NOTE: some student fields may be empty in the example below, use your best
> judgment to determine their type, or look at the JSON data file

{
    "classRoom": {
        "students": {
            "enrolled": "[Number]",
            "total": "[Number]"
        },
        "diagnostics": {
            "assigned": "[String Array]",
            "unassigned": "[String Array]"
        },
        "practice&Study": {
            "assigned": "[String Array]",
            "unassigned": "[String Array]"
        }
    },
    "student": [
        {
            "studentId": "[String]",
            "firstName": "[String]",
            "lastName": "[String]",
            "github": "[String]",
            "ghe": "[String]",
            "email": "[String]",
            "status": "[String]",
            "diagnostics": {
                "missing": "[String Array]"
            },
            "practice&Study": {
                "missing": "[String Array]"
            },
            "attendance": {
                "late": "[String Array]",
                "absent": "[]",
                "excusedAbsent": "[String Array]",
                "excusedLate": "[]",
                "lateOrLeftEarlyExcused": "[]"
            }
        }
    ]
}
*/

const project1Dnm = [
  'Alfredo Maldonado III',
  'Danielle Marhefka',
  'Richard Aybar',
  'Kleide Bien-Aime',
  'Ian Gibson',
  'Seyi Solanke',
  'Michael Siegel',
  'Joel Thibodeau',
  'Polina Volfovich',
  'Eric Grieshaber',
  'Tyler Havriliak',
  'Xia Josiah-Faeduwor',
  'Antonio Keo',
  'Gregory Ryan',
  'Susan Fakunle',
  'Elsie Fernandez',
  'Anibal Figueroa'
]

const essayString = `
### Project 1 Essay\nSince your game project resubmission did not meet requirements, you must submit an essay as specified in a previous email in order to be on track to complete the course.
`

const options = {
  filterStudents: student => student.status === 'enrolled'
}

const cc = [
  'danny.kirschner@generalassemb.ly',
  'elizabeth.brigham@generalassemb.ly',
  'alexander.chiclana@generalassemb.ly',
  'christopher.kennelly@generalassemb.ly']

const subject = function () {
  return `WDI PVD-04 Progress Report | ${this.student.firstName} ${this.student.lastName}`
}

const text = function () {
  return `
Hello ${this.student.firstName},

We have reached the halfway point of this course. We want to provide you with some
updates about your progress thus far. Congratulations on making it halfway through
the WDI course! It's a lot of work and new concepts, so it's no small achievement.

## Attendance

- Lates: ${this.student.attendance.late.length}
- Absences: ${this.student.attendance.absent.length}

## Missing Work

### Diagnostics

${this.student.diagnostics.missing.map(diag => `- [${diag}](http://git.generalassemb.ly/ga-wdi-boston/${diag})`).join('\n')}

### Practices and Studies

${this.student['practice&Study'].missing.map(prac => `- [${prac}](http://git.generalassemb.ly/ga-wdi-boston/${prac})`).join('\n')}

${project1Dnm.includes(`${this.student.firstName} ${this.student.lastName}`)
    ? essayString
    : ''
}

Best,

_WDI PVD-04 Instructional Staff_
`
}

module.exports = {
  cc,
  subject,
  text,
  options
}
