
'use strict'

const Namespace = require('./namespace')
const constants = require('../constants')
const NetworkWrapper = require('./network')
const logger = require('debug')('kmjs')

const Keymetrics = class Keymetrics {
 /**
 * @constructor
 * Keymetrics
 *
 * @param {Object} [opts]
 * @param {String} [opts.OAUTH_CLIENT_ID] the oauth client ID used to authenticate to KM
 * @param {Object} [opts.services] base url for differents services
 * @param {String} [opts.mappings] api mappings
 */
  constructor (opts) {
    logger('init keymetrics instance')
    this.opts = Object.assign(constants, opts)

    logger('init network client (http/ws)')
    this._network = new NetworkWrapper(this, this.opts)

    const mapping = opts && opts.mappings ? opts.mappings : require('./api_mappings.json')
    logger(`Using mappings provided in ${opts && opts.mappings ? 'options' : 'package'}`)

    // build namespaces at startup
    logger('building namespaces')
    let root = new Namespace(mapping, {
      name: 'root',
      http: this._network,
      services: this.opts.services
    })
    logger('exposing namespaces')
    for (let key in root) {
      if (key === 'name' || key === 'opts') continue
      this[key] = root[key]
    }
    logger(`attached namespaces : ${Object.keys(this)}`)

    this.realtime = this._network.realtime
  }

  /**
   * Use a specific flow to retrieve an access token on behalf the user
   * @param {String|Function} flow either a flow name or a custom implementation
   * @param {Object} [opts]
   * @param {String} [opts.client_id] the OAuth client ID to use to identify the application
   *  default to the one defined when instancing Keymetrics and fallback to 795984050 (custom tokens)
   * @throws invalid use of this function, either the flow don't exist or isn't correctly implemented
   */
  use (flow, opts) {
    logger(`using ${flow} authentication strategy`)
    this._network.useStrategy(flow, opts)
    // the logout is dependent of the auth flow so we need it to be initialize
    // but also we need to give the access of the instance, so we inject it here
    this.auth.logout = () => {
      return this._network.oauth_flow.deleteTokens(this)
    }
    return this
  }

  /**
   * API date lag, in millisecond.  This is the difference between the current browser date and the
   * approximated API date.  This is useful to compute duration between dates returned by the API
   * and "now".
   * @example
   * const apiDate = moment().add(km.apiDateLag)
   * const timeSinceLastUpdate = apiDate.diff(server.updated_at)
   */
  get apiDateLag () {
    return this._network.apiDateLag
  }
}

module.exports = Keymetrics
