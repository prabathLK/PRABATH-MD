const FRAME_IDENTIFIERS = {
    v2: {
        album:                  "TAL",
        bpm:                    "TBP",
        composer:               "TCM",
        genre:                  "TCO",
        copyright:              "TCR",
        date:                   "TDA",
        playlistDelay:          "TDY",
        encodedBy:              "TEN",
        textWriter:             "TEXT",
        fileType:               "TFT",
        time:                   "TIM",
        contentGroup:           "TT1",
        title:                  "TT2",
        subtitle:               "TT3",
        initialKey:             "TKE",
        language:               "TLA",
        length:                 "TLE",
        mediaType:              "TMT",
        originalTitle:          "TOT",
        originalFilename:       "TOF",
        originalTextwriter:     "TOL",
        originalArtist:         "TOA",
        originalYear:           "TOR",
        artist:                 "TP1",
        performerInfo:          "TP2",
        conductor:              "TP3",
        remixArtist:            "TP4",
        partOfSet:              "TPA",
        publisher:              "TPB",
        trackNumber:            "TRK",
        recordingDates:         "TRD",
        size:                   "TSI",
        ISRC:                   "TRC",
        encodingTechnology:     "TSS",
        year:                   "TYE",
        image:                  "PIC",
        commercialUrl:          "WCM",
        copyrightUrl:           "WCP",
        fileUrl:                "WAF",
        artistUrl:              "WAR",
        audioSourceUrl:         "WAS",
        publisherUrl:           "WPB",
        userDefinedUrl:         "WXX"
    },
    v3: {
        album:                  "TALB",
        bpm:                    "TBPM",
        composer:               "TCOM",
        genre:                  "TCON",
        copyright:              "TCOP",
        date:                   "TDAT",
        playlistDelay:          "TDLY",
        encodedBy:              "TENC",
        textWriter:             "TEXT",
        fileType:               "TFLT",
        time:                   "TIME",
        contentGroup:           "TIT1",
        title:                  "TIT2",
        subtitle:               "TIT3",
        initialKey:             "TKEY",
        language:               "TLAN",
        length:                 "TLEN",
        mediaType:              "TMED",
        originalTitle:          "TOAL",
        originalFilename:       "TOFN",
        originalTextwriter:     "TOLY",
        originalArtist:         "TOPE",
        originalYear:           "TORY",
        fileOwner:              "TOWN",
        artist:                 "TPE1",
        performerInfo:          "TPE2",
        conductor:              "TPE3",
        remixArtist:            "TPE4",
        partOfSet:              "TPOS",
        publisher:              "TPUB",
        trackNumber:            "TRCK",
        recordingDates:         "TRDA",
        internetRadioName:      "TRSN",
        internetRadioOwner:     "TRSO",
        size:                   "TSIZ",
        ISRC:                   "TSRC",
        encodingTechnology:     "TSSE",
        year:                   "TYER",
        comment:                "COMM",
        image:                  "APIC",
        unsynchronisedLyrics:   "USLT",
        synchronisedLyrics:     "SYLT",
        userDefinedText:        "TXXX",
        popularimeter:          "POPM",
        private:                "PRIV",
        chapter:                "CHAP",
        tableOfContents:        "CTOC",
        userDefinedUrl:         "WXXX",
        commercialUrl:          "WCOM",
        copyrightUrl:           "WCOP",
        fileUrl:                "WOAF",
        artistUrl:              "WOAR",
        audioSourceUrl:         "WOAS",
        radioStationUrl:        "WORS",
        paymentUrl:             "WPAY",
        publisherUrl:           "WPUB",
        eventTimingCodes:       "ETCO",
        commercialFrame:        "COMR",
        uniqueFileIdentifier:   "UFID"
    },
    /**
     * v4 removes some text frames compared to v3: TDAT, TIME, TRDA, TSIZ, TYER
     * It adds the text frames: TDEN, TDOR, TDRC, TDRL, TDTG, TIPL, TMCL, TMOO, TPRO, TSOA, TSOP, TSOT, TSST
     *
     * Removed other frames: CHAP, CTOC
     */
    v4: {
        image:                  "APIC",
        comment:                "COMM",
        commercialFrame:        "COMR",
        eventTimingCodes:       "ETCO",
        private:                "PRIV",
        popularimeter:          "POPM",
        synchronisedLyrics:     "SYLT",
        album:                  "TALB",
        bpm:                    "TBPM",
        composer:               "TCOM",
        genre:                  "TCON",
        copyright:              "TCOP",
        encodingTime:           "TDEN",
        playlistDelay:          "TDLY",
        originalReleaseTime:    "TDOR",
        recordingTime:          "TDRC",
        releaseTime:            "TDRL",
        taggingTime:            "TDTG",
        encodedBy:              "TENC",
        textWriter:             "TEXT",
        fileType:               "TFLT",
        involvedPeopleList:     "TIPL",
        contentGroup:           "TIT1",
        title:                  "TIT2",
        subtitle:               "TIT3",
        initialKey:             "TKEY",
        language:               "TLAN",
        length:                 "TLEN",
        musicianCreditsList:    "TMCL",
        mediaType:              "TMED",
        mood:                   "TMOO",
        originalTitle:          "TOAL",
        originalFilename:       "TOFN",
        originalTextwriter:     "TOLY",
        originalArtist:         "TOPE",
        fileOwner:              "TOWN",
        artist:                 "TPE1",
        performerInfo:          "TPE2",
        conductor:              "TPE3",
        remixArtist:            "TPE4",
        partOfSet:              "TPOS",
        producedNotice:         "TPRO",
        publisher:              "TPUB",
        trackNumber:            "TRCK",
        internetRadioName:      "TRSN",
        internetRadioOwner:     "TRSO",
        albumSortOrder:         "TSOA",
        performerSortOrder:     "TSOP",
        titleSortOrder:         "TSOT",
        ISRC:                   "TSRC",
        encodingTechnology:     "TSSE",
        setSubtitle:            "TSST",
        userDefinedText:        "TXXX",
        unsynchronisedLyrics:   "USLT",
        commercialUrl:          "WCOM",
        copyrightUrl:           "WCOP",
        fileUrl:                "WOAF",
        artistUrl:              "WOAR",
        audioSourceUrl:         "WOAS",
        radioStationUrl:        "WORS",
        paymentUrl:             "WPAY",
        publisherUrl:           "WPUB",
        userDefinedUrl:         "WXXX"
    }
}

