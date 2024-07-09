
const stringify = require('json-stringify-safe')

module.exports = {

  /**
   * Sends an Event
   * @memberof TX2
   * @param {string} name Name of the event
   * @param {object} data Metadata attached to the event
   * @example
   * tx2.event('event-name', { multi: 'data' })
   */
  event(name, data) {
    if (!name)
      return console.error('[AXM] emit.name is missing')

    let inflight_obj = {}

    if (typeof(data) == 'object')
      inflight_obj = JSON.parse(stringify(data))
    else {
      inflight_obj.data = data || null
    }

    inflight_obj.__name = name

    this.send({
      type : 'human:event',
      data : inflight_obj
    })
  }
}
