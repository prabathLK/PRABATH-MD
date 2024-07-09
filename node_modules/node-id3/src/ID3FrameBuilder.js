module.exports = ID3FrameBuilder

const ID3Util = require('./ID3Util')

function ID3FrameBuilder(identifier) {
    this._identifier = identifier
    this._buffer = Buffer.alloc(0)
}

ID3FrameBuilder.prototype.appendStaticValue = function(value, size, encoding = 0x00) {
    const convertedValue = convertValue(value, encoding)
    this._buffer = Buffer.concat([this._buffer, staticValueToBuffer(convertedValue, size)])
    return this
}

ID3FrameBuilder.prototype.appendStaticNumber = function(value, size) {
    if (!Number.isInteger(value)) {
        throw new RangeError("An integer value is expected")
    }
    let hexValue = value.toString(16)
    if(hexValue.length % 2 !== 0) {
        hexValue = "0" + hexValue
    }
    this._buffer = Buffer.concat([this._buffer, staticValueToBuffer(Buffer.from(hexValue, 'hex'), size)])
    return this
}

ID3FrameBuilder.prototype.appendNullTerminatedValue = function(value, encoding = 0x00) {
    value = value || ''
    const convertedValue = convertValue(value, encoding)
    this._buffer = Buffer.concat([this._buffer, nullTerminatedValueToBuffer(convertedValue, encoding)])
    return this
}

ID3FrameBuilder.prototype.getBuffer = function() {
    const header = Buffer.alloc(10)
    header.write(this._identifier, 0)
    header.writeUInt32BE(this._buffer.length, 4)
    return Buffer.concat([
        header,
        this._buffer
    ])
}

function convertValue(value, encoding = 0x00) {
    if (value instanceof Buffer) {
        return value
    }
    if(Number.isInteger(value)) {
        return ID3Util.stringToEncodedBuffer(value.toString(), encoding)
    }
    if (typeof value === 'string' || value instanceof String) {
        return ID3Util.stringToEncodedBuffer(value, encoding)
    }
    return Buffer.alloc(0)
}

function staticValueToBuffer(buffer, size) {
    if(!(buffer instanceof Buffer)) {
        return Buffer.alloc(0)
    }
    if(size && buffer.length < size) {
        return Buffer.concat([Buffer.alloc(size - buffer.length, 0x00), buffer])
    }
    return buffer
}

function nullTerminatedValueToBuffer(buffer, encoding) {
    return Buffer.concat([buffer, ID3Util.terminationBuffer(encoding)])
}
