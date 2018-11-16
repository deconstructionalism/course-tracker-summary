const summarize = require('./bin/summarize.js')

const outfile = process.argv[2]

if (![2, 3].includes(process.argv.length)) {
  throw new RangeError('only one optional outfile argument is allowed')
}

summarize(outfile)
