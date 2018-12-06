const { GoogleAuthClient } = require('../../lib/gapi/authClient')
const { writeFileSync } = require('fs')
const { scopes, oAuthCbConfig, paths } = require('../config.js')
const { checkFilesExist } = require('../tools.js')

const {
  credentialsFilePath,
  tokenFilePath } = paths

const getToken = () => {
  checkFilesExist([credentialsFilePath])

  const client = new GoogleAuthClient(scopes, oAuthCbConfig)
  client.authorize(credentialsFilePath)
    .then(token => writeFileSync(tokenFilePath, JSON.stringify(token, null, 4)))
    .catch(console.error)
}

getToken()