/**
 * Contains FRAME_IDENTIFIERS but frame alias / name swapped.
 */
const FRAME_INTERNAL_IDENTIFIERS = Object.keys(FRAME_IDENTIFIERS).reduce((acc, versionKey) => {
    acc[versionKey] = Object.keys(FRAME_IDENTIFIERS[versionKey]).reduce((acc, tagKey) => {
        acc[FRAME_IDENTIFIERS[versionKey][tagKey]] = tagKey
        return acc
    }, {})
    return acc
}, {})

const ID3_FRAME_OPTIONS = {
    "PIC": {
        multiple: false /* change in 1.0 */
    },
    "WCM": {
        multiple: true
    },
    "WAR": {
        multiple: true
    },
    "T___": {
        // This is "correct", but in v4, the text frame's value can be split by using 0x00.
        // https://github.com/Zazama/node-id3/issues/111
        multiple: false
    },
    "TXXX": {
        multiple: true,
        updateCompareKey: "description"
    },
    "APIC": {
        multiple: false /* change in 1.0 */
    },
    "USLT": {
        multiple: false /* change in 1.0 */
    },
    "SYLT": {
        multiple: true
    },
    "COMM": {
        multiple: false /* change in 1.0 */
    },
    "POPM": {
        multiple: false /* change in 1.0 */
    },
    "PRIV": {
        multiple: true
    },
    "CTOC": {
        multiple: true
    },
    "CHAP": {
        multiple: true
    },
    "WXXX": {
        multiple: true,
        updateCompareKey: "description"
    },
    "WCOM": {
        multiple: true
    },
    "WOAR": {
        multiple: true
    },
    "ETCO": {
        multiple: false
    },
    "COMR": {
        multiple: true
    },
    "UFID": {
        multiple: true
    }
}

/*
**  Officially available types of the picture frame
*/
const APICTypes = [
    "other",
    "file icon",
    "other file icon",
    "front cover",
    "back cover",
    "leaflet page",
    "media",
    "lead artist",
    "artist",
    "conductor",
    "band",
    "composer",
    "lyricist",
    "recording location",
    "during recording",
    "during performance",
    "video screen capture",
    "a bright coloured fish",
    "illustration",
    "band logotype",
    "publisher logotype"
]

const ENCODINGS = [
    'ISO-8859-1', 'UTF-16', 'UTF-16BE', 'utf8'
]

/**
 * Documented constants used in tag frames.
 *
 * @see {@link https://id3.org/} for more information.
 */
