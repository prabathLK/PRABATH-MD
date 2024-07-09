const fs = require('fs')
const ID3Definitions = require("./src/ID3Definitions")
const ID3Util = require('./src/ID3Util')
const ID3Helpers = require('./src/ID3Helpers')
const { isFunction, isString } = require('./src/util')

/*
**  Used specification: http://id3.org/id3v2.3.0
*/

/**
 * Checks and removes already written ID3-Frames from a buffer
 * @param {Buffer} data
 * @returns {boolean|Buffer}
 */
function removeTagsFromBuffer(data) {
    const framePosition = ID3Util.getFramePosition(data)

    if (framePosition === -1) {
        return data
    }

    const encodedSize = data.slice(framePosition + 6, framePosition + 10)
    if (!ID3Util.isValidEncodedSize(encodedSize)) {
        return false
    }

    if (data.length >= framePosition + 10) {
        const size = ID3Util.decodeSize(encodedSize)
        return Buffer.concat([
            data.slice(0, framePosition),
            data.slice(framePosition + size + 10)
        ])
    }

    return data
}

function writeInBuffer(tags, buffer) {
    buffer = removeTagsFromBuffer(buffer) || buffer
    return Buffer.concat([tags, buffer])
}

function writeAsync(tags, filebuffer, fn) {
    if(isString(filebuffer)) {
        try {
            fs.readFile(filebuffer, (error, data) => {
                if(error) {
                    fn(error)
                    return
                }
                const newData = writeInBuffer(tags, data)
                fs.writeFile(filebuffer, newData, 'binary', (error) => {
                    fn(error)
                })
            })
        } catch(error) {
            fn(error)
        }
    } else {
        fn(null, writeInBuffer(tags, filebuffer))
    }
}

function writeSync(tags, filebuffer) {
    if(isString(filebuffer)) {
        try {
            const data = fs.readFileSync(filebuffer)
            const newData = writeInBuffer(tags, data)
            fs.writeFileSync(filebuffer, newData, 'binary')
            return true
        } catch(error) {
            return error
        }
    }

    return writeInBuffer(tags, filebuffer)
}

/**
 * Write passed tags to a file/buffer
 * @param tags - Object containing tags to be written
 * @param filebuffer - Can contain a filepath string or buffer
 * @param fn - (optional) Function for async version
 * @returns {boolean|Buffer|Error}
 */
function write(tags, filebuffer, fn) {
    const completeTags = create(tags)

    if(isFunction(fn)) {
        return writeAsync(completeTags, filebuffer, fn)
    }
    return writeSync(completeTags, filebuffer)
}

/**
 * Creates a buffer containing the ID3 Tag
 * @param tags - Object containing tags to be written
 * @param fn fn - (optional) Function for async version
 * @returns {Buffer}
 */
function create(tags, fn) {
    const frames = ID3Helpers.createBufferFromTags(tags)

    //  Create ID3 header
    const header = Buffer.alloc(10)
    header.fill(0)
    header.write("ID3", 0)              //File identifier
    header.writeUInt16BE(0x0300, 3)     //Version 2.3.0  --  03 00
    header.writeUInt16BE(0x0000, 5)     //Flags 00
    ID3Util.encodeSize(frames.length).copy(header, 6)

    const id3Data = Buffer.concat([header, frames])

    if(isFunction(fn)) {
        fn(id3Data)
        return undefined
    }
    return id3Data
}

function readSync(filebuffer, options) {
    if(isString(filebuffer)) {
        filebuffer = fs.readFileSync(filebuffer)
    }
    return ID3Helpers.getTagsFromBuffer(filebuffer, options)
}

function readAsync(filebuffer, options, fn) {
    if(isString(filebuffer)) {
        fs.readFile(filebuffer, (error, data) => {
            if(error) {
                fn(error, null)
            } else {
                fn(null, ID3Helpers.getTagsFromBuffer(data, options))
            }
        })
    } else {
        fn(null, ID3Helpers.getTagsFromBuffer(filebuffer, options))
    }
}

/**
 * Read ID3-Tags from passed buffer/filepath
 * @param filebuffer - Can contain a filepath string or buffer
 * @param options - (optional) Object containing options
 * @param fn - (optional) Function for async version
 * @returns {boolean}
 */
function read(filebuffer, options, fn) {
    if(!options || typeof options === 'function') {
        fn = fn || options
        options = {}
    }
    if(isFunction(fn)) {
        return readAsync(filebuffer, options, fn)
    }
    return readSync(filebuffer, options)
}

/**
 * Update ID3-Tags from passed buffer/filepath
 * @param tags - Object containing tags to be written
 * @param filebuffer - Can contain a filepath string or buffer
 * @param options - (optional) Object containing options
 * @param fn - (optional) Function for async version
 * @returns {boolean|Buffer|Error}
 */
