
module.exports = {
  /**
   * Expose an action/function triggerable via PM2 or PM2.io
   * @memberof TX2
   * @param {string} action_name Name of the action
   * @param {object} [opts] Optional parameter
   * @param {function} fn Function to be called
   *
   * @example <caption>Action without arguments</caption>
   * tx2.action('run_query', (cb) => {
   *   cb({ success: true })
   * })
   * @example <caption>Action with arguments</caption>
   * tx2.action('run_query', arg1, (cb) => {
   *   cb({ success: arg1 })
   * })
   */
  action(action_name, opts, fn) {
    if (!fn) {
      fn = opts
      opts = null
    }

    if (!action_name)
      return console.error('[PMX] action.action_name is missing')
    if (!fn)
      return console.error('[PMX] emit.data is mission')

    // Notify the action
    this.send({
      type : 'axm:action',
      data : {
        action_name : action_name,
        opts        : opts,
        arity       : fn.length
      }
    })

    let reply = (data) => {
      if (data.length) {
        data._length = data.length
        delete data.length
      }

      this.send({
        type        : 'axm:reply',
        data        : {
          return      : data,
          action_name : action_name
        }
      })
    }

    process.on('message', (data) => {
      if (!data) return false

      // Notify the action
      if (data && (data == action_name || data.msg == action_name))
        this.event('action triggered', { action_name, opts })

      // In case 2 arguments has been set but no options has been transmitted
      if (fn.length === 2 && typeof(data) === 'string' && data === action_name)
        return fn({}, reply)

      // In case 1 arguments has been set but options has been transmitted
      if (fn.length === 1 && typeof(data) === 'object' && data.msg === action_name)
        return fn(reply)

      /**
       * Classical call
       */
      if (typeof(data) === 'string' && data === action_name)
        return fn(reply)

      /**
       * If data is an object == v2 protocol
       * Pass the opts as first argument
       */
      if (typeof(data) === 'object' && data.msg === action_name)
        return fn(data.opts, reply)
    })
  }
}
