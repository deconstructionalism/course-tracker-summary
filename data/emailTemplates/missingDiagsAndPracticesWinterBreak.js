
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
                "absent": "[String Array]",
                "excusedAbsent": "[String Array]",
                "excusedLate": "[]",
                "lateOrLeftEarlyExcused": "[]"
            }
        }
    ]
}
*/

const options = {
  filterStudents: student => {
    return student.status === 'enrolled' && 
           !(student.diagnostics.missing.length === 0 && student['practice&Study'].missing.length === 0)
  }
}

const cc = [
  'danny.kirschner@generalassemb.ly',
  'elizabeth.brigham@generalassemb.ly',
  'alexander.chiclana@generalassemb.ly',
  'christopher.kennelly@generalassemb.ly']

const subject = function () {
  return `WDI PVD-04 Missing Diagnostics and Practices | ${this.student.firstName} ${this.student.lastName}`
}

const text = function () {
  return `
Hello ${this.student.firstName},

We hope you are having a great holiday break and are staying warm and enjoying your time off. We wanted to give you up-to-date information (as of Dec 29th) on your missing practices, studies, and diagnostics. Take a little time during your break to get these submitted to so that you can ensure that you will be in good standing within the program by the time we finish. 

## Missing Work
${this.student.diagnostics.missing.length > 0 
  ? 
`
### Diagnostics

${this.student.diagnostics.missing.map(diag => `- [${diag}](http://git.generalassemb.ly/ga-wdi-boston/${diag})`).join('\n')}`
 : ''}
${this.student['practice&Study'].missing.length > 0
  ?
`
### Practices and Studies

${this.student['practice&Study'].missing.map(prac => `- [${prac}](http://git.generalassemb.ly/ga-wdi-boston/${prac})`).join('\n')}`
  : ''}

>NOTE: Please ensure that you have a way to track your own assignments that you are completing as we will not always be able to provide an up to date list when you may need it.

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
