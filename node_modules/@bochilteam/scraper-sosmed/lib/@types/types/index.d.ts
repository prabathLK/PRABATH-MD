import { z } from 'zod';
export declare const FacebookDownloaderArgsSchema: z.ZodObject<{
    0: z.ZodString;
}, "strip", z.ZodTypeAny, {
    0: string;
}, {
    0: string;
}>;
export declare const FacebookDownloaderSchema: z.ZodObject<{
    id: z.ZodString;
    thumbnail: z.ZodString;
    duration: z.ZodNumber;
    result: z.ZodArray<z.ZodObject<{
        size: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
        ext: z.ZodString;
        url: z.ZodString;
        quality: z.ZodOptional<z.ZodString>;
        vcodec: z.ZodOptional<z.ZodString>;
        fid: z.ZodString;
        isVideo: z.ZodBoolean;
        isAudio: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        size?: string | number | undefined;
        quality?: string | undefined;
        vcodec?: string | undefined;
        ext: string;
        url: string;
        fid: string;
        isVideo: boolean;
        isAudio: boolean;
    }, {
        size?: string | number | undefined;
        quality?: string | undefined;
        vcodec?: string | undefined;
        ext: string;
        url: string;
        fid: string;
        isVideo: boolean;
        isAudio: boolean;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    thumbnail: string;
    duration: number;
    result: {
        size?: string | number | undefined;
        quality?: string | undefined;
        vcodec?: string | undefined;
        ext: string;
        url: string;
        fid: string;
        isVideo: boolean;
        isAudio: boolean;
    }[];
}, {
    id: string;
    thumbnail: string;
    duration: number;
    result: {
        size?: string | number | undefined;
        quality?: string | undefined;
        vcodec?: string | undefined;
        ext: string;
        url: string;
        fid: string;
        isVideo: boolean;
        isAudio: boolean;
    }[];
}>;
export declare const FacebookDownloaderV2Schema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    description: z.ZodString;
    thumbnail: z.ZodString;
    result: z.ZodArray<z.ZodObject<{
        quality: z.ZodString;
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
        quality: string;
    }, {
        url: string;
        quality: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id?: string | undefined;
    thumbnail: string;
    result: {
        url: string;
        quality: string;
    }[];
    title: string;
    description: string;
}, {
    id?: string | undefined;
    thumbnail: string;
    result: {
        url: string;
        quality: string;
    }[];
    title: string;
    description: string;
}>;
export type FacebookDownloaderArgs = z.infer<typeof FacebookDownloaderArgsSchema>;
export type FacebookDownloader = z.infer<typeof FacebookDownloaderSchema>;
export type FacebookDownloaderV2 = z.infer<typeof FacebookDownloaderV2Schema>;
export declare const InstagramDownloaderArgsSchema: z.ZodObject<{
    0: z.ZodString;
}, "strip", z.ZodTypeAny, {
    0: string;
}, {
    0: string;
}>;
export declare const IinstagramDownloaderSchema: z.ZodObject<{
    url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    url: string;
}, {
    url: string;
}>;
export declare const InstagramDownloaderSchema: z.ZodObject<{
    url: z.ZodString;
    title: z.ZodString;
    thumbnail: z.ZodString;
    duration: z.ZodString;
    source: z.ZodString;
    medias: z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        quality: z.ZodString;
        formattedSize: z.ZodString;
        extension: z.ZodString;
        audioAvailable: z.ZodBoolean;
        videoAvailable: z.ZodBoolean;
        cached: z.ZodBoolean;
        chunked: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        url: string;
        quality: string;
        formattedSize: string;
        extension: string;
        audioAvailable: boolean;
        videoAvailable: boolean;
        cached: boolean;
        chunked: boolean;
    }, {
        url: string;
        quality: string;
        formattedSize: string;
        extension: string;
        audioAvailable: boolean;
        videoAvailable: boolean;
        cached: boolean;
        chunked: boolean;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    thumbnail: string;
    duration: string;
    url: string;
    title: string;
    source: string;
    medias: {
        url: string;
        quality: string;
        formattedSize: string;
        extension: string;
        audioAvailable: boolean;
        videoAvailable: boolean;
        cached: boolean;
        chunked: boolean;
    }[];
}, {
    thumbnail: string;
    duration: string;
    url: string;
    title: string;
    source: string;
    medias: {
        url: string;
        quality: string;
        formattedSize: string;
        extension: string;
        audioAvailable: boolean;
        videoAvailable: boolean;
        cached: boolean;
        chunked: boolean;
    }[];
}>;
export type IinstagramDownloader = z.infer<typeof IinstagramDownloaderSchema>;
export type InstagramDownloaderArgs = z.infer<typeof InstagramDownloaderArgsSchema>;
export type InstagramDownloader = z.infer<typeof InstagramDownloaderSchema>;
export declare const IinstagramStorySchema: z.ZodObject<{
    user: z.ZodObject<{
        username: z.ZodString;
        profilePicUrl: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        username: string;
        profilePicUrl: string;
    }, {
        username: string;
        profilePicUrl: string;
    }>;
    results: z.ZodArray<z.ZodObject<{
        thumbnail: z.ZodString;
        url: z.ZodString;
        type: z.ZodString;
        isVideo: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        type: string;
        thumbnail: string;
        url: string;
        isVideo: boolean;
    }, {
        type: string;
        thumbnail: string;
        url: string;
        isVideo: boolean;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    user: {
        username: string;
        profilePicUrl: string;
    };
    results: {
        type: string;
        thumbnail: string;
        url: string;
        isVideo: boolean;
    }[];
}, {
    user: {
        username: string;
        profilePicUrl: string;
    };
    results: {
        type: string;
        thumbnail: string;
        url: string;
        isVideo: boolean;
    }[];
}>;
export declare const InstagramStoryArgsSchema: z.ZodObject<{
    0: z.ZodString;
}, "strip", z.ZodTypeAny, {
    0: string;
}, {
    0: string;
}>;
export type IinstagramStory = z.infer<typeof IinstagramStorySchema>;
export type InstagramStoryArgs = z.infer<typeof InstagramStoryArgsSchema>;
export type InstagramStory = IinstagramStory;
export declare const TiktokDownloaderArgsSchema: z.ZodObject<{
    0: z.ZodString;
}, "strip", z.ZodTypeAny, {
    0: string;
}, {
    0: string;
}>;
export declare const TiktokDownloaderSchema: z.ZodObject<{
    author: z.ZodObject<{
        nickname: z.ZodString;
        unique_id: z.ZodString;
        avatar: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        nickname: string;
        unique_id: string;
        avatar: string;
    }, {
        nickname: string;
        unique_id: string;
        avatar: string;
    }>;
    video: z.ZodObject<{
        no_watermark: z.ZodString;
        no_watermark_hd: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        no_watermark: string;
        no_watermark_hd: string;
    }, {
        no_watermark: string;
        no_watermark_hd: string;
    }>;
}, "strip", z.ZodTypeAny, {
    author: {
        nickname: string;
        unique_id: string;
        avatar: string;
    };
    video: {
        no_watermark: string;
        no_watermark_hd: string;
    };
}, {
    author: {
        nickname: string;
        unique_id: string;
        avatar: string;
    };
    video: {
        no_watermark: string;
        no_watermark_hd: string;
    };
}>;
export type TiktokDownloaderArgs = z.infer<typeof TiktokDownloaderArgsSchema>;
export type TiktokDownloader = z.infer<typeof TiktokDownloaderSchema>;
export declare const GoogleItArgsSchema: z.ZodObject<{
    0: z.ZodString;
}, "strip", z.ZodTypeAny, {
    0: string;
}, {
    0: string;
}>;
export declare const GoogleItSchema: z.ZodObject<{
    info: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        image: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        type?: string | undefined;
        title?: string | undefined;
        description?: string | undefined;
        image?: string[] | undefined;
    }, {
        type?: string | undefined;
        title?: string | undefined;
        description?: string | undefined;
        image?: string[] | undefined;
    }>;
    articles: z.ZodArray<z.ZodObject<{
        header: z.ZodString;
        title: z.ZodString;
        url: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
        title: string;
        description: string;
        header: string;
    }, {
        url: string;
        title: string;
        description: string;
        header: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    info: {
        type?: string | undefined;
        title?: string | undefined;
        description?: string | undefined;
        image?: string[] | undefined;
    };
    articles: {
        url: string;
        title: string;
        description: string;
        header: string;
    }[];
}, {
    info: {
        type?: string | undefined;
        title?: string | undefined;
        description?: string | undefined;
        image?: string[] | undefined;
    };
    articles: {
        url: string;
        title: string;
        description: string;
        header: string;
    }[];
}>;
export type GoogleItArgs = z.infer<typeof GoogleItArgsSchema>;
export type GoogleIt = z.infer<typeof GoogleItSchema>;
export declare const TwitterDownloaderArgsSchema: z.ZodObject<{
    0: z.ZodString;
}, "strip", z.ZodTypeAny, {
    0: string;
}, {
    0: string;
}>;
export declare const ItwitterDownloaderSchema: z.ZodObject<{
    quality: z.ZodString;
    type: z.ZodString;
    url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: string;
    url: string;
    quality: string;
}, {
    type: string;
    url: string;
    quality: string;
}>;
export declare const TwitterDownloaderSchema: z.ZodIntersection<z.ZodObject<{
    isVideo: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    isVideo: boolean;
}, {
    isVideo: boolean;
}>, z.ZodObject<{
    quality: z.ZodString;
    type: z.ZodString;
    url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: string;
    url: string;
    quality: string;
}, {
    type: string;
    url: string;
    quality: string;
}>>;
export declare const TwitterDownloaderV2Schema: z.ZodObject<{
    quality: z.ZodString;
    type: z.ZodString;
    url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: string;
    url: string;
    quality: string;
}, {
    type: string;
    url: string;
    quality: string;
}>;
export type TwitterDownloaderArgs = z.infer<typeof TwitterDownloaderArgsSchema>;
export type ItwitterDownloader = z.infer<typeof ItwitterDownloaderSchema>;
export type TwitterDownloader = z.infer<typeof TwitterDownloaderSchema>;
export declare const YoutubeSearchSchema: z.ZodObject<{
    video: z.ZodArray<z.ZodObject<{
        authorName: z.ZodString;
        authorAvatar: z.ZodString;
        videoId: z.ZodString;
        url: z.ZodString;
        thumbnail: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        publishedTime: z.ZodOptional<z.ZodString>;
        durationH: z.ZodString;
        durationS: z.ZodNumber;
        duration: z.ZodString;
        viewH: z.ZodString;
        view: z.ZodString;
        type: z.ZodLiteral<"video">;
    }, "strip", z.ZodTypeAny, {
        publishedTime?: string | undefined;
        type: "video";
        thumbnail: string;
        duration: string;
        url: string;
        title: string;
        description: string;
        authorName: string;
        authorAvatar: string;
        videoId: string;
        durationH: string;
        durationS: number;
        viewH: string;
        view: string;
    }, {
        publishedTime?: string | undefined;
        type: "video";
        thumbnail: string;
        duration: string;
        url: string;
        title: string;
        description: string;
        authorName: string;
        authorAvatar: string;
        videoId: string;
        durationH: string;
        durationS: number;
        viewH: string;
        view: string;
    }>, "many">;
    channel: z.ZodArray<z.ZodObject<{
        channelId: z.ZodString;
        url: z.ZodString;
        channelName: z.ZodString;
        username: z.ZodString;
        avatar: z.ZodString;
        isVerified: z.ZodBoolean;
        subscriberH: z.ZodString;
        subscriber: z.ZodString;
        description: z.ZodString;
        type: z.ZodLiteral<"channel">;
    }, "strip", z.ZodTypeAny, {
        type: "channel";
        url: string;
        description: string;
        username: string;
        avatar: string;
        channelId: string;
        channelName: string;
        isVerified: boolean;
        subscriberH: string;
        subscriber: string;
    }, {
        type: "channel";
        url: string;
        description: string;
        username: string;
        avatar: string;
        channelId: string;
        channelName: string;
        isVerified: boolean;
        subscriberH: string;
        subscriber: string;
    }>, "many">;
    playlist: z.ZodArray<z.ZodObject<{
        playlistId: z.ZodString;
        title: z.ZodString;
        thumbnail: z.ZodString;
        video: z.ZodArray<z.ZodObject<{
            videoId: z.ZodString;
            title: z.ZodString;
            durationH: z.ZodString;
            duration: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            duration: string;
            title: string;
            videoId: string;
            durationH: string;
        }, {
            duration: string;
            title: string;
            videoId: string;
            durationH: string;
        }>, "many">;
        type: z.ZodLiteral<"mix">;
    }, "strip", z.ZodTypeAny, {
        type: "mix";
        thumbnail: string;
        title: string;
        video: {
            duration: string;
            title: string;
            videoId: string;
            durationH: string;
        }[];
        playlistId: string;
    }, {
        type: "mix";
        thumbnail: string;
        title: string;
        video: {
            duration: string;
            title: string;
            videoId: string;
            durationH: string;
        }[];
        playlistId: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    video: {
        publishedTime?: string | undefined;
        type: "video";
        thumbnail: string;
        duration: string;
        url: string;
        title: string;
        description: string;
        authorName: string;
        authorAvatar: string;
        videoId: string;
        durationH: string;
        durationS: number;
        viewH: string;
        view: string;
    }[];
    channel: {
        type: "channel";
        url: string;
        description: string;
        username: string;
        avatar: string;
        channelId: string;
        channelName: string;
        isVerified: boolean;
        subscriberH: string;
        subscriber: string;
    }[];
    playlist: {
        type: "mix";
        thumbnail: string;
        title: string;
        video: {
            duration: string;
            title: string;
            videoId: string;
            durationH: string;
        }[];
        playlistId: string;
    }[];
}, {
    video: {
        publishedTime?: string | undefined;
        type: "video";
        thumbnail: string;
        duration: string;
        url: string;
        title: string;
        description: string;
        authorName: string;
        authorAvatar: string;
        videoId: string;
        durationH: string;
        durationS: number;
        viewH: string;
        view: string;
    }[];
    channel: {
        type: "channel";
        url: string;
        description: string;
        username: string;
        avatar: string;
        channelId: string;
        channelName: string;
        isVerified: boolean;
        subscriberH: string;
        subscriber: string;
    }[];
    playlist: {
        type: "mix";
        thumbnail: string;
        title: string;
        video: {
            duration: string;
            title: string;
            videoId: string;
            durationH: string;
        }[];
        playlistId: string;
    }[];
}>;
export type YoutubeSearch = z.infer<typeof YoutubeSearchSchema>;
export declare const YoutubeDownloaderArgsSchema: z.ZodObject<{
    0: z.ZodString;
    1: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    1?: string | undefined;
    0: string;
}, {
    1?: string | undefined;
    0: string;
}>;
export declare const YoutubeVideoOrAudioSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    quality: z.ZodString;
    fileSizeH: z.ZodString;
    fileSize: z.ZodNumber;
    download: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodPromise<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    quality: string;
    fileSizeH: string;
    fileSize: number;
    download: (...args: unknown[]) => Promise<string>;
}, {
    quality: string;
    fileSizeH: string;
    fileSize: number;
    download: (...args: unknown[]) => Promise<string>;
}>>;
export declare const YoutubeDownloaderSchema: z.ZodObject<{
    id: z.ZodString;
    thumbnail: z.ZodString;
    title: z.ZodString;
    video: z.ZodRecord<z.ZodString, z.ZodObject<{
        quality: z.ZodString;
        fileSizeH: z.ZodString;
        fileSize: z.ZodNumber;
        download: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodPromise<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        quality: string;
        fileSizeH: string;
        fileSize: number;
        download: (...args: unknown[]) => Promise<string>;
    }, {
        quality: string;
        fileSizeH: string;
        fileSize: number;
        download: (...args: unknown[]) => Promise<string>;
    }>>;
    audio: z.ZodRecord<z.ZodString, z.ZodObject<{
        quality: z.ZodString;
        fileSizeH: z.ZodString;
        fileSize: z.ZodNumber;
        download: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodPromise<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        quality: string;
        fileSizeH: string;
        fileSize: number;
        download: (...args: unknown[]) => Promise<string>;
    }, {
        quality: string;
        fileSizeH: string;
        fileSize: number;
        download: (...args: unknown[]) => Promise<string>;
    }>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    thumbnail: string;
    title: string;
    video: Record<string, {
        quality: string;
        fileSizeH: string;
        fileSize: number;
        download: (...args: unknown[]) => Promise<string>;
    }>;
    audio: Record<string, {
        quality: string;
        fileSizeH: string;
        fileSize: number;
        download: (...args: unknown[]) => Promise<string>;
    }>;
}, {
    id: string;
    thumbnail: string;
    title: string;
    video: Record<string, {
        quality: string;
        fileSizeH: string;
        fileSize: number;
        download: (...args: unknown[]) => Promise<string>;
    }>;
    audio: Record<string, {
        quality: string;
        fileSizeH: string;
        fileSize: number;
        download: (...args: unknown[]) => Promise<string>;
    }>;
}>;
export declare const YoutubeDownloaderV2ArgsSchema: z.ZodObject<{
    0: z.ZodString;
}, "strip", z.ZodTypeAny, {
    0: string;
}, {
    0: string;
}>;
export declare const YoutubeConvertSchema: z.ZodString;
export type YoutubeDownloaderArgs = z.infer<typeof YoutubeDownloaderArgsSchema>;
export type YoutubeVideoOrAudio = z.infer<typeof YoutubeVideoOrAudioSchema>;
export type YoutubeDownloader = z.infer<typeof YoutubeDownloaderSchema>;
export type YoutubeDownloaderV2Args = z.infer<typeof YoutubeDownloaderV2ArgsSchema>;
export type YoutubeConvert = z.infer<typeof YoutubeConvertSchema>;
export declare const GroupWAArgsSchema: z.ZodObject<{
    0: z.ZodString;
}, "strip", z.ZodTypeAny, {
    0: string;
}, {
    0: string;
}>;
export declare const GroupWASchema: z.ZodObject<{
    url: z.ZodString;
    subject: z.ZodString;
}, "strip", z.ZodTypeAny, {
    url: string;
    subject: string;
}, {
    url: string;
    subject: string;
}>;
export type GroupWAArgs = z.infer<typeof GroupWAArgsSchema>;
export type GroupWA = z.infer<typeof GroupWASchema>;
export declare const AiovideodlArgsSchema: z.ZodObject<{
    0: z.ZodString;
}, "strip", z.ZodTypeAny, {
    0: string;
}, {
    0: string;
}>;
export declare const AiovideodlSchema: z.ZodObject<{
    url: z.ZodString;
    title: z.ZodString;
    thumbnail: z.ZodString;
    duration: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    source: z.ZodString;
    medias: z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        quality: z.ZodString;
        extension: z.ZodString;
        size: z.ZodNumber;
        formattedSize: z.ZodString;
        videoAvailable: z.ZodBoolean;
        audioAvailable: z.ZodBoolean;
        chunked: z.ZodBoolean;
        cached: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        size: number;
        url: string;
        quality: string;
        formattedSize: string;
        extension: string;
        audioAvailable: boolean;
        videoAvailable: boolean;
        cached: boolean;
        chunked: boolean;
    }, {
        size: number;
        url: string;
        quality: string;
        formattedSize: string;
        extension: string;
        audioAvailable: boolean;
        videoAvailable: boolean;
        cached: boolean;
        chunked: boolean;
    }>, "many">;
    sid: z.ZodOptional<z.ZodNullable<z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    duration?: string | null | undefined;
    sid?: any;
    thumbnail: string;
    url: string;
    title: string;
    source: string;
    medias: {
        size: number;
        url: string;
        quality: string;
        formattedSize: string;
        extension: string;
        audioAvailable: boolean;
        videoAvailable: boolean;
        cached: boolean;
        chunked: boolean;
    }[];
}, {
    duration?: string | null | undefined;
    sid?: any;
    thumbnail: string;
    url: string;
    title: string;
    source: string;
    medias: {
        size: number;
        url: string;
        quality: string;
        formattedSize: string;
        extension: string;
        audioAvailable: boolean;
        videoAvailable: boolean;
        cached: boolean;
        chunked: boolean;
    }[];
}>;
export type AiovideodlArgs = z.infer<typeof AiovideodlArgsSchema>;
export type Aiovideodl = z.infer<typeof AiovideodlSchema>;
export declare const SaveFromArgsSchema: z.ZodObject<{
    0: z.ZodString;
}, "strip", z.ZodTypeAny, {
    0: string;
}, {
    0: string;
}>;
export declare const SaveFromSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        ext: z.ZodString;
        type: z.ZodString;
        name: z.ZodString;
        quality: z.ZodOptional<z.ZodNumber>;
        subname: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        quality?: number | undefined;
        subname?: string | undefined;
        type: string;
        ext: string;
        url: string;
        name: string;
    }, {
        quality?: number | undefined;
        subname?: string | undefined;
        type: string;
        ext: string;
        url: string;
        name: string;
    }>, "many">>;
    meta: z.ZodObject<{
        title: z.ZodString;
        source: z.ZodOptional<z.ZodString>;
        duration: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        duration?: string | undefined;
        source?: string | undefined;
        title: string;
    }, {
        duration?: string | undefined;
        source?: string | undefined;
        title: string;
    }>;
    video_quality: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    thumb: z.ZodString;
    sd: z.ZodNullable<z.ZodObject<{
        url: z.ZodString;
        format: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        format?: string | undefined;
        url: string;
    }, {
        format?: string | undefined;
        url: string;
    }>>;
    hd: z.ZodNullable<z.ZodObject<{
        url: z.ZodString;
        format: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        format?: string | undefined;
        url: string;
    }, {
        format?: string | undefined;
        url: string;
    }>>;
    hosting: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id?: string | undefined;
    url?: {
        quality?: number | undefined;
        subname?: string | undefined;
        type: string;
        ext: string;
        url: string;
        name: string;
    }[] | undefined;
    video_quality?: string[] | undefined;
    meta: {
        duration?: string | undefined;
        source?: string | undefined;
        title: string;
    };
    thumb: string;
    sd: {
        format?: string | undefined;
        url: string;
    } | null;
    hd: {
        format?: string | undefined;
        url: string;
    } | null;
    hosting: string;
}, {
    id?: string | undefined;
    url?: {
        quality?: number | undefined;
        subname?: string | undefined;
        type: string;
        ext: string;
        url: string;
        name: string;
    }[] | undefined;
    video_quality?: string[] | undefined;
    meta: {
        duration?: string | undefined;
        source?: string | undefined;
        title: string;
    };
    thumb: string;
    sd: {
        format?: string | undefined;
        url: string;
    } | null;
    hd: {
        format?: string | undefined;
        url: string;
    } | null;
    hosting: string;
}>;
export type SaveFromArgs = z.infer<typeof SaveFromArgsSchema>;
export type Savefrom = z.infer<typeof SaveFromSchema>;
export declare const SnapSaveArgsSchema: z.ZodObject<{
    0: z.ZodString;
}, "strip", z.ZodTypeAny, {
    0: string;
}, {
    0: string;
}>;
export declare const SnapSaveSchema: z.ZodObject<{
    filesize: z.ZodOptional<z.ZodNumber>;
    resolution: z.ZodOptional<z.ZodString>;
    thumbnail: z.ZodOptional<z.ZodString>;
    url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    thumbnail?: string | undefined;
    filesize?: number | undefined;
    resolution?: string | undefined;
    url: string;
}, {
    thumbnail?: string | undefined;
    filesize?: number | undefined;
    resolution?: string | undefined;
    url: string;
}>;
export type SnapSaveArgs = z.infer<typeof SnapSaveArgsSchema>;
export type SnapSave = z.infer<typeof SnapSaveSchema>;
//# sourceMappingURL=index.d.ts.map