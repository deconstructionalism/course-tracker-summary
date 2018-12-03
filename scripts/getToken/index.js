const { GoogleAuthClient } = require('../../lib/gapi/authClient')
const { scopes, oAuthCbConfig } = require('../config.js')
const { checkFilesExist } = require('../tools.js')

const credentialsFilePath = './credentials.json'

const getToken = () => {
  checkFilesExist([credentialsFilePath])

  const client = new GoogleAuthClient(scopes, oAuthCbConfig)
  client.authorize(credentialsFilePath)
}

getToken()
