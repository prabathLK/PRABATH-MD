
'use strict'

module.exports = class RequestValidator {
  /**
   * Extract httpOptions from the endpoint definition
   * and the data given by the user
   *
   * @param {Object} endpoint endpoint definition
   * @param {Array} args arguments given by the user
   * @return {Promise} resolve to the http options need to make the request
   */
  static extract (endpoint, args) {
    let isDefined = val => val !== null && typeof val !== 'undefined'

    return new Promise((resolve, reject) => {
      let httpOpts = {
        params: {},
        data: {},
        url: endpoint.route.name + '',
        method: endpoint.route.type,
        authentication: endpoint.authentication || false
      }

      switch (endpoint.route.type) {
        // GET request, we assume data will only be in the query or url params
      case 'GET': {
        for (let param of (endpoint.params || [])) {
          let value = args.shift()
          // params should always be a string since they will be replaced in the url
          if (typeof value !== 'string' && param.optional === false) {
            return reject(new Error(`Expected to receive string argument for ${param.name} to match but got ${value}`))
          }
          if (value) {
            // if value is given, use it
            httpOpts.url = httpOpts.url.replace(param.name, value)
          } else if (param.optional === false && param.defaultvalue !== null) {
            // use default value if available
            httpOpts.url = httpOpts.url.replace(param.name, param.defaultvalue)
          }
        }
        for (let param of (endpoint.query || [])) {
          let value = args.shift()
          // query should always be a string since they will be replaced in the url
          if (typeof value !== 'string' && param.optional === false) {
            return reject(new Error(`Expected to receive string argument for ${param.name} query but got ${value}`))
          }
          // set query value
          if (value) {
            // if value is given, use it
            httpOpts.params[param.name] = value
          } else if (param.optional === false && param.defaultvalue !== null) {
            // use default value if available
            httpOpts.params[param.name] = param.defaultvalue
          }
        }
        break
      }
        // for PUT, POST and PATCH request, only params and body are authorized
      case 'PUT':
      case 'POST':
      case 'PATCH': {
        for (let param of (endpoint.params || [])) {
          let value = args.shift()
          // params should always be a string since they will be replaced in the url
          if (typeof value !== 'string' && param.optional === false) {
            return reject(new Error(`Expected to receive string argument for ${param.name} to match but got ${value}`))
          }
          // replace param in url
          if (value) {
            // if value is given, use it
            httpOpts.url = httpOpts.url.replace(param.name, value)
          } else if (param.optional === false && param.defaultvalue !== null) {
            // use default value if available
            httpOpts.url = httpOpts.url.replace(param.name, param.defaultvalue)
          }
        }
        for (let param of (endpoint.query || [])) {
          let value = args.shift()
          // query should always be a string since they will be replaced in the url
          if (typeof value !== 'string' && param.optional === false) {
            return reject(new Error(`Expected to receive string argument for ${param.name} query but got ${value}`))
          }
          // set query value
          if (value) {
            // if value is given, use it
            httpOpts.params[param.name] = value
          } else if (param.optional === false && param.defaultvalue !== null) {
            // use default value if available
            httpOpts.params[param.name] = param.defaultvalue
          }
        }
        // if we don't have any arguments, break
        if (args.length === 0) break
        let data = args[0]
        if (typeof data !== 'object' && endpoint.body.length > 0) {
          return reject(new Error(`Expected to receive an object for post data but received ${typeof data}`))
        }
        for (let field of (endpoint.body || [])) {
          let isSubfield = field.name.includes('[]') === true

          // verify that the mandatory field are here
          if (!isDefined(data[field.name]) && isSubfield === false && field.optional === false && field.defaultvalue === null) {
            return reject(new Error(`Missing mandatory field ${field.name} to make a POST request on ${endpoint.route.name}`))
          }
          // verify that the mandatory field are the good type
          if (typeof data[field.name] !== field.type && isSubfield === false && field.optional === false && field.defaultvalue === null) { // eslint-disable-line
            return reject(new Error(`Invalid type for field ${field.name}, expected ${field.type} but got ${typeof data[field.name]}`))
          }

          // add it to the request only when its present
          if (isDefined(data[field.name])) {
            httpOpts.data[field.name] = data[field.name]
          }

          // or else its not optional and has a default value
          if (field.optional === false && field.defaultvalue !== null) {
            httpOpts.data[field.name] = field.defaultvalue
          }
        }
        break
      }
        // DELETE can have params or query parameters
      case 'DELETE': {
        for (let param of (endpoint.params || [])) {
          let value = args.shift()
          // params should always be a string since they will be replaced in the url
          if (typeof value !== 'string' && param.optional === false) {
            return reject(new Error(`Expected to receive string argument for ${param.name} to match but got ${value}`))
          }
          // replace param in url
          if (value) {
            // if value is given, use it
            httpOpts.url = httpOpts.url.replace(param.name, value)
          } else if (param.optional === false && param.defaultvalue !== null) {
            // use default value if available
            httpOpts.url = httpOpts.url.replace(param.name, param.defaultvalue)
          }
        }
        for (let param of (endpoint.query || [])) {
          let value = args.shift()
          // query should always be a string
          if (typeof value !== 'string' && param.optional === false) {
            return reject(new Error(`Expected to receive string argument for ${param.name} query but got ${value}`))
          }
          // replace param in url
          if (value) {
            // if value is given, use it
            httpOpts.params[param.name] = value
          } else if (param.optional === false && param.defaultvalue !== null) {
            // use default value if available
            httpOpts.params[param.name] = param.defaultvalue
          }
        }
        break
      }
      default: {
        return reject(new Error(`Invalid endpoint declaration, invalid method ${endpoint.route.type} found`))
      }
      }
      return resolve(httpOpts)
    })
  }
}