function update(tags, filebuffer, options, fn) {
    if(!options || typeof options === 'function') {
        fn = fn || options
        options = {}
    }

    const rawTags = Object.keys(tags).reduce((acc, val) => {
        if(ID3Definitions.FRAME_IDENTIFIERS.v3[val] !== undefined) {
            acc[ID3Definitions.FRAME_IDENTIFIERS.v3[val]] = tags[val]
        } else {
            acc[val] = tags[val]
        }
        return acc
    }, {})

    const updateFn = (currentTags) => {
        currentTags = currentTags.raw || {}
        Object.keys(rawTags).map((frameIdentifier) => {
            const options = ID3Util.getSpecOptions(frameIdentifier, 3)
            const cCompare = {}
            if(options.multiple && currentTags[frameIdentifier] && rawTags[frameIdentifier]) {
                if(options.updateCompareKey) {
                    currentTags[frameIdentifier].forEach((cTag, index) => {
                        cCompare[cTag[options.updateCompareKey]] = index
                    })

                }
                if (!(rawTags[frameIdentifier] instanceof Array)) {
                    rawTags[frameIdentifier] = [rawTags[frameIdentifier]]
                }
                rawTags[frameIdentifier].forEach((rTag) => {
                    const comparison = cCompare[rTag[options.updateCompareKey]]
                    if (comparison !== undefined) {
                        currentTags[frameIdentifier][comparison] = rTag
                    } else {
                        currentTags[frameIdentifier].push(rTag)
                    }
                })
            } else {
                currentTags[frameIdentifier] = rawTags[frameIdentifier]
            }
        })
        return currentTags
    }

    if(isFunction(fn)) {
        return write(updateFn(read(filebuffer, options)), filebuffer, fn)
    }
    return write(updateFn(read(filebuffer, options)), filebuffer)
}

/**
 * @param {string} filepath - Filepath to file
 * @returns {boolean|Error}
 */
function removeTagsSync(filepath) {
    let data
    try {
        data = fs.readFileSync(filepath)
    } catch(error) {
        return error
    }

    const newData = removeTagsFromBuffer(data)
    if(!newData) {
        return false
    }

    try {
        fs.writeFileSync(filepath, newData, 'binary')
    } catch(error) {
        return error
    }

    return true
}

/**
 * @param {string} filepath - Filepath to file
 * @param {(error: Error) => void} fn - Function for async usage
 * @returns {void}
 */
function removeTagsAsync(filepath, fn) {
    fs.readFile(filepath, (error, data) => {
        if(error) {
            fn(error)
            return
        }

        const newData = removeTagsFromBuffer(data)
        if(!newData) {
            fn(error)
            return
        }

        fs.writeFile(filepath, newData, 'binary', (error) => {
            if(error) {
                fn(error)
            } else {
                fn(null)
            }
        })
    })
}

/**
 * Checks and removes already written ID3-Frames from a file
 * @param {string} filepath - Filepath to file
 * @param fn - (optional) Function for async usage
 * @returns {boolean|Error}
 */
function removeTags(filepath, fn) {
    if(isFunction(fn)) {
        return removeTagsAsync(filepath, fn)
    }
    return removeTagsSync(filepath)
}

function makeSwapParameters(fn) {
    return (a, b) => fn(b, a)
}

// The reorderParameter is a workaround because the callback function
// does not have a consistent interface between all the API functions.
// Ideally, all the functions should align with the promise style and
// always have the result first and the error second.
// Changing this would break the current public API.
// This could be changed internally and swap the parameter in a light
// wrapper when creating the public interface and then remove in a
// version 1.0 later with an API breaking change.
function makePromise(
    fn,
    reorderParameters = fn => (a, b) => fn(a, b)
) {
    return new Promise((resolve, reject) => {
        fn(reorderParameters((error, result) => {
            if(error) {
                reject(error)
            } else {
                resolve(result)
            }
        }))
    })
}

const PromiseExport = {
    create: (tags) => makePromise(create.bind(null, tags), makeSwapParameters),
    write: (tags, file) => makePromise(write.bind(null, tags, file)),
    update: (tags, file, options) => makePromise(update.bind(null, tags, file, options)),
    read: (file, options) => makePromise(read.bind(null, file, options)),
    removeTags: (filepath) => makePromise(removeTags.bind(null, filepath))
}

module.exports = {
    TagConstants: ID3Definitions.TagConstants,
    create,
    write,
    update,
    read,
    removeTags,
    removeTagsFromBuffer,
    Promise: PromiseExport
}
