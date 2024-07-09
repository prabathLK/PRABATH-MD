
'use strict'

const AuthStrategy = require('./strategy')

module.exports = class StandaloneFlow extends AuthStrategy {
  retrieveTokens (km, cb) {
    if (this._opts.refresh_token && this._opts.access_token) {
      // if both access and refresh tokens are provided, we are good
      return cb(null, {
        access_token: this._opts.access_token,
        refresh_token: this._opts.refresh_token
      })
    } else if (this._opts.refresh_token && this._opts.client_id) {
      // we can also make a request to get an access token
      km.auth.retrieveToken({
        client_id: this._opts.client_id,
        refresh_token: this._opts.refresh_token
      }).then((res) => {
        let tokens = res.data
        return cb(null, tokens)
      }).catch(cb)
    } else {
      // otherwise the flow isn't used correctly
      throw new Error(`If you want to use the standalone flow you need to provide either 
        a refresh and access token OR a refresh token and a client id`)
    }
  }

  deleteTokens (km) {
    return km.auth.revoke
  }
}
