const MISSING_QUERY = 'missing_query';
const OUTPUT_ARG_MUST_BE_STRING = 'output_arg_must_be_string';
const MUST_END_IN_JSON = 'must_end_in_json';
const ONLY_ONE_NOT_BOTH = 'only_one_not_both';

function getError(reason) {
  return { valid: false, Error: reason };
}

const validationMap = {
  [MISSING_QUERY]: getError('Missing query'),
  [OUTPUT_ARG_MUST_BE_STRING]: getError('Output argument must be string'),
  [MUST_END_IN_JSON]: getError('Output argument must end in .json'),
  [ONLY_ONE_NOT_BOTH]: getError('Can only use --no-display when --output is used as well'),
};

function getPotentialError(args) {
  let error = null;
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
  const result = { valid: true };
  const error = getPotentialError(args);
  return error || result;
}

module.exports = validateCLIArguments;
