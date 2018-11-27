const querystring = require('querystring')
const http = require('http')
const url = require('url')
const opn = require('opn')

const redirectListener = (authUrl, oAuthCbConfig) => {
  const { port, endpoint } = oAuthCbConfig
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
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

const numericToA1 = colIndex => {
  colIndex++
  let result = ''

  while (colIndex > 0) {
    colIndex -= 1
    const remainder = colIndex % 26
    const charCode = remainder + 65
    result = String.fromCharCode(charCode) + result
    colIndex = (colIndex - remainder) / 26
  }

  return result
}

module.exports = {
  redirectListener,
  numericToA1
}
