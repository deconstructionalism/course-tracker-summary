const { readFileSync, writeFileSync } = require('fs')
const { checkFilesExist, generateObjectDescription } = require('../tools.js')

const classDataFilePath = './data/classData.json'
const credentialsFilePath = './credentials.json'
const tokenFilePath = './token.json'

const generateEmailTemplate = () => {
  process.assert(process.argv.length === 3, 'must pass single template name argument!')
  const templateName = process.argv[2]

  checkFilesExist([classDataFilePath, credentialsFilePath, tokenFilePath])

  const classData = JSON.parse(readFileSync(classDataFilePath))
  const dataDescription = generateObjectDescription(classData, {'roster': 'student'}, ['student'])
  writeTemplate(dataDescription, templateName)
}

const writeTemplate = (dataDescription, templateName) => {
  const contents = `
/*
| DATA DESCRIPTION |
> NOTE: some student fields may be empty in the example below, use your best
> judgment to determine their type, or look at the JSON data file

${dataDescription}
*/

const cc = [
  'cc_person@host.com',
  'cc_person_two@host.com'
]

const subject = function () {
  return \`Email Subject\`
}

const text = function () {
  return \`
Hello Person,

# USING MARKDOWN

**You can use markdown in this template**

for code snippets, use an escape character such as:

\\\`\\\`\\\`bash
echo "hello world"
\\\`\\\`\\\`

# INTERPOLATING VALUES

You can interpolate values described in the DATA DESCRIPTION.

\\\`classRoom\\\` data can be used as follows:

> Number of students enrolled: \${this.classRoom.students.enrolled}

\\\`student\\\` data can also be accessed in each email as follows:

> Your name is: \${this.student.firstName} \${this.student.lastName}

You can interpolate values in the subject as well.

# DO NOT

- modify exports
- delete any variables or change their types

Best,

_Arjun_
_deconstructionalism@gmail.com_
\`
}

module.exports = {
  cc,
  subject,
  text
}
`
  const templateOutFilePath = `./data/emailTemplates/${templateName}.js`
  writeFileSync(templateOutFilePath, contents)
}

generateEmailTemplate()
