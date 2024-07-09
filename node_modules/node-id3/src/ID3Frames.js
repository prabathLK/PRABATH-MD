const fs = require('fs')
const ID3FrameBuilder = require("./ID3FrameBuilder")
const ID3FrameReader = require("./ID3FrameReader")
const ID3Definitions = require("./ID3Definitions")
const ID3Util = require("./ID3Util")
const ID3Helpers = require('./ID3Helpers')
const { isString } = require('./util')

module.exports.GENERIC_TEXT = {
    create: (frameIdentifier, data) => {
        if(!frameIdentifier || !data) {
            return null
        }

        return new ID3FrameBuilder(frameIdentifier)
            .appendStaticNumber(0x01, 0x01)
            .appendStaticValue(data, null, 0x01)
            .getBuffer()
    },
    read: (buffer) => {
        const reader = new ID3FrameReader(buffer, 0)

        return reader.consumeStaticValue('string')
    }
}

module.exports.GENERIC_URL = {
    create: (frameIdentifier, data) => {
        if(!frameIdentifier || !data) {
            return null
        }

        return new ID3FrameBuilder(frameIdentifier)
            .appendStaticValue(data)
            .getBuffer()
    },
    read: (buffer) => {
        const reader = new ID3FrameReader(buffer)

        return reader.consumeStaticValue('string')
    }
}

module.exports.APIC = {
    create: (data) => {
        try {
            if (data instanceof Buffer) {
                data = {
                    imageBuffer: Buffer.from(data)
                }
            } else if (isString(data)) {
                data = {
                    imageBuffer: fs.readFileSync(data)
                }
            } else if (!data.imageBuffer) {
                return Buffer.alloc(0)
            }

            let mime_type = data.mime

            if(!mime_type) {
                mime_type = ID3Util.getPictureMimeTypeFromBuffer(data.imageBuffer)
            }

            const TagConstants = ID3Definitions.TagConstants.AttachedPicture
            const pictureType = data.type || {}
            const pictureTypeId = pictureType.id === undefined
                ? TagConstants.PictureType.FRONT_COVER : pictureType.id

            /*
             * Fix a bug in iTunes where the artwork is not recognized when the description is empty using UTF-16.
             * Instead, if the description is empty, use encoding 0x00 (ISO-8859-1).
             */
            const { description = '' } = data
            const encoding = description ? 0x01 : 0x00
            return new ID3FrameBuilder('APIC')
              .appendStaticNumber(encoding, 1)
              .appendNullTerminatedValue(mime_type)
              .appendStaticNumber(pictureTypeId, 1)
              .appendNullTerminatedValue(description, encoding)
              .appendStaticValue(data.imageBuffer)
              .getBuffer()
        } catch(error) {
            return error
        }
    },
    read: (buffer, version) => {
        const reader = new ID3FrameReader(buffer, 0)
        let mime
        if(version === 2) {
            mime = reader.consumeStaticValue('string', 3, 0x00)
        } else {
            mime = reader.consumeNullTerminatedValue('string', 0x00)
        }

        const typeId = reader.consumeStaticValue('number', 1)
        const description = reader.consumeNullTerminatedValue('string')
        const imageBuffer = reader.consumeStaticValue()

        return {
            mime: mime,
            type: {
                id: typeId,
                name: ID3Definitions.APIC_TYPES[typeId]
            },
            description: description,
            imageBuffer: imageBuffer
        }
    }
}

module.exports.COMM = {
    create: (data) => {
        data = data || {}
        if(!data.text) {
            return null
        }

        return new ID3FrameBuilder("COMM")
            .appendStaticNumber(0x01, 1)
            .appendStaticValue(data.language)
            .appendNullTerminatedValue(data.shortText, 0x01)
            .appendStaticValue(data.text, null, 0x01)
            .getBuffer()
    },
    read: (buffer) => {
        const reader = new ID3FrameReader(buffer, 0)

        return {
            language: reader.consumeStaticValue('string', 3, 0x00),
            shortText: reader.consumeNullTerminatedValue('string'),
            text: reader.consumeStaticValue('string', null)
        }
    }
}

