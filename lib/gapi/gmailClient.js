const { GoogleAuthClient } = require('./authClient.js')
const { google } = require('googleapis')
const { Mail, MailQueue, MAIL_EVENTS } = require('../dataTypes/mail.js')

class GmailClient extends GoogleAuthClient {
  constructor (scopes, oAuthCbConfig) {
    super(scopes, oAuthCbConfig)
    this._mailQueue = new MailQueue()
    this.sendAllMail = this.sendAllMail.bind(this)
    this._api = null
  }

  get mailQueue () {
    return this._mailQueue
  }

  authorize (credentialsPath, tokenPath) {
    return new Promise((resolve, reject) => {
      super.authorize(credentialsPath, tokenPath)
        .then(this._setApi.bind(this))
        .then(() => resolve(this))
        .catch(reject)
    })
  }

  _setApi () {
    this._api = google.gmail({
      version: 'v1',
      auth: this._oAuth2Client
    })
  }

  _sendMail (mailObj) {
    return new Promise((resolve, reject) => {
      if (mailObj.status !== 'QUEUED') {
        resolve()
      } else {
        this._api.users.messages.send({
          'userId': 'me',
          'resource': {
            'raw': mailObj.encodedMail
          }
        }, (err, res) => {
          err
            ? mailObj.logEvent(MAIL_EVENTS.FAILED_TO_SEND, err)
            : mailObj.logEvent(MAIL_EVENTS.SENT, res)
          resolve()
        })
      }
    })
  }

  _getThread (options) {
    return new Promise((resolve, reject) => {
      options = Object.assign({ 'userId': 'me' }, options)
      this._api.users.threads.get(options, (err, res) => {
        if (err) reject(err)
        else resolve(res)
      })
    })
  }

  _checkMailNotBounced (mailObj) {
    const sentEvent = mailObj.events.find(e => e.type === 'SENT')
    const { threadId } = sentEvent.message.data
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this._getThread({ id: threadId })
          .then(res => {
            const bounced = res.data.messages.filter(m => m.payload.headers.find(h => h.name === 'X-Failed-Recipients'))
            bounced.length > 0
              ? mailObj.logEvent(MAIL_EVENTS.BOUNCED)
              : mailObj.logEvent(MAIL_EVENTS.SENT_CONFIRMED)
            resolve(threadId)
          })
          .catch(reject)
      }, 5000)
    })
  }

  queueMail (mailConfig, isMarkdown) {
    return new Promise((resolve, reject) => {
      const mailObj = new Mail(mailConfig, isMarkdown)
      mailObj.create()
        .then(() => this._mailQueue.push(mailObj))
        .then(resolve)
        .catch(reject)
    })
  }

  sendAllMail () {
    const promises = this._mailQueue.queue.map(mailObj => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(mailObj)
          this._sendMail(mailObj)
            .then(() => this._checkMailNotBounced(mailObj))
            .then(resolve)
            .catch(reject)
        }, 3000)
      })
    })
    return Promise.all(promises)
  }
}

module.exports = {
  GmailClient
}
