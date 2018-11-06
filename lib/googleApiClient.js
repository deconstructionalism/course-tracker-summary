const { readFile, redirectListener } = require('./tools.js')
const { google } = require('googleapis')

class GoogleAPIClient {
  constructor (scopes, oAuthCbConfig) {
    this._scopes = scopes
    this._oAuthCbConfig = oAuthCbConfig
    this._oAuth2Client = null
  }

  get scopes () {
    return this._scopes
  }

  get oAuthCbConfig () {
    return this._oAuthCbConfig
  }

  _createOAuth2Client (credentials) {
    const {
      client_secret,
      client_id
    } = credentials.installed
    this._oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, this._oAuthCbConfig.uri
    )
  }

  _generateAuthUrl (credentials) {
    const authUrl = this._oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this._scopes
    })
    return authUrl
  }

  _getCode (authUrl, getter = redirectListener) {
    return new Promise((resolve, reject) => {
      Promise.resolve()
        .then(getter.bind(this, authUrl, this._oAuthCbConfig))
        .then(resolve)
        .catch(reject)
    })
  }

  _getToken (code) {
    return new Promise((resolve, reject) => {
      this._oAuth2Client.getToken(code, (err, token) => {
        if (err) reject(err)
        this._oAuth2Client.setCredentials(token)
        resolve()
      })
    })
  }

  authorize (credentialsPath) {
    return Promise.resolve(credentialsPath)
      .then(readFile)
      .then(JSON.parse)
      .then(this._createOAuth2Client.bind(this))
      .then(this._generateAuthUrl.bind(this))
      .then(authUrl => this._getCode(authUrl, redirectListener))
      .then(this._getToken.bind(this))
      .catch(console.error)
  }
}

module.exports = {
  GoogleAPIClient
}
