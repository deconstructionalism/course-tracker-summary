const scopes = [
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.readonly'
]

const oAuthCbConfig = {
  port: 3000,
  endpoint: 'oAuth2callback',
  get uri () {
    return `http://localhost:${this.port}/${this.endpoint}`
  }
}

const bounceEmailQuery = sentTime => `from:mailer-daemon@googlemail.com after:${sentTime}`

module.exports = {
  scopes,
  oAuthCbConfig,
  bounceEmailQuery
}
