'use strict'

const fs = require('fs')
const os = require('os')

const requireMap = {
  ps: () => require('./ps'),
  procfile: () => require('./procfile'),
  wmic: () => require('./wmic')
}

const platformToMethod = {
  aix: 'ps',
  os400: 'ps',
  android: 'procfile',
  alpine: 'procfile',
  darwin: 'ps',
  freebsd: 'ps',
  os390: 'ps',
  linux: 'procfile',
  netbsd: 'procfile',
  openbsd: 'ps',
  sunos: 'ps',
  win: 'wmic'
}

let platform = os.platform()

if (fs.existsSync('/etc/alpine-release')) {
  platform = 'alpine'
}

if (platform.match(/^win/)) {
  platform = 'win'
}

let stat
try {
  stat = requireMap[platformToMethod[platform]]()
} catch (err) {}

/**
 * @callback pidCallback
 * @param {Error} err A possible error.
 * @param {Object} statistics The object containing the statistics.
 */

/**
 * Get pid informations.
 * @public
 * @param  {Number|Number[]|String|String[]} pids A pid or a list of pids.
 * @param  {Object} [options={}] Options object
 * @param  {pidCallback} callback Called when the statistics are ready.
 */
function get (pids, options, callback) {
  let fn = stat
  if (platform !== 'win' && options.usePs === true) {
    fn = requireMap.ps()
  }

  if (fn === undefined) {
    return callback(new Error(os.platform() + ' is not supported yet, please open an issue (https://github.com/soyuka/pidusage)'))
  }

  let single = false
  if (!Array.isArray(pids)) {
    single = true
    pids = [pids]
  }

  if (pids.length === 0) {
    return callback(new TypeError('You must provide at least one pid'))
  }

  for (let i = 0; i < pids.length; i++) {
    pids[i] = parseInt(pids[i], 10)
    if (isNaN(pids[i]) || pids[i] < 0) {
      return callback(new TypeError('One of the pids provided is invalid'))
    }
  }

  fn(pids, options, function (err, stats) {
    if (err) {
      return callback(err)
    }

    if (single) {
      callback(null, stats[pids[0]])
    } else {
      callback(null, stats)
    }
  })
}

module.exports = get
