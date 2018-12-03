const { GoogleAuthClient } = require('../lib/gapi/authClient.js')
const { scopes, oAuthCbConfig } = require('./config.js')

const client = new GoogleAuthClient(scopes, oAuthCbConfig)
client.authorize('./credentials.json')