const TagConstants = {
    /**
     * Absolute time unit used by:
     * - Event timing codes (`ETCO` tag frame)
     * - Synchronised tempo codes (`SYTC` tag frame)
     * - Synchronised lyrics/text (`SYLT` tag frame)
     * - Position synchronisation frame (`POSS` tag frame))
     */
    TimeStampFormat: {
        MPEG_FRAMES: 1,
        MILLISECONDS: 2
    },
    /**
     * `ETCO` tag frame
     */
    EventTimingCodes: {
        EventType: {
            /**
             * Padding has no meaning
             */
            PADDING: 0x00,
            END_OF_INITIAL_SILENCE: 0x01,
            INTRO_START: 0x02,
            MAINPART_START: 0x03,
            OUTRO_START: 0x04,
            OUTRO_END: 0x05,
            VERSE_START: 0x06,
            REFRAIN_START: 0x07,
            INTERLUDE_START: 0x08,
            THEME_START: 0x09,
            VARIATION_START: 0x0A,
            KEY_CHANGE: 0x0B,
            TIME_CHANGE: 0x0C,
            /**
             * (Snap, Crackle & Pop)
             */
            MOMENTARY_UNWANTED_NOISE: 0x0D,
            SUSTAINED_NOISE: 0x0E,
            SUSTAINED_NOISE_END: 0x0F,
            INTRO_END: 0x10,
            MAINPART_END: 0x11,
            VERSE_END: 0x12,
            REFRAIN_END: 0x013,
            THEME_END: 0x14,
            /**
             * $15-$DF reserved for future use
             */
            RESERVED_1: 0x15,
            /**
             * $E0-$EF not predefined sync 0-F
             */
            NOT_PREDEFINED_SYNC: 0xE0,
            /**
             * $F0-$FC reserved for future use
             */
            RESERVED_2: 0xF0,
            /**
             * Start of silence
             */
            AUDIO_END: 0xFD,
            AUDIO_FILE_ENDS: 0xFE,
            /**
             * one more byte of events follows (all the following bytes with
             * the value $FF have the same function)
             */
            ONE_MORE_BYTE_FOLLOWS: 0xFF
        }
    },
    /**
     * `SYLT` tag frame
     */
    SynchronisedLyrics: {
        ContentType: {
            OTHER: 0x00,
            LYRICS: 0x01,
            TEXT_TRANSCRIPTION: 0x02,
            MOVEMENT_OR_PART_NAME: 0x03,
            EVENTS: 0x04,
            CHORD: 0x05,
            TRIVIA_OR_POP_UP_INFORMATION: 0x06
        }
    },
    /**
     * `APIC` tag frame
     */
     AttachedPicture: {
        PictureType: {
            OTHER: 0,
            /**
             * 32x32 pixels (PNG only)
             */
            FILE_ICON: 0x01,
            OTHER_FILE_ICON: 0x02,
            FRONT_COVER: 0x03,
            BACK_COVER: 0x04,
            LEAFLET_PAGE: 0x05,
            /**
             * Label side of CD
             */
            MEDIA: 0x06
            /**
             * Lead artist/lead performer/soloist
             */,
            LEAD_ARTIST: 0x07,
            ARTIST_OR_PERFORMER: 0x08,
            CONDUCTOR: 0x09,
            BAND_OR_ORCHESTRA: 0x0A,
            COMPOSER: 0x0B,
            LYRICIST_OR_TEXT_WRITER: 0x0C,
            RECORDING_LOCATION: 0x0D,
            DURING_RECORDING: 0x0E,
            DURING_PERFORMANCE: 0x0F,
            MOVIE_OR_VIDEO_SCREEN_CAPTURE: 0x10,
            A_BRIGHT_COLOURED_FISH: 0x11,
            ILLUSTRATION: 0x12,
            BAND_OR_ARTIST_LOGOTYPE: 0x13,
            PUBLISHER_OR_STUDIO_LOGOTYPE: 0x14
        }
    },
    /**
     * `COMR` tag frame
     */
    CommercialFrame: {
        ReceivedAs: {
            OTHER: 0x00,
            STANDARD_CD_ALBUM_WITH_OTHER_SONGS: 0x01,
            COMPRESSED_AUDIO_ON_CD: 0x02,
            FILE_OVER_THE_INTERNET: 0x03,
            STREAM_OVER_THE_INTERNET: 0x04,
            AS_NOTE_SHEETS: 0x05,
            AS_NOTE_SHEETS_IN_A_BOOK_WITH_OTHER_SHEETS: 0x06,
            MUSIC_ON_OTHER_MEDIA: 0x07,
            NON_MUSICAL_MERCHANDISE: 0x08
        }
    }
}

module.exports.APIC_TYPES = APICTypes
module.exports.ENCODINGS = ENCODINGS
module.exports.FRAME_IDENTIFIERS = FRAME_IDENTIFIERS
module.exports.FRAME_INTERNAL_IDENTIFIERS = FRAME_INTERNAL_IDENTIFIERS
module.exports.ID3_FRAME_OPTIONS = ID3_FRAME_OPTIONS
module.exports.TagConstants = TagConstants
