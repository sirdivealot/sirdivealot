process.env["NODE_ENV"] = "production"

require('fs-extra').ensureDirSync('dist')
require('./build')()
