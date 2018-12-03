const { redirectListener } = require('./tools.js')
const { google } = require('googleapis')
const { readFileSync, writeFileSync } = require('fs')

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

  get oAuth2Client () {
    return this._oAuth2Client
  }

  authorize (credentialsPath, tokenPath) {
    return Promise.resolve(credentialsPath)
      .then(readFileSync)
      .then(JSON.parse)
      .then(this._createOAuth2Client.bind(this))
      .then(this._handleToken.bind(this, tokenPath))
      .catch(console.error)
  }

  _handleToken (tokenPath) {
    if (tokenPath) {
      return Promise.resolve(tokenPath)
        .then(this._setToken(tokenPath))
    } else {
      return Promise.resolve()
        .then(this._generateAuthUrl.bind(this))
        .then(authUrl => this._getCode(authUrl, redirectListener))
        .then(this._getToken.bind(this))
        .catch(console.error)
    }
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

  _generateAuthUrl () {
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
        writeFileSync('./token.json', JSON.stringify(token, null, 4))
        resolve()
      })
    })
  }

  _setToken (tokenPath) {
    return Promise.resolve(tokenPath)
      .then(readFileSync)
      .then(JSON.parse)
      .then(token => this._oAuth2Client.setCredentials(token))
      .catch(console.error)
  }
}

module.exports = {
  GoogleAuthClient
}
