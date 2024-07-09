const iconv = require('iconv-lite')
const ID3Definitions = require('./ID3Definitions')

const ENCODINGS = [
    'ISO-8859-1', 'UTF-16', 'UTF-16BE', 'UTF-8'
]

module.exports.SplitBuffer = class SplitBuffer {
    constructor(value = null, remainder = null) {
        this.value = value
        this.remainder = remainder
    }
}

/**
 * Expects a buffer containing a string at the beginning that is terminated by a \0 character.
 * Returns a split buffer containing the bytes before and after null termination.
 */
module.exports.splitNullTerminatedBuffer = function(buffer, encodingByte = 0x00) {
    // UTF-16/BE always uses two bytes per character.
    // \0 is therefore encoded as [0x00, 0x00] instead of just [0x00].
    // We'll do a sliding window search, window size depends on encoding.
    const charSize = [0x01, 0x02].includes(encodingByte) ? 2 : 1
    for(let pos = 0; pos + charSize - 1 < buffer.length; pos += charSize) {
        if(buffer.readUIntBE(pos, charSize) === 0) {
            return new this.SplitBuffer(
                buffer.subarray(0, pos),
                buffer.subarray(pos + charSize)
            )
        }
    }

    return new this.SplitBuffer(null, buffer.subarray(0))
}

module.exports.terminationBuffer = function(encodingByte = 0x00) {
    if(encodingByte === 0x01 || encodingByte === 0x02) {
        return Buffer.alloc(2, 0x00)
    }
    return Buffer.alloc(1, 0x00)
}

module.exports.encodingFromStringOrByte = function(encoding) {
    if(ENCODINGS.indexOf(encoding) !== -1) {
        return encoding
    } else if(encoding > -1 && encoding < ENCODINGS.length) {
        encoding = ENCODINGS[encoding]
    } else {
        encoding = ENCODINGS[0]
    }
    return encoding
}

module.exports.stringToEncodedBuffer = function(str, encodingByte) {
    return iconv.encode(str, this.encodingFromStringOrByte(encodingByte))
}

module.exports.bufferToDecodedString = function(buffer, encodingByte) {
    return iconv.decode(buffer, this.encodingFromStringOrByte(encodingByte)).replace(/\0/g, '')
}

module.exports.getSpecOptions = function(frameIdentifier) {
    if(ID3Definitions.ID3_FRAME_OPTIONS[frameIdentifier]) {
        return ID3Definitions.ID3_FRAME_OPTIONS[frameIdentifier]
    }

    return {}
}

module.exports.isValidID3Header = function(buffer) {
    if(buffer.length < 10) {
        return false
    }
    if(buffer.readUIntBE(0, 3) !== 0x494433) {
        return false
    }
    if([0x02, 0x03, 0x04].indexOf(buffer[3]) === -1 || buffer[4] !== 0x00) {
        return false
    }
    return this.isValidEncodedSize(buffer.slice(6, 10))
}

module.exports.getFramePosition = function(buffer) {
    /* Search Buffer for valid ID3 frame */
    let framePosition = -1
    let frameHeaderValid = false
    do {
        framePosition = buffer.indexOf("ID3", framePosition + 1)
        if(framePosition !== -1) {
            /* It's possible that there is a "ID3" sequence without being an ID3 Frame,
             * so we need to check for validity of the next 10 bytes
             */
            frameHeaderValid = this.isValidID3Header(buffer.slice(framePosition, framePosition + 10))
        }
    } while (framePosition !== -1 && !frameHeaderValid)

    if(!frameHeaderValid) {
        return -1
    }
    return framePosition
}

/**
 * @param {Buffer} encodedSize
 * @return {boolean} Return if the header contains a valid encoded size
 */
module.exports.isValidEncodedSize = function(encodedSize) {
    // The size must not have the bit 7 set
    return ((
        encodedSize[0] |
        encodedSize[1] |
        encodedSize[2] |
        encodedSize[3]
    ) & 128) === 0
}

/**
 * ID3 header size uses only 7 bits of a byte, bit shift is needed
 * @param {number} size
 * @return {Buffer} Return a Buffer of 4 bytes with the encoded size
 */