module.exports.USLT = {
    create: (data) => {
        data = data || {}
        if(isString(data)) {
            data = {
                text: data
            }
        }
        if(!data.text) {
            return null
        }

        return new ID3FrameBuilder("USLT")
            .appendStaticNumber(0x01, 1)
            .appendStaticValue(data.language)
            .appendNullTerminatedValue(data.shortText, 0x01)
            .appendStaticValue(data.text, null, 0x01)
            .getBuffer()
    },
    read: (buffer) => {
        const reader = new ID3FrameReader(buffer, 0)

        return {
            language: reader.consumeStaticValue('string', 3, 0x00),
            shortText: reader.consumeNullTerminatedValue('string'),
            text: reader.consumeStaticValue('string', null)
        }
    }
}

module.exports.SYLT = {
    create: (data) => {
        if(!(data instanceof Array)) {
            data = [data]
        }

        const encoding = 1 // 16 bit unicode
        return Buffer.concat(data.map(lycics => {
            const frameBuilder = new ID3FrameBuilder("SYLT")
                .appendStaticNumber(encoding, 1)
                .appendStaticValue(lycics.language, 3)
                .appendStaticNumber(lycics.timeStampFormat, 1)
                .appendStaticNumber(lycics.contentType, 1)
                .appendNullTerminatedValue(lycics.shortText, encoding)
            lycics.synchronisedText.forEach(part => {
                frameBuilder.appendNullTerminatedValue(part.text, encoding)
                frameBuilder.appendStaticNumber(part.timeStamp, 4)
            })
            return frameBuilder.getBuffer()
        }))
    },
    read: (buffer) => {
        const reader = new ID3FrameReader(buffer, 0)

        return {
            language: reader.consumeStaticValue('string', 3, 0x00),
            timeStampFormat: reader.consumeStaticValue('number', 1),
            contentType: reader.consumeStaticValue('number', 1),
            shortText: reader.consumeNullTerminatedValue('string'),
            synchronisedText: Array.from((function*() {
                while(true) {
                    const text = reader.consumeNullTerminatedValue('string')
                    const timeStamp = reader.consumeStaticValue('number', 4)
                    if (text === undefined || timeStamp === undefined) {
                        break
                    }
                    yield {text, timeStamp}
                }
            })())
        }
    }
}

module.exports.TXXX = {
    create: (data) => {
        if(!(data instanceof Array)) {
            data = [data]
        }

        return Buffer.concat(data.map(udt => new ID3FrameBuilder("TXXX")
            .appendStaticNumber(0x01, 1)
            .appendNullTerminatedValue(udt.description, 0x01)
            .appendStaticValue(udt.value, null, 0x01)
            .getBuffer()))
    },
    read: (buffer) => {
        const reader = new ID3FrameReader(buffer, 0)

        return {
            description: reader.consumeNullTerminatedValue('string'),
            value: reader.consumeStaticValue('string')
        }
    }
}

module.exports.POPM = {
    create: (data) => {
        const email = data.email
        let rating = Math.trunc(data.rating)
        let counter = Math.trunc(data.counter)
        if(!email) {
            return null
        }
        if(isNaN(rating) || rating < 0 || rating > 255) {
            rating = 0
        }
        if(isNaN(counter) || counter < 0) {
            counter = 0
        }

        return new ID3FrameBuilder("POPM")
            .appendNullTerminatedValue(email)
            .appendStaticNumber(rating, 1)
            .appendStaticNumber(counter, 4)
            .getBuffer()
    },
    read: (buffer) => {
        const reader = new ID3FrameReader(buffer)
        return {
            email: reader.consumeNullTerminatedValue('string'),
            rating: reader.consumeStaticValue('number', 1),
            counter: reader.consumeStaticValue('number')
        }
    }
}

module.exports.PRIV = {
    create: (data) => {
        if(!(data instanceof Array)) {
            data = [data]
        }

        return Buffer.concat(data.map(priv => new ID3FrameBuilder("PRIV")
            .appendNullTerminatedValue(priv.ownerIdentifier)
            .appendStaticValue(priv.data instanceof Buffer ? priv.data : Buffer.from(priv.data, "utf8"))
            .getBuffer()))
    },
    read: (buffer) => {
        const reader = new ID3FrameReader(buffer)
        return {
            ownerIdentifier: reader.consumeNullTerminatedValue('string'),
            data: reader.consumeStaticValue()
        }
    }
}

