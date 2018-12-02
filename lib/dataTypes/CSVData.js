
class CSVData {
  constructor (data, headerRow = 0, rowRange = null, colRange = null) {
    data = this._padRows(data)
    rowRange = rowRange || [0, data.length]
    colRange = colRange || [0, data[0].length]
    data = data.map(row => row.slice(...colRange))
    this._headers = data[headerRow]
    this._data = data.slice(...rowRange)
  }

  get headers () {
    return this._headers
  }

  get data () {
    return this._data
  }

  get shape () {
    return [this._data.length, this._data[0].length]
  }

  setHeaders (delta) {
    process.assert(delta.constructor === Object, 'delta must be an Object')
    const newHeaders = [...this._headers]
    for (const [key, newValue] of Object.entries(delta)) {
      const colIndex = parseInt(key)
      process.assert(Number.isInteger(colIndex),
        'keys in delta must be interpretable as integers')
      const maxIndex = this.shape[1] - 1
      process.assert(colIndex >= 0 && maxIndex >= colIndex,
        `keys in delta must be in range of data headers (0, ${maxIndex})`)
      process.assert(typeof newValue === 'string',
        'values must be strings')
      newHeaders[colIndex] = newValue
    }
    this._headers = newHeaders
  }

  getRows (start = 0, stop = null) {
    this._validateIndicies(start, stop, this.shape[0])
    if (!stop) { stop = this.shape[0] }
    const data = this._data.slice(start, stop)
    return data ? this._zipRow(data) : false
  }

  getColumns (start = 0, stop = null) {
    this._validateIndicies(start, stop, this.shape[1])
    if (!stop) { stop = this.shape[1] }
    const headers = this._headers.slice(start, stop)
    const data = headers.map((header, index) => ({
      name: header,
      values: this._data.map(row => row[start + index])
    }))
    return data || false
  }

  dropEmpty (axis = 0) {
    process.assert(Number.isInteger(axis),
      'axis must be an Integer')
    process.assert([0, 1].includes(axis),
      'axis must be 0 (row) or 1 (column)')

    if (axis === 0) {
      this._data = this._data.filter(row => row.join('') !== '')
    }
    if (axis === 1) {
      const columns = this.getColumns()
      const dropCols = []
      columns.forEach((col, index) => {
        col.values.join('') === '' && dropCols.push(index)
      })
      this._headers = this._headers.filter((_, index) => !dropCols.includes(index))
      this._data = this._data.map(row => row.filter((_, index) => !dropCols.includes(index)))
    }
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
    data.forEach((row) => {
      const rowData = {}
      row.forEach((val, index) => {
        const header = this._headers[index]
        rowData[header] = val
      })
      result.push(rowData)
    })
    return result
  }

  _validateIndicies (start, stop, maxRange) {
    process.assert(Number.isInteger(start),
      'start must be an integer')
    process.assert(start >= 0,
      'start must be greater than or equal to 0')
    process.assert(start <= maxRange,
      `start is larger than range (max: ${maxRange})`)
    if (stop) {
      process.assert(Number.isInteger(stop),
        'stop must be an integer')
      process.assert(stop > start,
        'stop must larger than start')
      process.assert(stop <= maxRange,
        `stop is larger than range (max: ${maxRange})`)
    }
  }
}

module.exports = {
  CSVData
}
