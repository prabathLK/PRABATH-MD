/* global URLSearchParams, URL, localStorage */
'use strict'

const AuthStrategy = require('./strategy')

module.exports = class BrowserFlow extends AuthStrategy {
  removeUrlToken (refreshToken) {
    let url = window.location.href
    let params = `?access_token=${refreshToken}&token_type=refresh_token`
    let newUrl = url.replace(params, '')
    window.history.pushState('', '', newUrl)
  }

  retrieveTokens (km, cb) {
    let verifyToken = (refresh) => {
      return km.auth.retrieveToken({
        client_id: this.client_id,
        refresh_token: refresh
      })
    }

    // parse the url since it can contain tokens
    let url = new URL(window.location)
    this.response_mode = this.response_mode === 'query' ? 'search' : this.response_mode
    let params = new URLSearchParams(url[this.response_mode])

    if (params.get('access_token') !== null) {
      // verify that the access_token in parameters is valid
      verifyToken(params.get('access_token'))
        .then((res) => {
          this.removeUrlToken(res.data.refresh_token)
          // Save refreshToken in localstorage
          localStorage.setItem('km_refresh_token', params.get('access_token'))
          let tokens = res.data
          return cb(null, tokens)
        }).catch(cb)
    } else if (typeof localStorage !== 'undefined' && localStorage.getItem('km_refresh_token') !== null) {
      // maybe in the local storage ?
      verifyToken(localStorage.getItem('km_refresh_token'))
        .then((res) => {
          this.removeUrlToken(res.data.refresh_token)
          let tokens = res.data
          return cb(null, tokens)
        }).catch(cb)
    } else {
      // otherwise we need to get a refresh token
      window.location = `${this.oauth_endpoint}${this.oauth_query}&redirect_uri=${window.location}`
    }
  }

  deleteTokens (km) {
    return new Promise((resolve, reject) => {
      // revoke the refreshToken
      km.auth.revoke()
        .then(res => console.log('Token successfuly revoked!'))
        .catch(err => console.error(`Error when trying to revoke token: ${err.message}`))
      // We need to remove from storage and redirect user in every case (cf. https://github.com/keymetrics/pm2-io-js-api/issues/49)
      // remove the token from the localStorage
      localStorage.removeItem('km_refresh_token')
      setTimeout(_ => {
        // redirect after few miliseconds so any user code will run
        window.location = `${this.oauth_endpoint}${this.oauth_query}`
      }, 500)
      return resolve()
    })
  }
}
