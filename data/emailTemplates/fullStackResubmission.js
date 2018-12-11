
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

const passedMessage =
`Congratulations, you've successfully completed your Full Stack Project! You are one step closer to completing WDI!`

const didNotMeetMessage =
`We have determined that you have **not** successfully completed Project 2 for WDI based on your resubmission. We understand that you have worked very hard on this project, and we want to congratulate you on the progress you have made. However, we require you to do an additional assignment to keep you on track to complete the program.

### Write an essay on how to create an API using Ruby on Rails

#### Criteria

- Include planning through execution steps
- Explain why a modern web developer would create an API
- Include code examples and diagrams where appropriate
- Essay must be 500+ words
- Reply to this email to submit

**Due 12/13/2018 (Thursday) at 11:59 PM**

----
`
const completionThreshold = (context, threshold) => {
  const { fullStack } = context.student.projects
  const { percentageComplete } = fullStack
  return percentageComplete >= threshold
}

const dnmSpecMd = context => {
  const { category } = context.student.projects.fullStack
  const categoryMd = Object.entries(category).map(([categoryName, keys]) => {
    const { dnm } = keys
    if (dnm.length === 0) return ''
    let md = `#### ${categoryName}\n\n`
    dnm.forEach(spec => { md += `- ${spec}\n` })
    return md
  })
  return categoryMd.filter(text => text.length > 0).join('\n')
}

const options = {
  filterStudents: student => student.status === 'enrolled' && !['Polina', 'Dominic'].includes(student.firstName)
}

const cc = [
  'elizabeth.brigham@generalassemb.ly',
  'alexander.chiclana@generalassemb.ly',
  'christopher.kennelly@generalassemb.ly',
  'danny.kirschner@generalassemb.ly'
]

const subject = function () {
  const passed = completionThreshold(this, 0.8)

  return `WDI PVD-04: Project 2 ${passed ? 'Successfully' : 'Not Successfully'} Completed (${this.student.firstName} ${this.student.lastName})`
}

const text = function () {
  const passed = completionThreshold(this, 0.8)
  const perfect = completionThreshold(this, 1.0)

  return `
Hello ${this.student.firstName},

${passed
    ? passedMessage
    : didNotMeetMessage}

${!perfect
    ? `### ${passed ? 'Please Fix for Your Portfolio' : 'Requirements Not Met'}\n\n${dnmSpecMd(this)}`
    : ''}
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
