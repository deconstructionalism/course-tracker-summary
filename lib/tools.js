const fs = require('fs')
const querystring = require('querystring')
const http = require('http')
const url = require('url')
const opn = require('opn')

const readFile = (filePath, encoding = 'utf-8') => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, encoding, (err, content) => {
      if (err) reject(err)
      else resolve(content)
    })
  })
}

const redirectListener = (authUrl, oAuthCbConfig) => {
  const { port, endpoint } = oAuthCbConfig
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      if (req.url.indexOf(endpoint) > -1) {
        const qs = querystring.parse(url.parse(req.url).query)
        res.end('Authentication successful! Please close browser tab and return to the console.')
        server.close()
        resolve(qs.code)
      }
    })
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`port ${port} in use, cannot open redirect server!`)
        reject(err)
      }
    })
    server.listen(port, () => {
      opn(authUrl, { wait: false })
    })
  })
}
module.exports = {
  readFile,
  redirectListener
}
