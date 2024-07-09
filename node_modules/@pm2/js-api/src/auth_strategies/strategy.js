
'use strict'

const constants = require('../../constants.js')

const AuthStrategy = class AuthStrategy {
  constructor (opts) {
    this._opts = opts
    this.client_id = opts.client_id || opts.OAUTH_CLIENT_ID
    if (!this.client_id) {
      throw new Error('You must always provide a application id for any of the strategies')
    }
    this.scope = opts.scope || 'all'
    this.response_mode = opts.reponse_mode || 'query'

    let optsOauthEndpoint = null
    if (opts && opts.services) {
      optsOauthEndpoint = opts.services.OAUTH || opts.services.API
    }
    const oauthEndpoint = constants.services.OAUTH || constants.services.API
    this.oauth_endpoint = `${optsOauthEndpoint || oauthEndpoint}`
    if (this.oauth_endpoint[this.oauth_endpoint.length - 1] === '/' && constants.OAUTH_AUTHORIZE_ENDPOINT[0] === '/') {
      this.oauth_endpoint = this.oauth_endpoint.substr(0, this.oauth_endpoint.length - 1)
    }
    this.oauth_endpoint += constants.OAUTH_AUTHORIZE_ENDPOINT
    this.oauth_query = `?client_id=${opts.client_id}&response_mode=${this.response_mode}` +
      `&response_type=token&scope=${this.scope}`
  }

  retrieveTokens () {
    throw new Error('You need to implement a retrieveTokens function inside your strategy')
  }

  deleteTokens () {
    throw new Error('You need to implement a deleteTokens function inside your strategy')
  }

  static implementations (name) {
    const flows = {
      'embed': {
        nodule: require('./embed_strategy'),
        condition: 'node'
      },
      'browser': {
        nodule: require('./browser_strategy'),
        condition: 'browser'
      },
      'standalone': {
        nodule: require('./standalone_strategy'),
        condition: null
      }
    }
    return name ? flows[name] : null
  }
}

module.exports = AuthStrategy
