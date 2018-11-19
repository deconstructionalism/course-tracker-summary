
class CSVData {
  constructor (data, headerRow = 0, rowRange = null, colRange = null) {
    data = this._padRows(data)
    rowRange = rowRange || [0, data.length]
    colRange = colRange || [0, data[0].length]
    data = data.map(row => row.slice(...colRange))
    this._headers = data[headerRow]
    this._data = data.filter((_, i) => i >= rowRange[0] && i < rowRange[1])
    this._shape = [this._data.length, this._data[0].length]
  }

  get headers () {
    return this._headers
  }

  get data () {
    return this._data
  }

  get shape () {
    return this._shape
  }

  setHeaders (delta) {
    if (typeof delta !== 'object') {
      throw TypeError('delta must be an Object')
    }
    const newHeaders = [...this._headers]
    for (const [key, newValue] of Object.entries(delta)) {
      const maxIndex = this._shape[1] - 1
      const colIndex = parseInt(key)
      if (typeof colIndex !== 'number') {
        throw new TypeError('Make sure that keys are integer indicies')
      }
      if (colIndex < 0 || key > colIndex) {
        throw new RangeError(`Keys must be in range of data headers (0, ${maxIndex})`)
      }
      if (typeof newValue !== 'string') {
        throw new TypeError('Make sure that values are strings')
      }
      newHeaders[colIndex] = newValue
    }
    this._headers = newHeaders
  }

  _padRows (data) {
    const maxColumns = Math.max(...data.map(row => row.length))
    const paddedData = data.map(row => [
      ...row,
      ...Array(maxColumns - row.length).fill('')
    ])
    return paddedData
  }

  _zipRow (data) {
    const result = []
    this._headers.map((header, index) => {
      header = header || `<empty header ${index}>`
      const columnData = data.map(row => row[index])
      result.push({
        columnName: header,
        values: columnData
      })
    })
    return result
  }

  _validateIndicies (start, stop, maxRange) {
    if (!Number.isInteger(start)) {
      throw new TypeError('start must be an integer')
    }
    if (start < 0) {
      throw new RangeError('start must be greater than or equal to 0')
    }
    if (start > maxRange) {
      throw new RangeError(`start is larger than range (max: ${maxRange})`)
    }
    if (stop && !Number.isInteger(stop)) {
      throw new TypeError('stop must be an integer')
    }
    if (stop !== null && stop <= start) {
      throw new RangeError('stop must larger than start')
    }
    if (stop > maxRange) {
      throw new RangeError(`stop is larger than range (max: ${maxRange})`)
    }
  }

  indexRows (start, stop = null) {
    this._validateIndicies(start, stop, this.shape[0])
    if (!stop) { stop = start + 1 }
    const data = this._data.slice(start, stop)
    return data ? this._zipRow(data) : false
  }

  indexColumns (start, stop = null) {
    this._validateIndicies(start, stop, this.shape[1])
    if (!stop) { stop = start + 1 }
    const headers = this._headers.slice(start, stop)
    const data = headers.map((header, index) => ({
      columnName: header,
      values: this._data.map(row => row[start + index])
    }))
    return data || false
  }
}

module.exports = {
  CSVData
}
