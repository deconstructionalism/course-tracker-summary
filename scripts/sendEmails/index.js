const { GmailClient } = require('../../lib/gapi/gmailClient.js')
const { scopes, oAuthCbConfig } = require('../config.js')
const { readFileSync, writeFileSync } = require('fs')
const { resolve } = require('path')
const { checkFilesExist, getDateForFileName, paths } = require('../tools.js')

const {
  classDataFilePath,
  credentialsFilePath,
  tokenFilePath
} = paths

async function sendEmails () {
  process.assert(process.argv.length === 3, 'must pass single template name argument (the name of a template in the "./data/emailTemplates" folder without the ".js" extension)!')
  const templateName = process.argv[2]
  const emailTemplateFilePath = `./data/emailTemplates/${templateName}.js`

  checkFilesExist([classDataFilePath, credentialsFilePath, tokenFilePath, emailTemplateFilePath])

  try {
    const client = new GmailClient(scopes, oAuthCbConfig)
    await client.authorize(credentialsFilePath, tokenFilePath)
    await constructAndSend(client, emailTemplateFilePath)
  } catch (err) {
    console.error(err)
  }
}

const writeMailLogs = mailQueue => {
  const logs = mailQueue.queue.map(mail => ({
    mailConfig: mail.mailConfig,
    status: mail.status,
    events: mail.events
  }))
  const logData = JSON.stringify(logs, null, 4)
  const mailLogOutFilePath = `./data/mailLogs/${getDateForFileName()}.json`
  writeFileSync(mailLogOutFilePath, logData)
}

const constructAndSend = function (client, emailTemplateFilePath) {
  const { cc, subject, text } = require(resolve(emailTemplateFilePath))
  const classData = JSON.parse(readFileSync(classDataFilePath))

  const { classRoom, roster } = classData

  Promise.all(roster.map(student => {
    return student.status !== 'enrolled'
      ? null
      : client.queueMail({
        to: student.email,
        cc,
        subject: subject.call({ classRoom, student }),
        text: text.call({ classRoom, student })
      }, true)
  }))
    .then(client.sendAllMail)
    .then(() => writeMailLogs(client.mailQueue))
}

sendEmails()
