const { existsSync, mkdirSync } = require('fs')

const dirs = ['./data', './data/emailTemplates', './data/mailLogs']
dirs.forEach(dir => !existsSync(dir) && mkdirSync(dir))
