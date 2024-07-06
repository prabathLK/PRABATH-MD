
const https = require('https');
const debug = require('debug')('pm2:version-check')
const qs    = require('querystring')

var VersionCheck = {}

VersionCheck.runCheck = function(params, cb) {
  var path = null

  if (cb == null && typeof(params) == 'function') {
    cb = params
    path = '/check'
  } else {
    path = '/check?' + qs.stringify(params)
  }

  var options = {
    host: 'version.pm2.io',
    path: path,
    strictSSL: false,
    timeout: 1200,
    rejectUnauthorized: false
  }

  var req = https.get(options, function(res) {
    if (res.statusCode != 200) return false
    var bodyChunks = []
    res.on('data', function(chunk) {
      bodyChunks.push(chunk)
    }).on('end', function() {
      var body = Buffer.concat(bodyChunks)
      try {
        var data = JSON.parse(body)
        return cb ? cb(null, data) : null
      } catch(e) {
        return cb ? cb(new Error('Could not parse result')) : null
      }
    })
  })

  req.on('error', function(e) {
    debug('ERROR: ' + e.message)
    return cb ? cb(e) : null
  })
}

module.exports = VersionCheck

if (require.main === module) {
  VersionCheck.runCheck((err, dt) => {
    console.log(err, dt)
  })
}
