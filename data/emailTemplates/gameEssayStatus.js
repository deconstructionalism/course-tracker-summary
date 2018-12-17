
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
        },
        "projects": {
            "graded": "[String Array]"
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
            },
            "projects": {
                "fullStack": {
                    "category": {
                        "deployment": {
                            "percentageComplete": "[Number]",
                            "dnm": "[]"
                        },
                        "versionControl": {
                            "percentageComplete": "[Number]",
                            "dnm": "[String Array]"
                        },
                        "documentation": {
                            "percentageComplete": "[Number]",
                            "dnm": "[String Array]"
                        },
                        "authSpecifications": {
                            "percentageComplete": "[Number]",
                            "dnm": "[String Array]"
                        },
                        "clientSpecifications": {
                            "percentageComplete": "[Number]",
                            "dnm": "[String Array]"
                        },
                        "aPISpecifications": {
                            "percentageComplete": "[Number]",
                            "dnm": "[String Array]"
                        },
                        "doNot": {
                            "percentageComplete": "[Number]",
                            "dnm": "[String Array]"
                        }
                    },
                    "percentageComplete": "[Number]"
                },
                "game": {
                    "category": {
                        "deployment": {
                            "percentageComplete": "[Number]",
                            "dnm": "[String Array]"
                        },
                        "versionControl": {
                            "percentageComplete": "[Number]",
                            "dnm": "[String Array]"
                        },
                        "documentation": {
                            "percentageComplete": "[Number]",
                            "dnm": "[String Array]"
                        },
                        "technicalSpecifications": {
                            "percentageComplete": "[Number]",
                            "dnm": "[String Array]"
                        },
                        "aPISpecifications": {
                            "percentageComplete": "[Number]",
                            "dnm": "[String Array]"
                        },
                        "authSpecifications": {
                            "percentageComplete": "[Number]",
                            "dnm": "[String Array]"
                        },
                        "doNot": {
                            "percentageComplete": "[Number]",
                            "dnm": "[String Array]"
                        }
                    },
                    "percentageComplete": "[Number]"
                }
            }
        }
    ]
}
*/

const turnedInMessage =
`Thank you for sending in a Project 1 essay to make up for you Project 1 Resubmission not meeting requirements. As of now, you are in good standing with respect to Project 1.
`

const didNotTurnInMessage = function () {
  return `Since you did not meet requirements for your Project 1 Resubmission you were assigned
an essay. We did not receive your essay.

**You must complete this essay to remain in good standing in WDI**. Please plan to complete
and submit this essay over winter break.

We **do not** want you working on the essay during Project week and will not accept your
submission until the team project presentations are over.

Feel free to reach out to us for any clarifications with regard to the essay criteria below.

### Project 1 Essay: Write an essay on ${this.student.prompt}

- see the original email for details on the essay

**Due by 1/1/2019 (Tuesday) at 11:59 PM**
`
}

const essayStudents = [
  {
    firstName: 'Eric',
    prompt: 'Interacting with the API',
    received: false
  },
  {
    firstName: 'Tyler',
    prompt: 'Designing the Game Logic',
    received: false
  },
  {
    firstName: 'Xia',
    prompt: 'Designing the Game Logic',
    received: false
  },
  {
    firstName: 'Antonio',
    prompt: 'Interacting with the API',
    received: false
  },
  {
    firstName: 'Gregory',
    prompt: 'Interacting with the API',
    received: false
  },
  {
    firstName: 'Susan',
    prompt: 'Designing the Game Logic',
    received: false
  },
  {
    firstName: 'Elsie',
    prompt: 'Interacting with the API',
    received: false
  },
  {
    firstName: 'Anibal',
    prompt: 'Interacting with the API',
    received: false
  },
  {
    firstName: 'Alfredo',
    prompt: 'Designing the Game Logic',
    received: false
  },
  {
    firstName: 'Danielle',
    prompt: 'Designing the Game Logic',
    received: false
  },
  {
    firstName: 'Kleide',
    prompt: 'Interacting with the API',
    received: false
  },
  {
    firstName: 'Ian',
    prompt: 'Interacting with the API',
    received: false
  },
  {
    firstName: 'Seyi',
    prompt: 'Designing the Game Logic',
    received: false
  },
  {
    firstName: 'Michael',
    lastName: 'Siegel',
    prompt: 'Designing the Game Logic',
    received: false
  },
  {
    firstName: 'Joel',
    prompt: 'Interacting with the API',
    received: true
  },
  {
    firstName: 'Polina',
    prompt: 'Interacting with the API',
    received: false
  }
]

const options = {
  filterStudents: student => selectStudent(student)
}

const selectStudent = student => {
  const essayStudent = essayStudents.filter(essayStudent => {
    return essayStudent.lastName
      ? essayStudent.firstName === student.firstName && essayStudent.lastName === student.lastName
      : essayStudent.firstName === student.firstName
  })
  return essayStudent.length === 1 ? essayStudent[0] : false
}

const cc = [
  'elizabeth.brigham@generalassemb.ly',
  'alexander.chiclana@generalassemb.ly',
  'christopher.kennelly@generalassemb.ly',
  'danny.kirschner@generalassemb.ly'
]

const subject = function () {
  const student = selectStudent(this.student)
  return `WDI PVD-04: Project 1 Essay ${student.received
    ? 'Received'
    : 'Not Received'} (${this.student.firstName} ${this.student.lastName})`
}

const text = function () {
  const student = selectStudent(this.student)
  return `
Hello ${this.student.firstName},

${student.received
    ? turnedInMessage
    : didNotTurnInMessage.call({student})}

Best,

_WDI PVD-04 Instructional Team_
`
}

module.exports = {
  cc,
  subject,
  text,
  options
}
