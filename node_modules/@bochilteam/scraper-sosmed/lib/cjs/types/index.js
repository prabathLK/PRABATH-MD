"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapSaveSchema = exports.SnapSaveArgsSchema = exports.SaveFromSchema = exports.SaveFromArgsSchema = exports.AiovideodlSchema = exports.AiovideodlArgsSchema = exports.GroupWASchema = exports.GroupWAArgsSchema = exports.YoutubeConvertSchema = exports.YoutubeDownloaderV2ArgsSchema = exports.YoutubeDownloaderSchema = exports.YoutubeVideoOrAudioSchema = exports.YoutubeDownloaderArgsSchema = exports.YoutubeSearchSchema = exports.TwitterDownloaderV2Schema = exports.TwitterDownloaderSchema = exports.ItwitterDownloaderSchema = exports.TwitterDownloaderArgsSchema = exports.GoogleItSchema = exports.GoogleItArgsSchema = exports.TiktokDownloaderSchema = exports.TiktokDownloaderArgsSchema = exports.InstagramStoryArgsSchema = exports.IinstagramStorySchema = exports.InstagramDownloaderSchema = exports.IinstagramDownloaderSchema = exports.InstagramDownloaderArgsSchema = exports.FacebookDownloaderV2Schema = exports.FacebookDownloaderSchema = exports.FacebookDownloaderArgsSchema = void 0;
const zod_1 = require("zod");
exports.FacebookDownloaderArgsSchema = zod_1.z.object({
    0: zod_1.z.string().url()
});
exports.FacebookDownloaderSchema = zod_1.z.object({
    id: zod_1.z.string(),
    thumbnail: zod_1.z.string(),
    duration: zod_1.z.number(),
    result: zod_1.z.object({
        size: zod_1.z.string().or(zod_1.z.number()).optional(),
        ext: zod_1.z.string(),
        url: zod_1.z.string(),
        quality: zod_1.z.string().optional(),
        vcodec: zod_1.z.string().optional(),
        fid: zod_1.z.string(),
        isVideo: zod_1.z.boolean(),
        isAudio: zod_1.z.boolean()
    }).array().min(1)
});
exports.FacebookDownloaderV2Schema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    thumbnail: zod_1.z.string(),
    result: zod_1.z.object({
        quality: zod_1.z.string(),
        url: zod_1.z.string()
    }).array().min(1)
});
exports.InstagramDownloaderArgsSchema = zod_1.z.object({
    0: zod_1.z.string().url()
});
exports.IinstagramDownloaderSchema = zod_1.z.object({
    url: zod_1.z.string()
});
exports.InstagramDownloaderSchema = zod_1.z.object({
    url: zod_1.z.string().url(),
    title: zod_1.z.string(),
    thumbnail: zod_1.z.string().url(),
    duration: zod_1.z.string(),
    source: zod_1.z.string(),
    medias: zod_1.z.object({
        url: zod_1.z.string().url(),
        quality: zod_1.z.string(),
        formattedSize: zod_1.z.string(),
        extension: zod_1.z.string(),
        audioAvailable: zod_1.z.boolean(),
        videoAvailable: zod_1.z.boolean(),
        cached: zod_1.z.boolean(),
        chunked: zod_1.z.boolean()
    }).array().min(1)
});
exports.IinstagramStorySchema = zod_1.z.object({
    user: zod_1.z.object({
        username: zod_1.z.string(),
        profilePicUrl: zod_1.z.string()
    }),
    results: zod_1.z.object({
        thumbnail: zod_1.z.string(),
        url: zod_1.z.string(),
        type: zod_1.z.string(),
        isVideo: zod_1.z.boolean()
    }).array().min(1)
});
exports.InstagramStoryArgsSchema = zod_1.z.object({
    0: zod_1.z.string()
});
exports.TiktokDownloaderArgsSchema = zod_1.z.object({
    0: zod_1.z.string().url()
});
exports.TiktokDownloaderSchema = zod_1.z.object({
    author: zod_1.z.object({
        nickname: zod_1.z.string(),
        unique_id: zod_1.z.string(),
        avatar: zod_1.z.string()
    }),
    video: zod_1.z.object({
        no_watermark: zod_1.z.string(),
        no_watermark_hd: zod_1.z.string()
    })
});
exports.GoogleItArgsSchema = zod_1.z.object({
    0: zod_1.z.string()
});
exports.GoogleItSchema = zod_1.z.object({
    info: zod_1.z.object({
        title: zod_1.z.string().optional(),
        type: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        image: zod_1.z.string().array().optional()
    }),
    articles: zod_1.z.object({
        header: zod_1.z.string(),
        title: zod_1.z.string(),
        url: zod_1.z.string(),
        description: zod_1.z.string()
    }).array()
});
exports.TwitterDownloaderArgsSchema = zod_1.z.object({
    0: zod_1.z.string().url()
});
exports.ItwitterDownloaderSchema = zod_1.z.object({
    quality: zod_1.z.string(),
    type: zod_1.z.string(),
    url: zod_1.z.string().url()
});
exports.TwitterDownloaderSchema = zod_1.z.object({
    isVideo: zod_1.z.boolean()
}).and(exports.ItwitterDownloaderSchema);
exports.TwitterDownloaderV2Schema = exports.ItwitterDownloaderSchema;
exports.YoutubeSearchSchema = zod_1.z.object({
    video: zod_1.z.array(zod_1.z.object({
        authorName: zod_1.z.string(),
        authorAvatar: zod_1.z.string(),
        videoId: zod_1.z.string(),
        url: zod_1.z.string().url(),
        thumbnail: zod_1.z.string().url(),
        title: zod_1.z.string(),
        description: zod_1.z.string(),
        publishedTime: zod_1.z.string().optional(),
        durationH: zod_1.z.string(),
        durationS: zod_1.z.number(),
        duration: zod_1.z.string(),
        viewH: zod_1.z.string(),
        view: zod_1.z.string(),
        type: zod_1.z.literal('video')
    })),
    channel: zod_1.z.array(zod_1.z.object({
        channelId: zod_1.z.string(),
        url: zod_1.z.string().url(),
        channelName: zod_1.z.string(),
        username: zod_1.z.string(),
        avatar: zod_1.z.string(),
        isVerified: zod_1.z.boolean(),
        subscriberH: zod_1.z.string(),
        subscriber: zod_1.z.string(),
        description: zod_1.z.string(),
        type: zod_1.z.literal('channel')
    })),
    playlist: zod_1.z.array(zod_1.z.object({
        playlistId: zod_1.z.string(),
        title: zod_1.z.string(),
        thumbnail: zod_1.z.string(),
        video: zod_1.z.array(zod_1.z.object({
            videoId: zod_1.z.string(),
            title: zod_1.z.string(),
            durationH: zod_1.z.string(),
            duration: zod_1.z.string(),
        })),
        type: zod_1.z.literal('mix')
    }))
});
exports.YoutubeDownloaderArgsSchema = zod_1.z.object({
    0: zod_1.z.string().url(),
    1: zod_1.z.string().optional()
});
exports.YoutubeVideoOrAudioSchema = zod_1.z.record(zod_1.z.object({
    quality: zod_1.z.string(),
    fileSizeH: zod_1.z.string(),
    fileSize: zod_1.z.number(),
    download: zod_1.z.function().returns(zod_1.z.promise(zod_1.z.string().url()))
}));
exports.YoutubeDownloaderSchema = zod_1.z.object({
    id: zod_1.z.string(),
    thumbnail: zod_1.z.string().url(),
    title: zod_1.z.string(),
    video: exports.YoutubeVideoOrAudioSchema,
    audio: exports.YoutubeVideoOrAudioSchema
});
exports.YoutubeDownloaderV2ArgsSchema = zod_1.z.object({
    0: zod_1.z.string().url()
});
exports.YoutubeConvertSchema = zod_1.z.string().url();
exports.GroupWAArgsSchema = zod_1.z.object({
    0: zod_1.z.string()
});
exports.GroupWASchema = zod_1.z.object({
    url: zod_1.z.string().url(),
    subject: zod_1.z.string()
});
exports.AiovideodlArgsSchema = zod_1.z.object({
    0: zod_1.z.string().url()
});
exports.AiovideodlSchema = zod_1.z.object({
    url: zod_1.z.string(),
    title: zod_1.z.string(),
    thumbnail: zod_1.z.string(),
    duration: zod_1.z.string().nullable().optional(),
    source: zod_1.z.string(),
    medias: zod_1.z.object({
        url: zod_1.z.string(),
        quality: zod_1.z.string(),
        extension: zod_1.z.string(),
        size: zod_1.z.number(),
        formattedSize: zod_1.z.string(),
        videoAvailable: zod_1.z.boolean(),
        audioAvailable: zod_1.z.boolean(),
        chunked: zod_1.z.boolean(),
        cached: zod_1.z.boolean()
    }).array(),
    sid: zod_1.z.any().nullable().optional()
});
exports.SaveFromArgsSchema = zod_1.z.object({
    0: zod_1.z.string().url()
});
exports.SaveFromSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    url: zod_1.z.object({
        url: zod_1.z.string().url(),
        ext: zod_1.z.string(),
        type: zod_1.z.string(),
        name: zod_1.z.string(),
        quality: zod_1.z.number().optional(),
        subname: zod_1.z.string().optional()
    }).array().min(1).optional(),
    meta: zod_1.z.object({
        title: zod_1.z.string(),
        source: zod_1.z.string().url().optional(),
        duration: zod_1.z.string().optional()
    }),
    video_quality: zod_1.z.string().array().optional(),
    thumb: zod_1.z.string(),
    sd: zod_1.z.object({
        url: zod_1.z.string().url(),
        format: zod_1.z.string().optional()
    }).nullable(),
    hd: zod_1.z.object({
        url: zod_1.z.string().url(),
        format: zod_1.z.string().optional()
    }).nullable(),
    hosting: zod_1.z.string()
});
exports.SnapSaveArgsSchema = zod_1.z.object({
    0: zod_1.z.string().url()
});
exports.SnapSaveSchema = zod_1.z.object({
    filesize: zod_1.z.number().optional(),
    resolution: zod_1.z.string().optional(),
    thumbnail: zod_1.z.string().url().optional(),
    url: zod_1.z.string().url()
});
