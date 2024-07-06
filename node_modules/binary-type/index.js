var matchers = require('./matchers');
var knownTypes = Object.keys(matchers);
var toBuffer = require('typedarray-to-buffer');
var processors = require('./processors');

/**
  # binary-type

  A simple package that provides the ability to check if a buffer matches
  a specific mimetype, and secondly the ability to guess a mimetype given
  a buffer.

  ## Reference
**/

/**
  ### `matches(mimetype, buffer) => Boolean`

  Return true if the supplied `buffer` has a binary file signature that
  matches what is expected for the specified `mimetype`.

**/
function matches(mimetype, buffer) {
  var checks = matchers[mimetype];
  var passedChecks;

  // ensure the buffer is a buffer
  if (! Buffer.isBuffer(buffer)) {
    buffer = toBuffer(buffer);
  }

  // Run the buffer through the preprocessors
  buffer = processors(buffer);

  passedChecks = checks && checks.filter(function(check) {
    return check(buffer);
  });

  return passedChecks && passedChecks.length === checks.length;
};

/**
  ### `guess(buffer) => String`

  Run the supplied `buffer` through the various known mimetypes to attempt
  to determine it's mimetype (returned as a string value if found).

  __NOTE:__ Only a few file signatures have been implemented at this stage,
  but feel free to issue a pull request if you require additional types. A
  good resource of binary file signatures can be found at the following url:

  <http://www.garykessler.net/library/file_sigs.html>

**/
function guess(buffer) {
  var ii = 0;
  var count = knownTypes.length;

  while (ii < count) {
    if (matches(knownTypes[ii], buffer)) {
      return knownTypes[ii];
    }

    ii++;
  }

  return null;
};

exports.matches = matches;
exports.guess = guess;
