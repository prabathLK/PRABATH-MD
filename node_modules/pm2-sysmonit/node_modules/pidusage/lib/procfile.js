var fs = require('fs')
var path = require('path')
var updateCpu = require('./helpers/cpu')
var parallel = require('./helpers/parallel')
var history = require('./history')
var cpuInfo = null
var Buffer = require('safe-buffer').Buffer
var SIZE = 1024 // if the stat file is bigger then this I'll buy you a drink

function noop () {}

function open (path, history, cb) {
  if (history.fd) { return cb(null, history.fd) }
  fs.open(path, 'r', cb)
}

function close (history) {
  if (history.fd) {
    fs.close(history.fd, noop)
  }
}

function readUntilEnd (fd, buf, cb) {
  var firstRead = false
  if (typeof buf === 'function') {
    cb = buf
    buf = Buffer.alloc(SIZE)
    firstRead = true
  }

  fs.read(fd, buf, 0, SIZE, 0, function (err, bytesRead, buffer) {
    if (err) {
      cb(err)
      return
    }

    var data = Buffer.concat([buf, buffer], firstRead ? bytesRead : buf.length + bytesRead)
    if (bytesRead === SIZE) {
      readUntilEnd(fd, data, cb)
      return
    }

    cb(null, buf)
  })
}

function readProcFile (pid, options, done) {
  var hst = history.get(pid, options.maxage)
  var again = false
  if (hst === undefined) {
    again = true
    hst = {}
  }

  // Arguments to path.join must be strings
  open(path.join('/proc', '' + pid, 'stat'), hst, function (err, fd) {
    if (err) {
      if (err.code === 'ENOENT') {
        err.message = 'No matching pid found'
      }
      return done(err, null)
    }

    if (err) {
      return done(err)
    }

    readUntilEnd(fd, function (err, buffer) {
      if (err) {
        return done(err)
      }

      var infos = buffer.toString('utf8')
      var date = Date.now()

      // https://github.com/arunoda/node-usage/commit/a6ca74ecb8dd452c3c00ed2bde93294d7bb75aa8
      // preventing process space in name by removing values before last ) (pid (name) ...)
      var index = infos.lastIndexOf(')')
      infos = infos.substr(index + 2).split(' ')

      // according to http://man7.org/linux/man-pages/man5/proc.5.html (index 0 based - 2)
      // In kernels before Linux 2.6, start was expressed in jiffies. Since Linux 2.6, the value is expressed in clock ticks
      var stat = {
        ppid: parseInt(infos[1]),
        utime: parseFloat(infos[11]) * 1000 / cpuInfo.clockTick,
        stime: parseFloat(infos[12]) * 1000 / cpuInfo.clockTick,
        cutime: parseFloat(infos[13]) * 1000 / cpuInfo.clockTick,
        cstime: parseFloat(infos[14]) * 1000 / cpuInfo.clockTick,
        start: parseFloat(infos[19]) * 1000 / cpuInfo.clockTick,
        rss: parseFloat(infos[21]),
        uptime: cpuInfo.uptime * 1000,
        fd: fd
      }

      var memory = stat.rss * cpuInfo.pageSize

      // https://stackoverflow.com/a/16736599/3921589
      var childrens = options.childrens ? stat.cutime + stat.cstime : 0
      // process usage since last call in seconds
      var total = (stat.stime - (hst.stime || 0) + stat.utime - (hst.utime || 0) + childrens)
      // time elapsed between calls in seconds
      var seconds = Math.abs(hst.uptime !== undefined ? stat.uptime - hst.uptime : stat.start - stat.uptime)
      var cpu = seconds > 0 ? (total / seconds) * 100 : 0

      history.set(pid, stat, options.maxage, close)

      if (again) {
        return readProcFile(pid, options, done)
      }

      return done(null, {
        cpu: cpu,
        memory: memory,
        ctime: stat.utime + stat.stime,
        elapsed: stat.uptime - stat.start,
        timestamp: date,
        pid: pid,
        ppid: stat.ppid
      })
    })
  })
}

function procfile (pids, options, done) {
  updateCpu(cpuInfo, function (err, result) {
    if (err) return done(err)

    cpuInfo = result
    var fns = {}

    pids.forEach(function (pid, i) {
      fns[pid] = function (cb) {
        readProcFile(pid, options, cb)
      }
    })

    parallel(fns, { graceful: true }, done)
  })
}

module.exports = procfile
