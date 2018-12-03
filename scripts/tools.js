const { existsSync } = require('fs')

const checkFilesExist = filePathArr => {
  for (const filePath of filePathArr) {
    process.assert(existsSync(filePath), `"${filePath}" not found!`)
  }
}

const generateObjectDescription = (obj, replaceKeys, showFirstOfArray) => {
  const replacer = (key, value) => {
    const ArrayReplacer = arr => {
      if (arr.length === 0) return '[]'
      switch (arr[0].constructor) {
        case String:
          return '[String Array]'
        case Number:
          return '[Number Array]'
        case Boolean:
          return '[Boolean Array]'
        case Array:
          return arr
        case Object:
          return arr
      }
    }

    if (value === null) return value
    switch (value.constructor) {
      case String:
        return '[String]'
      case Number:
        return '[Number]'
      case Boolean:
        return '[Boolean]'
      case Array:
        if (showFirstOfArray.includes(key)) {
          return ArrayReplacer([value[0]])
        } else {
          return ArrayReplacer(value)
        }
      case Object:
        return renameObjectKeys(value)
    }
    return value
  }

  const renameObjectKeys = obj => {
    for (const oldKey in replaceKeys) {
      if (oldKey in obj) {
        const newKey = replaceKeys[oldKey]
        Object.defineProperty(obj, newKey,
          Object.getOwnPropertyDescriptor(obj, oldKey))
        delete obj[oldKey]
      }
    }
    return obj
  }

  return JSON.stringify(obj, replacer, 4)
}

module.exports = {
  checkFilesExist,
  generateObjectDescription
}
