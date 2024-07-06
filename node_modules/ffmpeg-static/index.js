'use strict'

const pkg = require('./package.json')

const {
  'binary-path-env-var': BINARY_PATH_ENV_VAR,
  'executable-base-name': executableBaseName,
} = pkg[pkg.name]
if ('string' !== typeof BINARY_PATH_ENV_VAR) {
  throw new Error(`package.json: invalid/missing ${pkg.name}.binary-path-env-var entry`)
}
if ('string' !== typeof executableBaseName) {
  throw new Error(`package.json: invalid/missing ${pkg.name}.executable-base-name entry`)
}

if (process.env[BINARY_PATH_ENV_VAR]) {
  module.exports = process.env[BINARY_PATH_ENV_VAR]
} else {
  var os = require('os')
  var path = require('path')

  var binaries = Object.assign(Object.create(null), {
    darwin: ['x64', 'arm64'],
    freebsd: ['x64'],
    linux: ['x64', 'ia32', 'arm64', 'arm'],
    win32: ['x64', 'ia32']
  })

  var platform = process.env.npm_config_platform || os.platform()
  var arch = process.env.npm_config_arch || os.arch()

  let binaryPath = path.join(
    __dirname,
    executableBaseName + (platform === 'win32' ? '.exe' : ''),
  )

  if (!binaries[platform] || binaries[platform].indexOf(arch) === -1) {
    binaryPath = null
  }

  module.exports = binaryPath
}
