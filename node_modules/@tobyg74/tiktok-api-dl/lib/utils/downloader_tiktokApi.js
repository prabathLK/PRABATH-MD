"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiktokAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const api_1 = require("../api");
const TiktokAPI = (url) => new Promise((resolve, reject) => {
    url = url.replace("https://vm", "https://vt");
    axios_1.default
        .head(url)
        .then(({ request }) => {
        const { responseUrl } = request.res;
        let ID = responseUrl.match(/\d{17,21}/g);
        if (ID === null)
            return resolve({
                status: "error",
                message: "Failed to fetch tiktok url. Make sure your tiktok url is correct!"
            });
        ID = ID[0];
        axios_1.default
            .get((0, api_1._tiktokapi)(new URLSearchParams(withParams({
            aweme_id: ID
        })).toString()))
            .then(({ data }) => {
            const content = data.aweme_list.filter((v) => v.aweme_id === ID)[0];
            if (!content)
                return resolve({
                    status: "error",
                    message: "Failed to find tiktok data. Make sure your tiktok url is correct!"
                });
            const statistics = {
                playCount: content.statistics.play_count,
                downloadCount: content.statistics.download_count,
                shareCount: content.statistics.share_count,
                commentCount: content.statistics.comment_count,
                likeCount: content.statistics.digg_count,
                favoriteCount: content.statistics.collect_count,
                forwardCount: content.statistics.forward_count,
                whatsappShareCount: content.statistics.whatsapp_share_count,
                loseCount: content.statistics.lose_count,
                loseCommentCount: content.statistics.lose_comment_count
            };
            const author = {
                uid: content.author.uid,
                username: content.author.unique_id,
                nickname: content.author.nickname,
                signature: content.author.signature,
                region: content.author.region,
                avatarThumb: content.author.avatar_thumb.url_list,
                avatarMedium: content.author.avatar_medium.url_list,
                url: `${api_1._tiktokurl}/@${content.author.unique_id}`
            };
            const music = {
                id: content.music.id,
                title: content.music.title,
                author: content.music.author,
                album: content.music.album,
                playUrl: content.music.play_url.url_list,
                coverLarge: content.music.cover_large.url_list,
                coverMedium: content.music.cover_medium.url_list,
                coverThumb: content.music.cover_thumb.url_list,
                duration: content.music.duration
            };
            if (content.image_post_info) {
                resolve({
                    status: "success",
                    result: {
                        type: "image",
                        id: content.aweme_id,
                        createTime: content.create_time,
                        description: content.desc,
                        hashtag: content.text_extra.filter((x) => x.hashtag_name !== undefined).map((v) => v.hashtag_name),
                        author,
                        statistics,
                        images: content.image_post_info.images.map((v) => v.display_image.url_list[0]),
                        music
                    }
                });
            }
            else {
                resolve({
                    status: "success",
                    result: {
                        type: "video",
                        id: content.aweme_id,
                        createTime: content.create_time,
                        description: content.desc,
                        hashtag: content.text_extra.filter((x) => x.hashtag_name !== undefined).map((v) => v.hashtag_name),
                        duration: toMinute(content.duration),
                        author,
                        statistics,
                        video: content.video.play_addr.url_list,
                        cover: content.video.cover.url_list,
                        dynamicCover: content.video.dynamic_cover.url_list,
                        originCover: content.video.origin_cover.url_list,
                        music
                    }
                });
            }
        })
            .catch((e) => resolve({ status: "error", message: e.message }));
    })
        .catch((e) => resolve({ status: "error", message: e.message }));
});
exports.TiktokAPI = TiktokAPI;
const withParams = (args) => {
    return {
        ...args,
        version_name: "1.1.9",
        version_code: "2018111632",
        build_number: "1.1.9",
        manifest_version_code: "2018111632",
        update_version_code: "2018111632",
        openudid: randomChar("0123456789abcdef", 16),
        uuid: randomChar("1234567890", 16),
        _rticket: Date.now() * 1000,
        ts: Date.now(),
        device_brand: "Google",
        device_type: "Pixel 4",
        device_platform: "android",
        resolution: "1080*1920",
        dpi: 420,
        os_version: "10",
        os_api: "29",
        carrier_region: "US",
        sys_region: "US",
        region: "US",
        app_name: "trill",
        app_language: "en",
        language: "en",
        timezone_name: "America/New_York",
        timezone_offset: "-14400",
        channel: "googleplay",
        ac: "wifi",
        mcc_mnc: "310260",
        is_my_cn: 0,
        aid: 1180,
        ssmix: "a",
        as: "a1qwert123",
        cp: "cbfhckdckkde1"
    };
};
const toMinute = (duration) => {
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;
    let ret = "";
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
};
const randomChar = (char, range) => {
    let chars = "";
    for (let i = 0; i < range; i++) {
        chars += char[Math.floor(Math.random() * char.length)];
    }
    return chars;
};
