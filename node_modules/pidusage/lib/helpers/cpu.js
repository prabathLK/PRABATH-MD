const os = require('os')
const fs = require('fs')
const exec = require('child_process').exec
const parallel = require('./parallel')

/**
 * Gathers Clock, PageSize and system uptime through /proc/uptime
 * This method is mocked in procfile tests
 */
function updateCpu (cpu, next) {
  if (cpu !== null) {
    getRealUptime(function (err, uptime) {
      if (err) return next(err)
      cpu.uptime = uptime
      next(null, cpu)
    })
    return
  }

  parallel([
    getClockAndPageSize,
    getRealUptime
  ], function (err, data) {
    if (err) return next(err)

    cpu = {
      clockTick: data[0].clockTick,
      pageSize: data[0].pageSize,
      uptime: data[1]
    }

    next(null, cpu)
  })
}

module.exports = updateCpu

/**
 * Fallback on os.uptime(), though /proc/uptime is more precise
 */
function getRealUptime (next) {
  fs.readFile('/proc/uptime', 'utf8', function (err, uptime) {
    if (err || uptime === undefined) {
      if (!process.env.PIDUSAGE_SILENT) {
        console.warn("[pidusage] We couldn't find uptime from /proc/uptime, using os.uptime() value")
      }
      return next(null, os.uptime() || (new Date() / 1000))
    }

    return next(null, parseFloat(uptime.split(' ')[0]))
  })
}

function getClockAndPageSize (next) {
  parallel([
    function getClockTick (cb) {
      getconf('CLK_TCK', { default: 100 }, cb)
    },
    function getPageSize (cb) {
      getconf('PAGESIZE', { default: 4096 }, cb)
    }
  ], function (err, data) {
    if (err) return next(err)

    next(null, { clockTick: data[0], pageSize: data[1] })
  })
}

function getconf (keyword, options, next) {
  if (typeof options === 'function') {
    next = options
    options = { default: '' }
  }

  exec('getconf ' + keyword, function (error, stdout, stderr) {
    if (error !== null) {
      if (!process.env.PIDUSAGE_SILENT) {
        console.error('Error while calling "getconf ' + keyword + '"', error)
      }
      return next(null, options.default)
    }

    stdout = parseInt(stdout)

    if (!isNaN(stdout)) {
      return next(null, stdout)
    }

    return next(null, options.default)
  })
}