module.exports.encodeSize = function(size) {
    const byte_3 = size & 0x7F
    const byte_2 = (size >> 7) & 0x7F
    const byte_1 = (size >> 14) & 0x7F
    const byte_0 = (size >> 21) & 0x7F
    return Buffer.from([byte_0, byte_1, byte_2, byte_3])
}

/**
 * Decode the size encoded in the ID3 header
 * @param {Buffer} encodedSize
 * @return {number} Return the decoded size
 */
module.exports.decodeSize = function(encodedSize) {
    return (
        (encodedSize[0] << 21) +
        (encodedSize[1] << 14) +
        (encodedSize[2] << 7) +
        encodedSize[3]
    )
}

module.exports.getFrameSize = function(buffer, decode, ID3Version) {
    let decodeBytes
    if(ID3Version > 2) {
        decodeBytes = [buffer[4], buffer[5], buffer[6], buffer[7]]
    } else {
        decodeBytes = [buffer[3], buffer[4], buffer[5]]
    }
    if(decode) {
        return this.decodeSize(Buffer.from(decodeBytes))
    } else {
        return Buffer.from(decodeBytes).readUIntBE(0, decodeBytes.length)
    }
}

module.exports.parseTagHeaderFlags = function(header) {
    if(!(header instanceof Buffer && header.length >= 10)) {
        return {}
    }
    const version = header[3]
    const flagsByte = header[5]
    if(version === 3) {
        return {
            unsynchronisation: !!(flagsByte & 128),
            extendedHeader: !!(flagsByte & 64),
            experimentalIndicator: !!(flagsByte & 32)
        }
    }
    if(version === 4) {
        return {
            unsynchronisation: !!(flagsByte & 128),
            extendedHeader: !!(flagsByte & 64),
            experimentalIndicator: !!(flagsByte & 32),
            footerPresent: !!(flagsByte & 16)
        }
    }
    return {}
}

module.exports.parseFrameHeaderFlags = function(header, ID3Version) {
    if(!(header instanceof Buffer && header.length === 10)) {
        return {}
    }
    const flagsFirstByte = header[8]
    const flagsSecondByte = header[9]
    if(ID3Version === 3) {
        return {
            tagAlterPreservation: !!(flagsFirstByte & 128),
            fileAlterPreservation: !!(flagsFirstByte & 64),
            readOnly: !!(flagsFirstByte & 32),
            compression: !!(flagsSecondByte & 128),
            encryption: !!(flagsSecondByte & 64),
            groupingIdentity: !!(flagsSecondByte & 32),
            dataLengthIndicator: !!(flagsSecondByte & 128)
        }
    }
    if(ID3Version === 4) {
        return {
            tagAlterPreservation: !!(flagsFirstByte & 64),
            fileAlterPreservation: !!(flagsFirstByte & 32),
            readOnly: !!(flagsFirstByte & 16),
            groupingIdentity: !!(flagsSecondByte & 64),
            compression: !!(flagsSecondByte & 8),
            encryption: !!(flagsSecondByte & 4),
            unsynchronisation: !!(flagsSecondByte & 2),
            dataLengthIndicator: !!(flagsSecondByte & 1)
        }
    }
    return {}
}

module.exports.processUnsynchronisedBuffer = function(buffer) {
    const newDataArr = []
    if(buffer.length > 0) {
        newDataArr.push(buffer[0])
    }
    for(let i = 1; i < buffer.length; i++) {
        if(buffer[i - 1] === 0xFF && buffer[i] === 0x00)
            continue
        newDataArr.push(buffer[i])
    }
    return Buffer.from(newDataArr)
}

module.exports.getPictureMimeTypeFromBuffer = function(pictureBuffer) {
    if (pictureBuffer.length > 3 && pictureBuffer.compare(Buffer.from([0xff, 0xd8, 0xff]), 0, 3, 0, 3) === 0) {
        return "image/jpeg"
    } else if (pictureBuffer > 8 && pictureBuffer.compare(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]), 0, 8, 0, 8) === 0) {
        return "image/png"
    } else {
        return null
    }
}
