// execute an array of asynchronous functions in parallel
// @param {Array} fns - an array of functions
// @param {Function} done - callback(err, results)
function parallel (fns, options, done) {
  if (typeof options === 'function') {
    done = options
    options = {}
  }

  let keys
  if (!Array.isArray(fns)) { keys = Object.keys(fns) }
  const length = keys ? keys.length : fns.length
  let pending = length
  const results = keys ? {} : []

  function each (i, err, result) {
    results[i] = result

    if (--pending === 0 || (err && !options.graceful)) {
      if (options.graceful && err && length > 1) {
        err = null
      }

      done && done(err, results)
      done = null
    }
  }

  if (keys) {
    keys.forEach(function (key) {
      fns[key](function (err, res) {
        each(key, err, res)
      })
    })
  } else {
    fns.forEach(function (fn, i) {
      fn(function (err, res) {
        each(i, err, res)
      })
    })
  }
}

module.exports = parallel
