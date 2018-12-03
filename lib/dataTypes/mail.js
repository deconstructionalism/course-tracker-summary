
const Base64 = require('js-base64').Base64
const MailComposer = require('nodemailer/lib/mail-composer')
const { Converter } = require('showdown')

const MAIL_EVENTS = {
  INITIALIZED: 'INITIALIZED',
  QUEUED: 'QUEUED',
  FAILED_TO_QUEUE: 'FAILED_TO_QUEUE',
  SENT: 'SENT',
  FAILED_TO_SEND: 'FAILED_TO_SEND',
  BOUNCED: 'BOUNCED',
  SENT_CONFIRMED: 'SENT_CONFIRMED'
}

class MailQueue {
  constructor (logFunc = () => {}) {
    this._queue = []
    this._logFunc = logFunc
  }

  get queue () {
    return this._queue
  }

  push (mailObj) {
    this._queue.push(mailObj)
  }

  empty () {
    this.filterQueue(() => false)
  }

  _defaultFilter (mailObj) {
    return mailObj.status !== 'SENT_CONFIRMED'
  }

  filterQueue (filterCallback = this._defaultFilter) {
    const removeIndicies = []
    this._queue.forEach((mailObj, i) => {
      if (!filterCallback(mailObj)) {
        removeIndicies.push(i)
        this._logFunc(mailObj)
      }
    })
    removeIndicies.sort((a, b) => b > a)
    removeIndicies.forEach(i => this._queue.splice(i, 1))
  }
}

class Mail {
  constructor (mailConfig, isMarkdown) {
    this._mailConfig = mailConfig
    this._encodedMail = null
    this._events = []
    this.logEvent(MAIL_EVENTS.INITIALIZED)
    if (isMarkdown) this._converter = new Converter()
  }

  create () {
    return Promise.resolve()
      .then(this._composeMail.bind(this))
      .then(this._buildMail)
      .then(Base64.encodeURI)
      .then(encodedMail => { this._encodedMail = encodedMail })
      .then(() => this.logEvent(MAIL_EVENTS.QUEUED))
      .catch(err => this.logEvent(MAIL_EVENTS.FAILED_TO_QUEUE, err))
  }

  get status () {
    return this._events.slice(-1)[0].type
  }

  get events () {
    return this._events
  }

  get mailConfig () {
    return this._mailConfig
  }

  get encodedMail () {
    return this._encodedMail
  }

  async _composeMail () {
    if (this._converter) {
      const { text } = this._mailConfig
      this._mailConfig.html = this._converter.makeHtml(text)
    }
    return new MailComposer(this.mailConfig)
  }

  _buildMail (mail) {
    return new Promise((resolve, reject) => {
      mail.compile().build(function (err, builtMail) {
        if (err) reject(err)
        resolve(builtMail)
      })
    })
  }

  logEvent (type, message) {
    if (!(type in MAIL_EVENTS)) {
      throw TypeError('invalid event type')
    }
    const time = new Date()
    this._events.push({ type, time, message })
  }
}

module.exports = {
  Mail,
  MailQueue,
  MAIL_EVENTS
}
