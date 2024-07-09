/* global WebSocket */

'use strict'

const ws = require('ws')
const debug = require('debug')('kmjs:network:_ws')

const _WebSocket = typeof ws !== 'function' ? WebSocket : ws

const defaultOptions = {
  debug: false,
  automaticOpen: true,
  reconnectOnError: true,
  reconnectInterval: 1000,
  maxReconnectInterval: 10000,
  reconnectDecay: 1,
  timeoutInterval: 2000,
  maxReconnectAttempts: Infinity,
  randomRatio: 3,
  reconnectOnCleanClose: false
}

const ReconnectableWebSocket = function (url, token, protocols, options) {
  if (!protocols) protocols = []
  if (!options) options = []

  this.CONNECTING = 0
  this.OPEN = 1
  this.CLOSING = 2
  this.CLOSED = 3

  this._url = url
  this._token = token
  this._protocols = protocols
  this._options = Object.assign({}, defaultOptions, options)
  this._messageQueue = []
  this._reconnectAttempts = 0
  this.readyState = this.CONNECTING

  if (typeof this._options.debug === 'function') {
    this._debug = this._options.debug
  } else if (this._options.debug) {
    this._debug = console.log.bind(console)
  } else {
    this._debug = function () {}
  }

  if (this._options.automaticOpen) this.open()
}

ReconnectableWebSocket.prototype.updateAuthorization = function (authorization) {
  this._token = authorization
}

ReconnectableWebSocket.prototype.open = function () {
  debug('open')
  var socket = this._socket = new _WebSocket(`${this._url}?token=${this._token}`, this._protocols)

  if (this._options.binaryType) {
    socket.binaryType = this._options.binaryType
  }

  if (this._options.maxReconnectAttempts && this._options.maxReconnectAttempts < this._reconnectAttempts) {
    return this.onmaxreconnect()
  }

  this._syncState()

  if (socket.on) {
    socket.on('unexpected-response', this._onunexpectedresponse)
  }
  socket.onmessage = this._onmessage.bind(this)
  socket.onopen = this._onopen.bind(this)
  socket.onclose = this._onclose.bind(this)
  socket.onerror = this._onerror.bind(this)
}

ReconnectableWebSocket.prototype.send = function (data) {
  debug('send')
  if (this._socket && this._socket.readyState === _WebSocket.OPEN && this._messageQueue.length === 0) {
    this._socket.send(data)
  } else {
    this._messageQueue.push(data)
  }
}

ReconnectableWebSocket.prototype.ping = function () {
  debug('ping')
  if (this._socket.ping && this._socket && this._socket.readyState === _WebSocket.OPEN && this._messageQueue.length === 0) {
    this._socket.ping()
  }
}

ReconnectableWebSocket.prototype.close = function (code, reason) {
  debug('close')
  if (typeof code === 'undefined') code = 1000

  if (this._socket) this._socket.close(code, reason)
}

ReconnectableWebSocket.prototype._onunexpectedresponse = function (req, res) {
  debug('unexpected-response')
  this.onunexpectedresponse && this.onunexpectedresponse(req, res)
}

ReconnectableWebSocket.prototype._onmessage = function (message) {
  debug('onmessage')
  this.onmessage && this.onmessage(message)
}

ReconnectableWebSocket.prototype._onopen = function (event) {
  debug('onopen')
  this._syncState()
  this._flushQueue()
  if (this._reconnectAttempts !== 0) {
    this.onreconnect && this.onreconnect()
  }
  this._reconnectAttempts = 0

  this.onopen && this.onopen(event)
}

ReconnectableWebSocket.prototype._onclose = function (event) {
  debug('onclose', event)
  this._syncState()
  this._debug('WebSocket: connection is broken', event)

  this.onclose && this.onclose(event)

  this._tryReconnect(event)
}

ReconnectableWebSocket.prototype._onerror = function (event) {
  debug('onerror', event)
  // To avoid undetermined state, we close socket on error
  this._socket.close()
  this._syncState()

  this._debug('WebSocket: error', event)

  this.onerror && this.onerror(event)

  if (this._options.reconnectOnError) this._tryReconnect(event)
}

ReconnectableWebSocket.prototype._tryReconnect = function (event) {
  var self = this
  debug('Trying to reconnect')
  if (event.wasClean && !this._options.reconnectOnCleanClose) {
    return
  }
  setTimeout(function () {
    if (self.readyState === self.CLOSING || self.readyState === self.CLOSED) {
      self._reconnectAttempts++
      self.open()
    }
  }, this._getTimeout())
}

ReconnectableWebSocket.prototype._flushQueue = function () {
  while (this._messageQueue.length !== 0) {
    var data = this._messageQueue.shift()
    this._socket.send(data)
  }
}

ReconnectableWebSocket.prototype._getTimeout = function () {
  var timeout = this._options.reconnectInterval * Math.pow(this._options.reconnectDecay, this._reconnectAttempts)
  timeout = timeout > this._options.maxReconnectInterval ? this._options.maxReconnectInterval : timeout
  return this._options.randomRatio ? getRandom(timeout / this._options.randomRatio, timeout) : timeout
}

ReconnectableWebSocket.prototype._syncState = function () {
  this.readyState = this._socket.readyState
}

function getRandom (min, max) {
  return Math.random() * (max - min) + min
}

module.exports = ReconnectableWebSocket
