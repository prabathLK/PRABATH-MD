function compile(input) {
  var output = {};

  Object.keys(input).forEach(function(primary) {
    Object.keys(input[primary]).forEach(function(secondary) {
      var specparts = input[primary][secondary];
      output[primary + '/' + secondary] = specparts.map(createChecker);
    });
  });

  return output;
}

function createChecker(spec, partIdx) {
  var isTrailer = partIdx > 0;
  var bytes = spec.split(' ').map(function(part) {
    var byte = parseInt(part, 16);
    return isNaN(byte) ? null : byte;
  });

  return function(buffer) {
    var bufferIdx = isTrailer ? (buffer.length - bytes.length) : 0;

    return bytes.reduce(function(memo, part, idx) {
//       console.log(part, buffer[bufferIdx + idx], bufferIdx + idx, buffer.length);
      return memo && (part === null || part === buffer[bufferIdx + idx]);
    }, true);
  };
}

// compile the data blocks into useful mimetype mappings
module.exports = compile(require('./datablocks'));
