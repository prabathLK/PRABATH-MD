'use strict'

const stats = require('./lib/stats')

/**
 * Get pid informations.
 * @public
 * @param  {Number|Number[]|String|String[]} pids A pid or a list of pids.
 * @param  {Object} [options={}] Options object
 * @param  {Function} [callback=undefined] Called when the statistics are ready.
 * If not provided a promise is returned instead.
 * @returns  {Promise.<Object>} Only when the callback is not provided.
 */
function pidusage (pids, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  if (options === undefined) {
    options = {}
  }

  options = Object.assign({
    usePs: /^true$/i.test(process.env.PIDUSAGE_USE_PS),
    maxage: process.env.PIDUSAGE_MAXAGE
  }, options)

  if (typeof callback === 'function') {
    stats(pids, options, callback)
    return
  }

  return new Promise(function (resolve, reject) {
    stats(pids, options, function (err, data) {
      if (err) return reject(err)
      resolve(data)
    })
  })
}

module.exports = pidusage
module.exports.clear = require('./lib/history').clear
