const { statSync, readdirSync } = require('fs')
const { resolve, join } = require('path')

const ignoreDirs = [
  /\.\w*/ // matches ".*"
]

const getInnerDirs = (outerDirPath, ignore = ignoreDirs) => {
  outerDirPath = resolve(outerDirPath)
  const files = readdirSync(outerDirPath)
  const dirs = files.filter(filePath => {
    return statSync(join(outerDirPath, filePath)).isDirectory()
  })
  return dirs.filter(dir => ignore.some(regex => !dir.match(regex)))
}

const camelize = str => {
  // https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case/2970667#2970667
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
    return index === 0
      ? letter.toLowerCase()
      : letter.toUpperCase()
  }).replace(/\s+/g, '')
}

module.exports = {
  getInnerDirs,
  camelize
}
