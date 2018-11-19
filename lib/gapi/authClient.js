const { readFilePromise, redirectListener } = require('./tools.js')
const { google } = require('googleapis')

class GoogleAuthClient {
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

  authorize (credentialsPath) {
    return Promise.resolve(credentialsPath)
      .then(readFilePromise)
      .then(JSON.parse)
      .then(this._createOAuth2Client.bind(this))
      .then(this._generateAuthUrl.bind(this))
      .then(authUrl => this._getCode(authUrl, redirectListener))
      .then(this._getToken.bind(this))
      .catch(console.error)
  }

  _createOAuth2Client (credentials) {
    const {
      client_secret: clientSecret,
      client_id: clientId
    } = credentials.installed
    this._oAuth2Client = new google.auth.OAuth2(
      clientId, clientSecret, this._oAuthCbConfig.uri
    )
  }

  _generateAuthUrl (credentials) {
    const authUrl = this._oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this._scopes
    })
    return authUrl
  }

  _getCode (authUrl, getter) {
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
}

module.exports = {
  GoogleAuthClient
}
