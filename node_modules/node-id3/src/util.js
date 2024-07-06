/**
 * @param {any} value
 * @returns {boolean} true if value is a function
 */
 module.exports.isFunction = (value) => typeof value === 'function'

 /**
  * @param {any} value
  * @returns  {boolean} true if value is a string
  */
 module.exports.isString = (value) => typeof value === 'string' || value instanceof String
