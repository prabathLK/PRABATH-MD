
'use strict'

const AuthStrategy = require('./strategy.js')
const http = require('http')
const fs = require('fs')
const url = require('url')
const exec = require('child_process').exec
const async = require('async')
const path = require('path')
const os = require('os')

module.exports = class EmbedStrategy extends AuthStrategy {
  // try to find a token
  retrieveTokens (km, cb) {
    let verifyToken = (refresh) => {
      return km.auth.retrieveToken({
        client_id: this.client_id,
        refresh_token: refresh
      })
    }
    async.tryEach([
      // try to find the token via the environement
      (next) => {
        if (!process.env.KM_TOKEN) {
          return next(new Error('No token in env'))
        }
        verifyToken(process.env.KM_TOKEN)
          .then((res) => {
            return next(null, res.data)
          })
          .catch(next)
      },
      // try to find it in the file system
      (next) => {
        fs.readFile(path.resolve(os.homedir(), '.keymetrics-tokens'), (err, tokens) => {
          if (err) return next(err)

          // verify that the token is valid
          tokens = JSON.parse(tokens || '{}')
          if (new Date(tokens.expire_at) > new Date(new Date().toISOString())) {
            return next(null, tokens)
          }

          verifyToken(tokens.refresh_token)
          .then((res) => {
            return next(null, res.data)
          })
          .catch(next)
        })
      },
      // otherwise make the whole flow
      (next) => {
        return this.launch((data) => {
          // verify that the token is valid
          verifyToken(data.access_token)
          .then((res) => {
            return next(null, res.data)
          })
          .catch(next)
        })
      }
    ], (err, result) => {
      if (result.refresh_token) {
        let file = path.resolve(os.homedir(), '.keymetrics-tokens')
        fs.writeFile(file, JSON.stringify(result), () => {
          return cb(err, result)
        })
      } else {
        return cb(err, result)
      }
    })
  }

  launch (cb) {
    let shutdown = false
    let server = http.createServer((req, res) => {
      // only handle one request
      if (shutdown === true) return res.end()
      shutdown = true

      let query = url.parse(req.url, true).query

      res.write(` You can go back to your terminal now :) `)
      res.end()
      server.close()
      return cb(query)
    })
    server.listen(43532, () => {
      this.open(`${this.oauth_endpoint}${this.oauth_query}`)
    })
  }

  open (target, appName, callback) {
    let opener
    const escape = function (s) {
      return s.replace(/"/g, '\\"')
    }

    if (typeof (appName) === 'function') {
      callback = appName
      appName = null
    }

    switch (process.platform) {
      case 'darwin': {
        opener = appName ? `open -a "${escape(appName)}"` : `open`
        break
      }
      case 'win32': {
        opener = appName ? `start "" ${escape(appName)}"` : `start ""`
        break
      }
      default: {
        opener = appName ? escape(appName) : `xdg-open`
        break
      }
    }

    if (process.env.SUDO_USER) {
      opener = 'sudo -u ' + process.env.SUDO_USER + ' ' + opener
    }
    return exec(`${opener} "${escape(target)}"`, callback)
  }

  deleteTokens (km) {
    return new Promise((resolve, reject) => {
      // revoke the refreshToken
      km.auth.revoke()
      .then(res => {
        // remove the token from the filesystem
        let file = path.resolve(os.homedir(), '.keymetrics-tokens')
        fs.unlinkSync(file)
        return resolve(res)
      }).catch(reject)
    })
  }
}
