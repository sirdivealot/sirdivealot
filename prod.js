process.env["NODE_ENV"] = "production"

const fs    = require('fs-extra')

fs.removeSync('dist')
fs.ensureDirSync('dist')
require('./build')()
