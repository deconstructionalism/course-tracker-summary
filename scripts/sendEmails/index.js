const { GmailClient } = require('../../lib/gapi/gmailClient.js')
const { scopes, oAuthCbConfig } = require('../config.js')
const { readFileSync, writeFileSync } = require('fs')
const { resolve } = require('path')
const { checkFilesExist, getDateForFileName } = require('../tools.js')
const { paths } = require('../config.js')

const {
  classDataFilePath,
  credentialsFilePath,
  tokenFilePath
} = paths

async function sendEmails () {
  process.assert(process.argv.length < 5 && process.argv.length > 2,
    'must pass single template name argument (the name of a template in the "./data/emailTemplates" folder without the ".js" extension)! You can pass an optional "sendReal" argument for generating and sending emails, otherwise will only generate and log emails.')
  const templateName = process.argv[2]
  const emailTemplateFilePath = `./data/emailTemplates/${templateName}.js`
  const sendReal = process.argv[3] === 'sendReal' && true

  checkFilesExist([classDataFilePath, credentialsFilePath, tokenFilePath, emailTemplateFilePath])

  try {
    const client = new GmailClient(scopes, oAuthCbConfig)
    await client.authorize(credentialsFilePath, tokenFilePath)
    await constructAndSend(client, emailTemplateFilePath, sendReal)
  } catch (err) {
    console.error(err)
  }
}

const printEmailTemplate = function () {
  return `
SUBJECT: ${this.subject}
TO: ${this.to}
CC: ${this.cc}
TEXT: ${this.text}
________________________________________________________________________________
`
}

const writeMailLogs = (mailQueue, sendReal = false) => {
  const logs = mailQueue.queue.map(mail => {
    const { mailConfig, status, events } = mail
    if (!sendReal) console.log(printEmailTemplate.call(mailConfig))
    return { mailConfig, status, events }
  })
  const logData = JSON.stringify(logs, null, 4)
  const mailLogOutFilePath = `./data/mailLogs/${getDateForFileName()}.json`
  writeFileSync(mailLogOutFilePath, logData)
}

const constructAndSend = function (client, emailTemplateFilePath, sendReal) {
  const { cc, subject, text, options = {} } = require(resolve(emailTemplateFilePath))
  const classData = JSON.parse(readFileSync(classDataFilePath))

  const { classRoom, roster } = classData
  const { filterStudents } = options
  const students = roster.filter(filterStudents)

  Promise.all(students.map(student => {
    return client.queueMail({
      to: student.email,
      cc: cc,
      subject: subject.call({ classRoom, student }),
      text: text.call({ classRoom, student })
    }, true)
  }))
    .then(() => sendReal && client.sendAllMail())
    .then(() => writeMailLogs(client.mailQueue, sendReal))
}

sendEmails()