module.exports.UFID = {
    create: (data) => {
        if (!(data instanceof Array)) {
            data = [data]
        }

        return Buffer.concat(data.map(ufid => new ID3FrameBuilder("UFID")
            .appendNullTerminatedValue(ufid.ownerIdentifier)
            .appendStaticValue(
                ufid.identifier instanceof Buffer ?
                ufid.identifier : Buffer.from(ufid.identifier, "utf8")
            )
            .getBuffer()))
    },
    read: (buffer) => {
        const reader = new ID3FrameReader(buffer)
        return {
            ownerIdentifier: reader.consumeNullTerminatedValue('string'),
            identifier: reader.consumeStaticValue()
        }
    }
}

module.exports.CHAP = {
    create: (data) => {
        if (!(data instanceof Array)) {
            data = [data]
        }

        return Buffer.concat(data.map(chap => {
            if (!chap || !chap.elementID || typeof chap.startTimeMs === "undefined" || !chap.endTimeMs) {
                return null
            }
            return new ID3FrameBuilder("CHAP")
                .appendNullTerminatedValue(chap.elementID)
                .appendStaticNumber(chap.startTimeMs, 4)
                .appendStaticNumber(chap.endTimeMs, 4)
                .appendStaticNumber(chap.startOffsetBytes ? chap.startOffsetBytes : 0xFFFFFFFF, 4)
                .appendStaticNumber(chap.endOffsetBytes ? chap.endOffsetBytes : 0xFFFFFFFF, 4)
                .appendStaticValue(ID3Helpers.createBufferFromTags(chap.tags))
                .getBuffer()
        }).filter(chap => chap instanceof Buffer))
    },
    read: (buffer) => {
        const reader = new ID3FrameReader(buffer)
        const chap = {
            elementID: reader.consumeNullTerminatedValue('string'),
            startTimeMs: reader.consumeStaticValue('number', 4),
            endTimeMs: reader.consumeStaticValue('number', 4),
            startOffsetBytes: reader.consumeStaticValue('number', 4),
            endOffsetBytes: reader.consumeStaticValue('number', 4),
            tags: ID3Helpers.getTagsFromID3Body(reader.consumeStaticValue())
        }
        if(chap.startOffsetBytes === 0xFFFFFFFF) {
            delete chap.startOffsetBytes
        }
        if(chap.endOffsetBytes === 0xFFFFFFFF) {
            delete chap.endOffsetBytes
        }
        return chap
    }
}

module.exports.CTOC = {
    create: (data) => {
        if(!(data instanceof Array)) {
            data = [data]
        }

        return Buffer.concat(data.map((toc, index) => {
            if(!toc || !toc.elementID) {
                return null
            }
            if(!(toc.elements instanceof Array)) {
                toc.elements = []
            }

            const ctocFlags = Buffer.alloc(1, 0)
            if(index === 0) {
                ctocFlags[0] += 2
            }
            if(toc.isOrdered) {
                ctocFlags[0] += 1
            }

            const builder = new ID3FrameBuilder("CTOC")
                .appendNullTerminatedValue(toc.elementID)
                .appendStaticValue(ctocFlags, 1)
                .appendStaticNumber(toc.elements.length, 1)
            toc.elements.forEach((el) => {
                builder.appendNullTerminatedValue(el)
            })
            if(toc.tags) {
                builder.appendStaticValue(ID3Helpers.createBufferFromTags(toc.tags))
            }
            return builder.getBuffer()
        }).filter((toc) => toc instanceof Buffer))
    },
    read: (buffer) => {
        const reader = new ID3FrameReader(buffer)
        const elementID = reader.consumeNullTerminatedValue('string')
        const flags = reader.consumeStaticValue('number', 1)
        const entries = reader.consumeStaticValue('number', 1)
        const elements = []
        for(let i = 0; i < entries; i++) {
            elements.push(reader.consumeNullTerminatedValue('string'))
        }
        const tags = ID3Helpers.getTagsFromID3Body(reader.consumeStaticValue())

        return {
            elementID,
            isOrdered: !!(flags & 0x01 === 0x01),
            elements,
            tags
        }
    }
}

module.exports.WXXX = {
    create: (data) => {
        if(!(data instanceof Array)) {
            data = [data]
        }

        return Buffer.concat(data.map((udu) => {
            return new ID3FrameBuilder("WXXX")
                .appendStaticNumber(0x01, 1)
                .appendNullTerminatedValue(udu.description, 0x01)
                .appendStaticValue(udu.url, null)
                .getBuffer()
        }))
    },
    read: (buffer) => {
        const reader = new ID3FrameReader(buffer, 0)

        return {
            description: reader.consumeNullTerminatedValue('string'),
            url: reader.consumeStaticValue('string', null, 0x00)
        }
    }
}

