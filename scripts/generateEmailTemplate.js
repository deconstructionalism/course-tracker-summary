const { existsSync, readFileSync, writeFileSync } = require('fs')

const dataFilePath = './data/classData.json'
const templateOutFilePath = './data/emailTemplate.js'

const replacer = (key, value) => {
  const showFirstOfArray = ['roster']

  const ArrayReplacer = arr => {
    if (arr.length === 0) return '[]'
    switch (arr[0].constructor) {
      case String:
        return '[String Array]'
      case Number:
        return '[Number Array]'
      case Boolean:
        return '[Boolean Array]'
      case Array:
        return arr
      case Object:
        return arr
    }
  }

  if (value === null) return value
  switch (value.constructor) {
    case String:
      return '[String]'
    case Number:
      return '[Number]'
    case Boolean:
      return '[Boolean]'
    case Array:
      if (showFirstOfArray.includes(key)) {
        return ArrayReplacer([value[0]])
      } else {
        return ArrayReplacer(value)
      }
    case Object:
      return value
  }
  return value
}

const writeTemplate = dataDescription => {
  const contents = `
/*
| DATA DESCRIPTION |
${dataDescription}
*/

const from = 'you@host.com'
const cc = ['cc_person@host.com', 'cc_person_two@host.com']
const bcc = ['bcc_person@host.com', 'bcc_person_two@host.com']
const subject = 'Email Subject'
const body = \`
Hello Person,

**You can use markdown in this template**

for code snippets, use an escape character such as:
\\\`bash
echo "hello world"
\\\`

You can interpolate values described in the DATA DESCRIPTION.

\\\`classRoom\\\` data can be used as follows:
Number of students enrolled: \${classRoom.students.enrolled}

student data (described in \\\`roster\\\`) can be accessed in each email via
a \\\`student\\\` object as follows:

Your name is: \${student.firstName} \${student.lastName}

Best,

Me
\`

module.exports = {
  from,
  cc,
  bcc,
  subject,
  body
}
`
  writeFileSync(templateOutFilePath, contents)
}

if (existsSync(dataFilePath)) {
  const data = JSON.parse(readFileSync(dataFilePath))
  const dataDescription = JSON.stringify(data, replacer, 4)
  writeTemplate(dataDescription)
} else {
  console.error(`No data file at "${dataFilePath}!`)
}
