"use strict";

var _validationMap;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MISSING_QUERY = 'missing_query';
var OUTPUT_ARG_MUST_BE_STRING = 'output_arg_must_be_string';
var MUST_END_IN_JSON = 'must_end_in_json';
var ONLY_ONE_NOT_BOTH = 'only_one_not_both';

function getError(reason) {
  return {
    valid: false,
    Error: reason
  };
}

var validationMap = (_validationMap = {}, _defineProperty(_validationMap, MISSING_QUERY, getError('Missing query')), _defineProperty(_validationMap, OUTPUT_ARG_MUST_BE_STRING, getError('Output argument must be string')), _defineProperty(_validationMap, MUST_END_IN_JSON, getError('Output argument must end in .json')), _defineProperty(_validationMap, ONLY_ONE_NOT_BOTH, getError('Can only use --no-display when --output is used as well')), _validationMap);

function getPotentialError(args) {
  var error = null;

  if (!args.query) {
    error = MISSING_QUERY;
  } else if (args.output && typeof args.output !== 'string') {
    error = OUTPUT_ARG_MUST_BE_STRING;
  } else if (args.output && !args.output.endsWith('.json')) {
    error = MUST_END_IN_JSON;
  } else if (args['no-display'] && !args.output) {
    error = ONLY_ONE_NOT_BOTH;
  }

  return validationMap[error];
}

function validateCLIArguments(args) {
  var result = {
    valid: true
  };
  var error = getPotentialError(args);
  return error || result;
}

module.exports = validateCLIArguments;