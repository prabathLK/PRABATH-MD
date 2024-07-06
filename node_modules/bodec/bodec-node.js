module.exports = {
  Binary: Buffer,
  // Utility functions
  isBinary: Buffer.isBuffer,
  create: Buffer,
  join: Buffer.concat,

  // Binary input and output
  copy: copy,
  slice: slice,

  // String input and output
  toRaw: toRaw,
  fromRaw: fromRaw,
  toUnicode: toUnicode,
  fromUnicode: fromUnicode,
  toHex: toHex,
  fromHex: fromHex,
  toBase64: toBase64,
  fromBase64: fromBase64,

  // Array input and output
  toArray: toArray,
  fromArray: fromArray,

  // Raw <-> Hex-encoded codec
  decodeHex: decodeHex,
  encodeHex: encodeHex,

  decodeBase64: decodeBase64,
  encodeBase64: encodeBase64,

  // Unicode <-> Utf8-encoded-raw codec
  encodeUtf8: encodeUtf8,
  decodeUtf8: decodeUtf8,

  // Hex <-> Nibble codec
  nibbleToCode: nibbleToCode,
  codeToNibble: codeToNibble
};

function slice(binary, start, end) {
  return binary.slice(start, end);
}

function copy(source, binary, offset) {
  return source.copy(binary, offset);
}

// Like slice, but encode as a hex string
function toHex(binary, start, end) {
  return binary.toString('hex', start, end);
}

// Like copy, but decode from a hex string
function fromHex(hex, binary, offset) {
  if (binary) {
    binary.write(hex, offset, "hex");
    return binary;
  }
  return new Buffer(hex, 'hex');
}

function toBase64(binary, start, end) {
  return binary.toString('base64', start, end);
}

function fromBase64(base64, binary, offset) {
  if (binary) {
    binary.write(base64, offset, 'base64');
    return binary;
  }
  return new Buffer(base64, 'base64');
}

function nibbleToCode(nibble) {
  nibble |= 0;
  return (nibble + (nibble < 10 ? 0x30 : 0x57))|0;
}

function codeToNibble(code) {
  code |= 0;
  return (code - ((code & 0x40) ? 0x57 : 0x30))|0;
}

function toUnicode(binary, start, end) {
  return binary.toString('utf8', start, end);
}

function fromUnicode(unicode, binary, offset) {
  if (binary) {
    binary.write(unicode, offset, 'utf8');
    return binary;
  }
  return new Buffer(unicode, 'utf8');
}

function decodeHex(hex) {
  var j = 0, l = hex.length;
  var raw = "";
  while (j < l) {
    raw += String.fromCharCode(
       (codeToNibble(hex.charCodeAt(j++)) << 4)
      | codeToNibble(hex.charCodeAt(j++))
    );
  }
  return raw;
}

function encodeHex(raw) {
  var hex = "";
  var length = raw.length;
  for (var i = 0; i < length; i++) {
    var byte = raw.charCodeAt(i);
    hex += String.fromCharCode(nibbleToCode(byte >> 4)) +
           String.fromCharCode(nibbleToCode(byte & 0xf));
  }
  return hex;
}

function decodeBase64(base64) {
  return (new Buffer(base64, 'base64')).toString('binary');
}

function encodeBase64(raw) {
  return (new Buffer(raw, 'binary')).toString('base64');
}

function decodeUtf8(utf8) {
  return (new Buffer(utf8, 'binary')).toString('utf8');
}

function encodeUtf8(unicode) {
  return (new Buffer(unicode, 'utf8')).toString('binary');
}

function toRaw(binary, start, end) {
  return binary.toString('binary', start, end);
}

function fromRaw(raw, binary, offset) {
  if (binary) {
    binary.write(raw, offset, 'binary');
    return binary;
  }
  return new Buffer(raw, 'binary');
}

function toArray(binary, start, end) {
  if (end === undefined) {
    end = binary.length;
    if (start === undefined) start = 0;
  }
  var length = end - start;
  var array = new Array(length);
  for (var i = 0; i < length; i++) {
    array[i] = binary[i + start];
  }
  return array;
}

function fromArray(array, binary, offset) {
  if (!binary) return new Buffer(array);
  var length = array.length;
  if (offset === undefined) {
    offset = 0;
  }
  for (var i = 0; i < length; i++) {
    binary[offset + i] = array[i];
  }
  return binary;
}
