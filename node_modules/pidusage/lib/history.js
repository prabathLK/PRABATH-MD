'use strict'
const DEFAULT_MAXAGE = 60000

const expiration = {}
const history = {}
const expireListeners = {}

let size = 0
let interval = null

function get (pid, maxage) {
  if (maxage <= 0) {
    return
  }

  if (history[pid] !== undefined) {
    expiration[pid] = Date.now() + (maxage || DEFAULT_MAXAGE)
  }

  return history[pid]
}

function set (pid, object, maxage, onExpire) {
  if (object === undefined || maxage <= 0) return

  expiration[pid] = Date.now() + (maxage || DEFAULT_MAXAGE)
  if (history[pid] === undefined) {
    size++
    sheduleInvalidator(maxage)
  }

  history[pid] = object
  if (onExpire) {
    expireListeners[pid] = onExpire
  }
}

function sheduleInvalidator (maxage) {
  if (size > 0) {
    if (interval === null) {
      interval = setInterval(runInvalidator, (maxage || DEFAULT_MAXAGE) / 2)
      if (typeof interval.unref === 'function') {
        interval.unref()
      }
    }

    return
  }

  if (interval !== null) {
    clearInterval(interval)
    interval = null
  }
}

function runInvalidator () {
  const now = Date.now()
  const pids = Object.keys(expiration)
  for (let i = 0; i < pids.length; i++) {
    const pid = pids[i]
    if (expiration[pid] < now) {
      size--
      if (expireListeners[pid]) {
        expireListeners[pid](history[pid])
      }

      delete history[pid]
      delete expiration[pid]
      delete expireListeners[pid]
    }
  }
  sheduleInvalidator()
}

function deleteLoop (obj) { for (const i in obj) { delete obj[i] } }

function clear () {
  if (interval !== null) {
    clearInterval(interval)
    interval = null
  }

  deleteLoop(history)
  deleteLoop(expiration)
  deleteLoop(expireListeners)
}

module.exports = {
  get: get,
  set: set,
  clear: clear
}
