
'use strict'

const extrareqp2 = require('extrareqp2')
const AuthStrategy = require('./auth_strategies/strategy')
const constants = require('../constants')
const logger = require('debug')('kmjs:network')
const loggerHttp = require('debug')('kmjs:network:http')
const loggerWS = require('debug')('kmjs:network:ws')
const WS = require('./utils/websocket')
const EventEmitter = require('eventemitter2')
const async = require('async')

const BUFFERIZED = -1

module.exports = class NetworkWrapper {
  constructor (km, opts) {
    logger('init network manager')
    opts.baseURL = opts.services.API
    this.opts = opts
    this.opts.maxRedirects = 0
    this.tokens = {
      refresh_token: null,
      access_token: null
    }
    this.km = km
    this._queue = []
    this._extrareqp2 = extrareqp2.create(opts)
    this._websockets = []
    this._endpoints = new Map()
    this._bucketFilters = new Map()

    this.apiDateLag = 0

    this.realtime = new EventEmitter({
      wildcard: true,
      delimiter: ':',
      newListener: false,
      maxListeners: 100
    })
    // https://github.com/EventEmitter2/EventEmitter2/issues/214
    const self = this
    const realtimeOn = this.realtime.on
    this.realtime.on = function () {
      self.editSocketFilters('push', arguments[0])
      return realtimeOn.apply(self.realtime, arguments)
    }
    const realtimeOff = this.realtime.off
    this.realtime.off = function () {
      self.editSocketFilters('remove', arguments[0])
      return realtimeOff.apply(self.realtime, arguments)
    }
    this.realtime.subscribe = this.subscribe.bind(this)
    this.realtime.unsubscribe = this.unsubscribe.bind(this)
    this.authenticated = false
    this._setupDateLag()
  }

  _setupDateLag () {
    const updateApiDateLag = response => {
      if (response && response.headers && response.headers.date) {
        const headerDate = new Date(response.headers.date)
        const clientDate = new Date()

        // The header date is likely to be truncated to the second, so truncate the client date too
        headerDate.setMilliseconds(0)
        clientDate.setMilliseconds(0)

        this.apiDateLag = headerDate - clientDate
      }
    }

    this._extrareqp2.interceptors.response.use(
      response => {
        updateApiDateLag(response)
        return response
      },
      error => {
        updateApiDateLag(error.response)
        return Promise.reject(error)
      }
    )
  }

  _queueUpdater () {
    if (this.authenticated === false) return

    if (this._queue.length > 0) {
      logger(`Emptying requests queue (size: ${this._queue.length})`)
    }

    // when we are authenticated we can clear the queue
    while (this._queue.length > 0) {
      let promise = this._queue.shift()
      // make the request
      this.request(promise.request).then(promise.resolve, promise.reject)
    }
  }

  /**
   * Resolve the endpoint of the node to make the request to
   * because each bucket might be on a different node
   * @param {String} bucketID the bucket id
   *
   * @return {Promise}
   */
  _resolveBucketEndpoint (bucketID) {
    if (!bucketID) return Promise.reject(new Error(`Missing argument : bucketID`))

    if (!this._endpoints.has(bucketID)) {
      const promise = this._extrareqp2.request({
        url: `/api/bucket/${bucketID}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.tokens.access_token}`
        }
      })
        .then((res) => {
          return res.data.node.endpoints.web
        })
        .catch((e) => {
          this._endpoints.delete(bucketID)
          throw e
        })

      this._endpoints.set(bucketID, promise)
    }

    return this._endpoints.get(bucketID)
  }

  /**
   * Send a http request
   * @param {Object} opts
   * @param {String} [opts.method=GET] http method
   * @param {String} opts.url the full URL
   * @param {Object} [opts.data] body data
   * @param {Object} [opts.params] url params
   *
   * @return {Promise}
   */
  request (httpOpts) {
    return new Promise((resolve, reject) => {
      async.series([
        // verify that we don't need to buffer the request because authentication
        next => {
          if (this.authenticated === true || httpOpts.authentication === false) return next()

          loggerHttp(`Queued request to ${httpOpts.url}`)
          this._queue.push({
            resolve,
            reject,
            request: httpOpts
          })
          // we need to stop the flow here
          return next(BUFFERIZED)
        },
        // we need to verify that the baseURL is correct
        (next) => {
          if (!httpOpts.url.match(/bucket\/[0-9a-fA-F]{24}/)) return next()
          // parse the bucket id from URL
          let bucketID = httpOpts.url.split('/')[3]
          // we need to retrieve where to send the request depending on the backend
          this._resolveBucketEndpoint(bucketID)
            .then(endpoint => {
              httpOpts.baseURL = endpoint
              // then continue the flow
              return next()
            }).catch(next)
        },
        // if the request has not been bufferized, make the request
        next => {
          // super trick to transform a promise response to a callback
          const successNext = res => next(null, res)
          loggerHttp(`Making request to ${httpOpts.url}`)

          if (!httpOpts.headers) {
            httpOpts.headers = {}
          }
          httpOpts.headers.Authorization = `Bearer ${this.tokens.access_token}`

          this._extrareqp2.request(httpOpts)
            .then(successNext)
            .catch((error) => {
              let response = error.response
              // we only need to handle when code is 401 (which mean unauthenticated)
              if (response && response.status !== 401) return next(response)
              loggerHttp(`Got unautenticated response, buffering request from now ...`)

              // we tell the client to not send authenticated request anymore
              this.authenticated = false

              loggerHttp(`Asking to the oauth flow to retrieve new tokens`)

              var q = () => {
                this.oauth_flow.retrieveTokens(this.km, (err, data) => {
                  // if it fail, we fail the whole request
                  if (err) {
                    loggerHttp(`Failed to retrieve new tokens : ${err.message || err}`)
                    return next(response)
                  }
                  // if its good, we try to update the tokens
                  loggerHttp(`Succesfully retrieved new tokens`)
                  this._updateTokens(null, data, (err, authenticated) => {
                    // if it fail, we fail the whole request
                    if (err) return next(response)
                    // then we can rebuffer the request
                    loggerHttp(`Re-buffering call to ${httpOpts.url} since authenticated now`)
                    httpOpts.headers.Authorization = `Bearer ${this.tokens.access_token}`
                    return this._extrareqp2.request(httpOpts).then(successNext).catch(next)
                  })
                })
              }
              if (httpOpts.url == this.opts.services.OAUTH + '/api/oauth/token') {
                // Avoid infinite recursive loop to retrieveToken
                return setTimeout(q.bind(this), 500)
              }
              q()
            })
        }
      ], (err, results) => {
        // if the flow is stoped because the request has been
        // buferred, we don't need to do anything
        if (err === BUFFERIZED) return
        return err ? reject(err) : resolve(results[2])
      })
    })
  }

  /**
   * Update the access token used by all the networking clients
   * @param {Error} err if any erro
   * @param {String} accessToken the token you want to use
   * @param {Function} [cb] invoked with <err, authenticated>
   * @private
   */
  _updateTokens (err, data, cb) {
    if (err) {
      console.error('Error while retrieving tokens:', err)
      // Try to logout/login user
      this.oauth_flow.deleteTokens(this.km)
      return console.error(err.response ? err.response.data : err.stack)
    }
    if (!data || !data.access_token || !data.refresh_token) throw new Error('Invalid tokens')

    this.tokens = data

    loggerHttp(`Registered new access_token : ${data.access_token}`)
    this._websockets.forEach(websocket => websocket.updateAuthorization(data.access_token))
    this._extrareqp2.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`
    this._extrareqp2.request({
      url: '/api/bucket',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${data.access_token}`
      }
    }).then((res) => {
      loggerHttp(`Cached ${res.data.length} buckets for current user`)
      this.authenticated = true
      this._queueUpdater()
      return typeof cb === 'function' ? cb(null, true) : null
    }).catch((err) => {
      console.error('Error while retrieving buckets')
      console.error(err.response ? err.response.data : err)
      return typeof cb === 'function' ? cb(err) : null
    })
  }

  /**
   * Specify a strategy to use when authenticating to server
   * @param {String|Function} flow the name of the flow to use or a custom implementation
   * @param {Object} [opts]
   * @param {String} [opts.client_id] the OAuth client ID to use to identify the application
   *  default to the one defined when instancing Keymetrics and fallback to 795984050 (custom tokens)
   * @throws invalid use of this function, either the flow don't exist or isn't correctly implemented
   */
  useStrategy (flow, opts) {
    if (!opts) opts = {}
    // if client not provided here, use the one given in the instance
    if (!opts.client_id) {
      opts.client_id = this.opts.OAUTH_CLIENT_ID
    }

    // in the case of flow being a custom implementation
    if (typeof flow === 'object') {
      this.oauth_flow = flow
      if (!this.oauth_flow.retrieveTokens || !this.oauth_flow.deleteTokens) {
        throw new Error('You must implement the Strategy interface to use it')
      }
      return this.oauth_flow.retrieveTokens(this.km, this._updateTokens.bind(this))
    }
    // otherwise fallback on the flow that are implemented
    if (typeof AuthStrategy.implementations(flow) === 'undefined') {
      throw new Error(`The flow named ${flow} doesn't exist`)
    }
    let flowMeta = AuthStrategy.implementations(flow)

    // verify that the environnement condition is meet
    if (flowMeta.condition && constants.ENVIRONNEMENT !== flowMeta.condition) {
      throw new Error(`The flow ${flow} is reserved for ${flowMeta.condition} environment`)
    }
    let FlowImpl = flowMeta.nodule
    this.oauth_flow = new FlowImpl(opts)
    return this.oauth_flow.retrieveTokens(this.km, this._updateTokens.bind(this))
  }

  editSocketFilters (type, event) {
    if (event.indexOf('**') === 0) throw new Error('You need to provide a bucket public id.')
    event = event.split(':')
    const bucketPublicId = event[0]
    const filter = event.slice(2).join(':')
    const socket = this._websockets.find(socket => socket.bucketPublic === bucketPublicId)
    if (!this._bucketFilters.has(bucketPublicId)) this._bucketFilters.set(bucketPublicId, [])
    const filters = this._bucketFilters.get(bucketPublicId)

    if (type === 'push') {
      filters.push(filter)
    } else {
      filters.splice(filters.indexOf(filter), 1)
    }

    if (!socket) return
    socket.send(JSON.stringify({
      action: 'sub',
      public_id: bucketPublicId,
      filters: Array.from(new Set(filters)) // avoid duplicates
    }))
  }

  /**
   * Subscribe to realtime from bucket
   * @param {String} bucketId bucket id
   * @param {Object} [opts]
   *
   * @return {Promise}
   */
  subscribe (bucketId, opts) {
    return new Promise((resolve, reject) => {
      logger(`Request endpoints for ${bucketId}`)
      this.km.bucket.retrieve(bucketId)
        .then((res) => {
          let bucket = res.data
          let connected = false

          const endpoints = bucket.node.endpoints
          let endpoint = endpoints.realtime || endpoints.web
          endpoint = endpoint.replace('http', 'ws')
          if (this.opts.IS_DEBUG) {
            endpoint = endpoint.replace(':3000', ':4020')
          }
          loggerWS(`Found endpoint for ${bucketId} : ${endpoint}`)

          // connect websocket client to the realtime endpoint
          let socket = new WS(`${endpoint}/primus`, this.tokens.access_token)
          socket.bucketPublic = bucket.public_id
          socket.connected = false
          socket.bucket = bucketId

          let keepAliveHandler = function () {
            socket.ping()
          }
          let keepAliveInterval = null

          let onConnect = () => {
            logger(`Connected to ws endpoint : ${endpoint} (bucket: ${bucketId})`)
            socket.connected = true
            this.realtime.emit(`${bucket.public_id}:connected`)

            socket.send(JSON.stringify({
              action: 'sub',
              public_id: bucket.public_id,
              filters: Array.from(new Set(this._bucketFilters.get(bucket.public_id))) // avoid duplicates
            }))

            if (keepAliveInterval !== null) {
              clearInterval(keepAliveInterval)
              keepAliveInterval = null
            }
            keepAliveInterval = setInterval(keepAliveHandler.bind(this), 5000)
            if (!connected) {
              connected = true
              return resolve(socket)
            }
          }
          socket.onmaxreconnect = _ => {
            if (!connected) {
              connected = true
              return reject(new Error('Connection timeout'))
            }
          }
          socket.onopen = onConnect

          socket.onunexpectedresponse = (req, res) => {
            if (res.statusCode === 401) {
              return this.oauth_flow.retrieveTokens(this.km, (err, data) => {
                if (err) return logger(`Failed to retrieve tokens for ws: ${err.message}`)
                logger(`Succesfully retrieved new tokens for ws`)
                this._updateTokens(null, data, (err, authenticated) => {
                  if (err) return logger(`Failed to update tokens for ws: ${err.message}`)
                  return socket._tryReconnect()
                })
              })
            }
            return socket._tryReconnect()
          }
          socket.onerror = (err) => {
            loggerWS(`Error on ${endpoint} (bucket: ${bucketId})`)
            loggerWS(err)

            this.realtime.emit(`${bucket.public_id}:error`, err)
          }

          socket.onclose = () => {
            logger(`Closing ws connection ${endpoint} (bucket: ${bucketId})`)
            socket.connected = false
            this.realtime.emit(`${bucket.public_id}:disconnected`)

            if (keepAliveInterval !== null) {
              clearInterval(keepAliveInterval)
              keepAliveInterval = null
            }
          }

          // broadcast in the bus
          socket.onmessage = (msg) => {
            loggerWS(`Received message for bucket ${bucketId} (${(msg.data.length / 1000).toFixed(1)} Kb)`)
            let data = null
            try {
              data = JSON.parse(msg.data)
            } catch (e) {
              return loggerWS(`Receive not json message for bucket ${bucketId}`)
            }
            let packet = data.data[1]
            Object.keys(packet).forEach((event) => {
              if (event === 'server_name') return
              this.realtime.emit(`${bucket.public_id}:${packet.server_name || 'none'}:${event}`, packet[event])
            })
          }

          this._websockets.push(socket)
        }).catch(reject)
    })
  }

  /**
   * Unsubscribe realtime from bucket
   * @param {String} bucketId bucket id
   * @param {Object} [opts]
   *
   * @return {Promise}
   */
  unsubscribe (bucketId, opts) {
    return new Promise((resolve, reject) => {
      logger(`Unsubscribe from realtime for ${bucketId}`)
      let socket = this._websockets.find(socket => socket.bucket === bucketId)
      if (!socket) {
        return reject(new Error(`Realtime wasn't connected to ${bucketId}`))
      }
      socket.close(1000, 'Disconnecting')
      logger(`Succesfully unsubscribed from realtime for ${bucketId}`)
      return resolve()
    })
  }
}
