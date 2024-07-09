
const jsonize = function(err, filter, space) {
  if (typeof(err) != 'object')
    return err

  var plainObject = {}

  Object.getOwnPropertyNames(err).forEach(function(key) {
    plainObject[key] = err[key]
  })
  return plainObject
}

module.exports = {
  _interpretError: function(err) {
    var s_err = {}

    if (typeof(err) === 'string') {
      // Simple string processing
      s_err.message = err
      s_err.stack = err
    }
    else if (!(err instanceof Error) && typeof(err) === 'object') {
      // JSON processing
      s_err.message = err
      s_err.stack = err
    }
    else if (err instanceof Error) {
      // Error object type processing
      err.stack
      if (err.__error_callsites) {
        var stackFrames = []
        err.__error_callsites.forEach(function(callSite) {
          stackFrames.push({ file_name: callSite.getFileName(), line_number: callSite.getLineNumber()})
        })
        err.stackframes = stackFrames
        delete err.__error_callsites
      }
      s_err = err
    }

    return jsonize(s_err)
  },

  /**
   * Sends an Issue
   * @memberof TX2
   * @param {string|Error} err Error object or string to notify
   * @example
   * tx2.issue(new Error('bad error')
   */
  issue: function(err) {
    var ret_err = this._interpretError(err)

    this.send({
      type : 'process:exception',
      data : ret_err
    })

    return ret_err
  }
}
