'use strict'

var os = require('os')
var bin = require('./bin')
var history = require('./history')

function parseDate (datestr) {
  var year = datestr.substring(0, 4)
  var month = datestr.substring(4, 6)
  var day = datestr.substring(6, 8)
  var hour = datestr.substring(8, 10)
  var minutes = datestr.substring(10, 12)
  var seconds = datestr.substring(12, 14)
  var useconds = datestr.substring(15, 21)
  var sign = datestr.substring(21, 22)
  var tmz = parseInt(datestr.substring(22, 25), 10)
  var tmzh = Math.floor(tmz / 60)
  var tmzm = tmz % 60

  return new Date(
    year + '-' + month + '-' + day + 'T' + hour +
    ':' + minutes + ':' + seconds +
    '.' + useconds +
    sign + (tmzh > 9 ? tmzh : '0' + tmzh) + '' + (tmzm > 9 ? tmzm : '0' + tmzm)
  )
}

/**
  * Get pid informations through wmic command.
  * @param  {Number[]} pids
  * @param  {Object} options
  * @param  {Function} done(err, stat)
  */
function wmic (pids, options, done) {
  var whereClause = 'ProcessId=' + pids[0]
  for (var i = 1; i < pids.length; i++) {
    whereClause += ' or ' + 'ProcessId=' + pids[i]
  }

  var args = [
    'PROCESS',
    'where',
    '"' + whereClause + '"',
    'get',
    'CreationDate,KernelModeTime,ParentProcessId,ProcessId,UserModeTime,WorkingSetSize'
  ]

  bin('wmic', args, { windowsHide: true, windowsVerbatimArguments: true }, function (err, stdout, code) {
    if (err) {
      if (err.message.indexOf('No Instance(s) Available.') !== -1) {
        const error = new Error('No matching pid found')
        error.code = 'ENOENT'
        return done(error)
      }
      return done(err)
    }
    if (code !== 0) {
      return done(new Error('pidusage wmic command exited with code ' + code))
    }
    var date = Date.now()

    // Note: On Windows the returned value includes fractions of a second.
    // Use Math.floor() to get whole seconds.
    var uptime = Math.floor(os.uptime())

    // Example of stdout on Windows 10
    // CreationDate: is in the format yyyymmddHHMMSS.mmmmmmsUUU
    // KernelModeTime: is in units of 100 ns
    // UserModeTime: is in units of 100 ns
    // WorkingSetSize: is in bytes
    //
    // Refs: https://superuser.com/a/937401/470946
    // Refs: https://msdn.microsoft.com/en-us/library/aa394372(v=vs.85).aspx
    // NB: The columns are returned in lexicographical order
    //
    // CreationDate               KernelModeTime  ParentProcessId  ProcessId  UserModeTime  WorkingSetSize
    // 20150329221650.080654+060  153750000       0                777        8556250000    110821376

    stdout = stdout.split(os.EOL)

    var again = false
    var statistics = {}
    for (var i = 1; i < stdout.length; i++) {
      var line = stdout[i].trim().split(/\s+/)

      if (!line || line.length !== 6) {
        continue
      }

      var creation = parseDate(line[0])
      var ppid = parseInt(line[2], 10)
      var pid = parseInt(line[3], 10)
      var kerneltime = Math.round(parseInt(line[1], 10) / 10000)
      var usertime = Math.round(parseInt(line[4], 10) / 10000)
      var memory = parseInt(line[5], 10)

      var hst = history.get(pid, options.maxage)
      if (hst === undefined) {
        again = true
        hst = { ctime: kerneltime + usertime, uptime: uptime }
      }

      // process usage since last call
      var total = (kerneltime + usertime - hst.ctime) / 1000
      // time elapsed between calls in seconds
      var seconds = uptime - hst.uptime
      var cpu = seconds > 0 ? (total / seconds) * 100 : 0

      history.set(pid, { ctime: usertime + kerneltime, uptime: uptime }, options.maxage)

      statistics[pid] = {
        cpu: cpu,
        memory: memory,
        ppid: ppid,
        pid: pid,
        ctime: usertime + kerneltime,
        elapsed: date - creation.getTime(),
        timestamp: date
      }
    }

    if (again) {
      return wmic(pids, options, function (err, stats) {
        if (err) return done(err)
        done(null, Object.assign(statistics, stats))
      })
    }
    done(null, statistics)
  })
}

module.exports = wmic
