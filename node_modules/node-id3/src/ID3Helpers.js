const zlib = require('zlib')
const ID3Definitions = require("./ID3Definitions")
const ID3Frames = require('./ID3Frames')
const ID3Util = require('./ID3Util')

/**
 * Returns array of buffers created by tags specified in the tags argument
 * @param tags - Object containing tags to be written
 * @returns {Array}
 */
function createBuffersFromTags(tags) {
    const frames = []
    if(!tags) {
        return frames
    }
    const rawObject = Object.keys(tags).reduce((acc, val) => {
        if(ID3Definitions.FRAME_IDENTIFIERS.v3[val] !== undefined) {
            acc[ID3Definitions.FRAME_IDENTIFIERS.v3[val]] = tags[val]
        } else if(ID3Definitions.FRAME_IDENTIFIERS.v4[val] !== undefined) {
            /**
             * Currently, node-id3 always writes ID3 version 3.
             * However, version 3 and 4 are very similar, and node-id3 can also read version 4 frames.
             * Until version 4 is fully supported, as a workaround, allow writing version 4 frames into a version 3 tag.
             * If a reader does not support a v4 frame, it's (per spec) supposed to skip it, so it should not be a problem.
             */
            acc[ID3Definitions.FRAME_IDENTIFIERS.v4[val]] = tags[val]
        } else {
            acc[val] = tags[val]
        }
        return acc
    }, {})

    Object.keys(rawObject).forEach((frameIdentifier) => {
        let frame
        // Check if invalid frameIdentifier
        if(frameIdentifier.length !== 4) {
            return
        }
        if(ID3Frames[frameIdentifier] !== undefined) {
            frame = ID3Frames[frameIdentifier].create(rawObject[frameIdentifier], 3)
        } else if(frameIdentifier.startsWith('T')) {
            frame = ID3Frames.GENERIC_TEXT.create(frameIdentifier, rawObject[frameIdentifier], 3)
        } else if(frameIdentifier.startsWith('W')) {
            if(ID3Util.getSpecOptions(frameIdentifier, 3).multiple && rawObject[frameIdentifier] instanceof Array && rawObject[frameIdentifier].length > 0) {
                frame = Buffer.alloc(0)
                // deduplicate array
                for(const url of [...new Set(rawObject[frameIdentifier])]) {
                    frame = Buffer.concat([frame, ID3Frames.GENERIC_URL.create(frameIdentifier, url, 3)])
                }
            } else {
                frame = ID3Frames.GENERIC_URL.create(frameIdentifier, rawObject[frameIdentifier], 3)
            }
        }

        if (frame && frame instanceof Buffer) {
            frames.push(frame)
        }
    })

    return frames
}

/**
 * Return a buffer with the frames for the specified tags
 * @param tags - Object containing tags to be written
 * @returns {Buffer}
 */
module.exports.createBufferFromTags = function(tags) {
    return Buffer.concat(createBuffersFromTags(tags))
}

module.exports.getTagsFromBuffer = function(filebuffer, options) {
    const framePosition = ID3Util.getFramePosition(filebuffer)
    if(framePosition === -1) {
        return getTagsFromFrames([], 3, options)
    }
    const frameSize = ID3Util.decodeSize(filebuffer.slice(framePosition + 6, framePosition + 10)) + 10
    const ID3Frame = Buffer.alloc(frameSize + 1)
    filebuffer.copy(ID3Frame, 0, framePosition)
    //ID3 version e.g. 3 if ID3v2.3.0
    const ID3Version = ID3Frame[3]
    const tagFlags = ID3Util.parseTagHeaderFlags(ID3Frame)
    let extendedHeaderOffset = 0
    if(tagFlags.extendedHeader) {
        if(ID3Version === 3) {
            extendedHeaderOffset = 4 + filebuffer.readUInt32BE(10)
        } else if(ID3Version === 4) {
            extendedHeaderOffset = ID3Util.decodeSize(filebuffer.slice(10, 14))
        }
    }
    const ID3FrameBody = Buffer.alloc(frameSize - 10 - extendedHeaderOffset)
    filebuffer.copy(ID3FrameBody, 0, framePosition + 10 + extendedHeaderOffset)

    const frames = getFramesFromID3Body(ID3FrameBody, ID3Version, options)

    return getTagsFromFrames(frames, ID3Version, options)
}

function isFrameDiscardedByOptions(frameIdentifier, options) {
    if(options.exclude instanceof Array && options.exclude.includes(frameIdentifier)) {
        return true
    }

    return options.include instanceof Array && !options.include.includes(frameIdentifier)
}

