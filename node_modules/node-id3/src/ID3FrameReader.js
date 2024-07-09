module.exports = ID3FrameReader

const ID3Util = require('./ID3Util')

function ID3FrameReader(buffer, encodingBytePosition, consumeEncodingByte = true) {
    if(!buffer || !(buffer instanceof Buffer)) {
        buffer = Buffer.alloc(0)
    }
    if(Number.isInteger(encodingBytePosition)) {
        this._encoding = buffer[encodingBytePosition] ? buffer[encodingBytePosition] : 0x00
        if(consumeEncodingByte) {
            buffer = encodingBytePosition === 0 ? buffer.slice(1) : Buffer.concat([buffer.slice(0, encodingBytePosition), buffer.slice(encodingBytePosition)])
        }
    } else {
        this._encoding = 0x00
    }
    this._splitBuffer = new ID3Util.SplitBuffer(null, buffer.slice(0))
}

ID3FrameReader.prototype.consumeStaticValue = function(dataType, size, encoding = this._encoding) {
    return this._consumeByFunction(() => staticValueFromBuffer(this._splitBuffer.remainder, size), dataType, encoding)
}

ID3FrameReader.prototype.consumeNullTerminatedValue = function(dataType, encoding = this._encoding) {
    return this._consumeByFunction(() => nullTerminatedValueFromBuffer(this._splitBuffer.remainder, encoding), dataType, encoding)
}

ID3FrameReader.prototype._consumeByFunction = function(fn, dataType, encoding) {
    if(!this._splitBuffer.remainder || this._splitBuffer.remainder.length === 0) {
        return undefined
    }
    this._splitBuffer = fn()
    if(dataType) {
        return convertValue(this._splitBuffer.value, dataType, encoding)
    }
    return this._splitBuffer.value
}

function convertValue(buffer, dataType, encoding = 0x00) {
    if(!buffer) {
        return undefined
    }
    if(!(buffer instanceof Buffer)) {
        return buffer
    }
    if(buffer.length === 0) {
        return undefined
    }
    if(dataType === "number") {
        return parseInt(buffer.toString('hex'), 16)
    }
    if (dataType === "string") {
        return ID3Util.bufferToDecodedString(buffer, encoding)
    }
    return buffer
}

function staticValueFromBuffer(buffer, size) {
    if(size === undefined || size === null) {
        size = buffer.length
    }
    if(buffer.length > size) {
        return new ID3Util.SplitBuffer(buffer.slice(0, size), buffer.slice(size))
    }
    return new ID3Util.SplitBuffer(buffer.slice(0), null)
}

function nullTerminatedValueFromBuffer(buffer, encoding = 0x00) {
    return ID3Util.splitNullTerminatedBuffer(buffer, encoding)
}