module.exports.ETCO = {
    create: (data) => {
        const builder = new ID3FrameBuilder("ETCO")
            .appendStaticNumber(data.timeStampFormat, 1)
        data.keyEvents.forEach((keyEvent) => {
            builder
                .appendStaticNumber(keyEvent.type, 1)
                .appendStaticNumber(keyEvent.timeStamp, 4)
        })

        return builder.getBuffer()
    },
    read: (buffer) => {
        const reader = new ID3FrameReader(buffer)

        return {
            timeStampFormat: reader.consumeStaticValue('number', 1),
            keyEvents: Array.from((function*() {
                while(true) {
                    const type = reader.consumeStaticValue('number', 1)
                    const timeStamp = reader.consumeStaticValue('number', 4)
                    if (type === undefined || timeStamp === undefined) {
                        break
                    }
                    yield {type, timeStamp}
                }
            })())
        }
    }
}

module.exports.COMR = {
    create: (data) => {
        if(!(data instanceof Array)) {
            data = [data]
        }

        return Buffer.concat(data.map(comr => {
            const prices = comr.prices || {}
            const builder = new ID3FrameBuilder("COMR")

            // Text encoding
            builder.appendStaticNumber(0x01, 1)
            // Price string
            const priceString = Object.entries(prices).map((price) => {
                return price[0].substring(0, 3) + price[1].toString()
            }).join('/')
            builder.appendNullTerminatedValue(priceString, 0x00)
            // Valid until
            builder.appendStaticValue(
                comr.validUntil.year.toString().padStart(4, '0').substring(0, 4) +
                comr.validUntil.month.toString().padStart(2, '0').substring(0, 2) +
                comr.validUntil.day.toString().padStart(2, '0').substring(0, 2),
                8, 0x00
            )
            // Contact URL
            builder.appendNullTerminatedValue(comr.contactUrl, 0x00)
            // Received as
            builder.appendStaticNumber(comr.receivedAs, 1)
            // Name of seller
            builder.appendNullTerminatedValue(comr.nameOfSeller, 0x01)
            // Description
            builder.appendNullTerminatedValue(comr.description, 0x01)
            // Seller logo
            if(comr.sellerLogo) {
                let picture = comr.sellerLogo.picture
                if(typeof comr.sellerLogo.picture === 'string' || comr.sellerLogo.picture instanceof String) {
                    picture = fs.readFileSync(comr.sellerLogo.picture)
                }
                let mimeType = comr.sellerLogo.mimeType || ID3Util.getPictureMimeTypeFromBuffer(picture)
                // Only image/png and image/jpeg allowed
                if(mimeType !== 'image/png' && 'image/jpeg') {
                    mimeType = 'image/'
                }

                builder.appendNullTerminatedValue(mimeType ? mimeType : '', 0x00)
                builder.appendStaticValue(picture)
            }
            return builder.getBuffer()
        }))
    },
    read: (buffer) => {
        const reader = new ID3FrameReader(buffer, 0)

        const tag = {}

        // Price string
        const priceStrings = reader.consumeNullTerminatedValue('string', 0x00)
            .split('/')
            .filter((price) => price.length > 3)
        tag.prices = {}
        for(const price of priceStrings) {
            tag.prices[price.substring(0, 3)] = price.substring(3)
        }
        // Valid until
        const validUntilString = reader.consumeStaticValue('string', 8, 0x00)
        tag.validUntil = { year: 0, month: 0, day: 0 }
        if(/^\d+$/.test(validUntilString)) {
            tag.validUntil.year = parseInt(validUntilString.substring(0, 4))
            tag.validUntil.month = parseInt(validUntilString.substring(4, 6))
            tag.validUntil.day = parseInt(validUntilString.substring(6))
        }
        // Contact URL
        tag.contactUrl = reader.consumeNullTerminatedValue('string', 0x00)
        // Received as
        tag.receivedAs = reader.consumeStaticValue('number', 1)
        // Name of seller
        tag.nameOfSeller = reader.consumeNullTerminatedValue('string')
        // Description
        tag.description = reader.consumeNullTerminatedValue('string')
        // Seller logo
        const mimeType = reader.consumeNullTerminatedValue('string', 0x00)
        const picture = reader.consumeStaticValue('buffer')
        if(picture && picture.length > 0) {
            tag.sellerLogo = {
                mimeType,
                picture
            }
        }

        return tag
    }
}
