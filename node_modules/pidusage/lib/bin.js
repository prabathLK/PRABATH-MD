'use strict'

const spawn = require('child_process').spawn

/**
  * Spawn a binary and read its stdout.
  * @param  {String} cmd
  * @param  {String[]} args
  * @param  {Function} done(err, stdout)
  */
function run (cmd, args, options, done) {
  if (typeof options === 'function') {
    done = options
    options = undefined
  }

  let executed = false
  const ch = spawn(cmd, args, options)
  let stdout = ''
  let stderr = ''

  ch.stdout.on('data', function (d) {
    stdout += d.toString()
  })

  ch.stderr.on('data', function (d) {
    stderr += d.toString()
  })

  ch.on('error', function (err) {
    if (executed) return
    executed = true
    done(new Error(err))
  })

  ch.on('close', function (code, signal) {
    if (executed) return
    executed = true

    if (stderr) {
      return done(new Error(stderr))
    }

    done(null, stdout, code)
  })
}

module.exports = run