function getFramesFromID3Body(ID3TagBody, ID3Version, options = {}) {
    let currentPosition = 0
    const frames = []
    if(!ID3TagBody || !(ID3TagBody instanceof Buffer)) {
        return frames
    }

    const frameIdentifierSize = (ID3Version === 2) ? 3 : 4
    const frameHeaderSize = (ID3Version === 2) ? 6 : 10

    while(currentPosition < ID3TagBody.length && ID3TagBody[currentPosition] !== 0x00) {
        const frameHeader = ID3TagBody.subarray(currentPosition, currentPosition + frameHeaderSize)

        const frameIdentifier = frameHeader.toString('utf8', 0, frameIdentifierSize)
        const decodeSize = ID3Version === 4
        const frameBodySize = ID3Util.getFrameSize(frameHeader, decodeSize, ID3Version)
        // It's possible to discard frames via options.exclude/options.include
        // If that is the case, skip this frame and continue with the next
        if(isFrameDiscardedByOptions(frameIdentifier, options)) {
            currentPosition += frameBodySize + frameHeaderSize
            continue
        }
        // Prevent errors when the current frame's size exceeds the remaining tags size (e.g. due to broken size bytes).
        if(frameBodySize + frameHeaderSize > (ID3TagBody.length - currentPosition)) {
            break
        }

        const frameHeaderFlags = ID3Util.parseFrameHeaderFlags(frameHeader, ID3Version)
        // Frames may have a 32-bit data length indicator appended after their header,
        // if that is the case, the real body starts after those 4 bytes.
        const frameBodyOffset = frameHeaderFlags.dataLengthIndicator ? 4 : 0
        const frameBodyStart = currentPosition + frameHeaderSize + frameBodyOffset
        const frameBody = ID3TagBody.subarray(frameBodyStart, frameBodyStart + frameBodySize - frameBodyOffset)

        const frame = {
            name: frameIdentifier,
            flags: frameHeaderFlags,
            body: frameHeaderFlags.unsynchronisation ? ID3Util.processUnsynchronisedBuffer(frameBody) : frameBody
        }
        if(frameHeaderFlags.dataLengthIndicator) {
            frame.dataLengthIndicator = ID3TagBody.readInt32BE(currentPosition + frameHeaderSize)
        }
        frames.push(frame)

        //  Size of frame body + its header
        currentPosition += frameBodySize + frameHeaderSize
    }

    return frames
}

function decompressFrame(frame) {
    if(frame.body.length < 5 || frame.dataLengthIndicator === undefined) {
        return null
    }

    /*
    * ID3 spec defines that compression is stored in ZLIB format, but doesn't specify if header is present or not.
    * ZLIB has a 2-byte header.
    * 1. try if header + body decompression
    * 2. else try if header is not stored (assume that all content is deflated "body")
    * 3. else try if inflation works if the header is omitted (implementation dependent)
    * */
    let decompressedBody
    try {
        decompressedBody = zlib.inflateSync(frame.body)
    } catch (e) {
        try {
            decompressedBody = zlib.inflateRawSync(frame.body)
        } catch (e) {
            try {
                decompressedBody = zlib.inflateRawSync(frame.body.slice(2))
            } catch (e) {
                return null
            }
        }
    }
    if(decompressedBody.length !== frame.dataLengthIndicator) {
        return null
    }
    return decompressedBody
}

function getTagsFromFrames(frames, ID3Version, options = {}) {
    const tags = { }
    const raw = { }

    frames.forEach((frame) => {
        let frameIdentifier
        let identifier
        if(ID3Version === 2) {
            frameIdentifier = ID3Definitions.FRAME_IDENTIFIERS.v3[ID3Definitions.FRAME_INTERNAL_IDENTIFIERS.v2[frame.name]]
            identifier = ID3Definitions.FRAME_INTERNAL_IDENTIFIERS.v2[frame.name]
        } else if(ID3Version === 3 || ID3Version === 4) {
            /**
             * Due to their similarity, it's possible to mix v3 and v4 frames even if they don't exist in their corrosponding spec.
             * Programs like Mp3tag allow you to do so, so we should allow reading e.g. v4 frames from a v3 ID3 Tag
             */
            frameIdentifier = frame.name
            identifier = ID3Definitions.FRAME_INTERNAL_IDENTIFIERS.v3[frame.name] || ID3Definitions.FRAME_INTERNAL_IDENTIFIERS.v4[frame.name]
        }

        if(!frameIdentifier || !identifier || frame.flags.encryption) {
            return
        }

        if(frame.flags.compression) {
            const decompressedBody = decompressFrame(frame)
            if(!decompressedBody) {
                return
            }
            frame.body = decompressedBody
        }

        let decoded
        if(ID3Frames[frameIdentifier]) {
            decoded = ID3Frames[frameIdentifier].read(frame.body, ID3Version)
        } else if(frameIdentifier.startsWith('T')) {
            decoded = ID3Frames.GENERIC_TEXT.read(frame.body, ID3Version)
        } else if(frameIdentifier.startsWith('W')) {
            decoded = ID3Frames.GENERIC_URL.read(frame.body, ID3Version)
        }

        if(!decoded) {
            return
        }

        if(ID3Util.getSpecOptions(frameIdentifier, ID3Version).multiple) {
            if(!options.onlyRaw) {
                if(!tags[identifier]) {
                    tags[identifier] = []
                }
                tags[identifier].push(decoded)
            }
            if(!options.noRaw) {
                if(!raw[frameIdentifier]) {
                    raw[frameIdentifier] = []
                }
                raw[frameIdentifier].push(decoded)
            }
        } else {
            if(!options.onlyRaw) {
                tags[identifier] = decoded
            }
            if(!options.noRaw) {
                raw[frameIdentifier] = decoded
            }
        }
    })

    if(options.onlyRaw) {
        return raw
    }
    if(options.noRaw) {
        return tags
    }

    tags.raw = raw
    return tags
}

module.exports.getTagsFromID3Body = function(body) {
    return getTagsFromFrames(getFramesFromID3Body(body, 3), 3)
}
