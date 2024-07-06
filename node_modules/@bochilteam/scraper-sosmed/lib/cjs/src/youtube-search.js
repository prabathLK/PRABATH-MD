"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(require("cheerio"));
const got_1 = __importDefault(require("got"));
const index_js_1 = require("../types/index.js");
async function youtubeSearch(query) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
    const body = await (0, got_1.default)('https://www.youtube.com/results', {
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
        },
        searchParams: {
            search_query: query
        }
    }).text();
    const $ = cheerio_1.default.load(body);
    let sc;
    $('script').map(function () {
        const el = $(this).html();
        let regex;
        if ((regex = /var ytInitialData = /gi.exec(el || ''))) {
            sc = JSON.parse(regex.input.replace(/^var ytInitialData = /i, '').replace(/;$/, ''));
        }
        return regex && sc;
    });
    const results = { video: [], channel: [], playlist: [] };
    const contents = sc.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents;
    for (const value of contents) {
        const typeName = Object.keys(value)[0];
        const result = value[typeName];
        if (typeName === 'shelfRenderer') {
            const items = result.content.verticalListRenderer.items;
            if (Array.isArray(items) && items.length)
                contents.push(...items);
        }
        const isChannel = typeName === 'channelRenderer';
        const isVideo = typeName === 'videoRenderer';
        const isMix = typeName === 'radioRenderer';
        if (isVideo) {
            const videoId = result.videoId;
            const authorName = (((_a = result.longBylineText) === null || _a === void 0 ? void 0 : _a.runs[0])
                || ((_b = result.ownerText) === null || _b === void 0 ? void 0 : _b.runs[0])
                || ((_c = result.shortBylineText) === null || _c === void 0 ? void 0 : _c.runs[0])).text;
            const authorAvatar = (_f = (_e = (_d = result === null || result === void 0 ? void 0 : result.channelThumbnailSupportedRenderers) === null || _d === void 0 ? void 0 : _d.channelThumbnailWithLinkRenderer) === null || _e === void 0 ? void 0 : _e.thumbnail.thumbnails.find((obj) => 'url' in obj && typeof obj.url === 'string')) === null || _f === void 0 ? void 0 : _f.url;
            const thumbnail = result.thumbnail.thumbnails.pop().url;
            const title = ((_g = result.title.runs.find((obj) => 'text' in obj && typeof obj.text === 'string')) === null || _g === void 0 ? void 0 : _g.text)
                || ((_h = result.title.accessibility) === null || _h === void 0 ? void 0 : _h.accessibilityData.label);
            const description = ((_k = (_j = result.detailedMetadataSnippets) === null || _j === void 0 ? void 0 : _j.find((obj) => 'snippetText' in obj && obj.snippetText && typeof obj.snippetText === 'object' && 'runs' in obj.snippetText && Array.isArray(obj.snippetText.runs))) === null || _k === void 0 ? void 0 : _k.snippetText.runs.filter((run) => 'text' in run && typeof run.text === 'string').map((run) => run.text).join(''))
                || '';
            const viewH = ((_l = result.viewCountText) === null || _l === void 0 ? void 0 : _l.simpleText)
                || ((_m = result.shortViewCountText) === null || _m === void 0 ? void 0 : _m.simpleText)
                || ((_p = (_o = result.shortViewCountText) === null || _o === void 0 ? void 0 : _o.accessibility) === null || _p === void 0 ? void 0 : _p.accessibilityData.label);
            const view = (((viewH === null || viewH === void 0 ? void 0 : viewH.indexOf('x')) === -1
                ? viewH === null || viewH === void 0 ? void 0 : viewH.split(' ')[0]
                : viewH === null || viewH === void 0 ? void 0 : viewH.split('x')[0]) || viewH).trim();
            const durationH = ((_r = (_q = result.lengthText) === null || _q === void 0 ? void 0 : _q.accessibility) === null || _r === void 0 ? void 0 : _r.accessibilityData.label)
                || ((_u = (_t = (_s = result.thumbnailOverlays) === null || _s === void 0 ? void 0 : _s.find((v) => Object.keys(v)[0] === 'thumbnailOverlayTimeStatusRenderer')) === null || _t === void 0 ? void 0 : _t.thumbnailOverlayTimeStatusRenderer.text.accessibility) === null || _u === void 0 ? void 0 : _u.accessibilityData.label);
            const duration = ((_v = result.lengthText) === null || _v === void 0 ? void 0 : _v.simpleText) || ((_x = (_w = result.thumbnailOverlays) === null || _w === void 0 ? void 0 : _w.find((v) => Object.keys(v)[0] === 'thumbnailOverlayTimeStatusRenderer')) === null || _x === void 0 ? void 0 : _x.thumbnailOverlayTimeStatusRenderer.text.simpleText);
            let durationS = (duration.split('.').length && duration.indexOf(':') === -1 ?
                duration.split('.')
                : duration.split(':'))
                .reduce((prev, curr, i, arr) => {
                prev += durationMultipliers[arr.length]['' + i] * parseInt(curr);
                return prev;
            }, 0);
            const publishedTime = (_y = result.publishedTimeText) === null || _y === void 0 ? void 0 : _y.simpleText;
            results.video.push({
                authorName,
                authorAvatar,
                videoId,
                url: encodeURI('https://www.youtube.com/watch?v=' + videoId),
                thumbnail,
                title,
                description,
                publishedTime,
                durationH,
                durationS,
                duration,
                viewH,
                view,
                type: 'video'
            });
        }
        if (isChannel) {
            const channelId = result.channelId;
            // idk?
            const subscriberH = (((_z = result.videoCountText.accessibility) === null || _z === void 0 ? void 0 : _z.accessibilityData.label)
                || result.videoCountText.simpleText).trim();
            const channelName = result.title.simpleText
                || ((_0 = result.shortBylineText.runs.find((run) => 'text' in run && typeof run.text === 'string')) === null || _0 === void 0 ? void 0 : _0.text);
            const username = result.subscriberCountText.simpleText;
            const avatar = result.thumbnail.thumbnails.pop().url;
            const description = result.descriptionSnippet.runs.filter((run) => 'text' in run && typeof run.text === 'string')
                .map((run) => run.text)
                .join('');
            const subscriber = subscriberH.split(' ')
                .slice(0, subscriberH.split(' ').length - 1)
                .join(' ');
            const isVerified = ((_1 = result.ownerBadges.find((badge) => 'metadataBadgeRenderer' in badge && badge.metadataBadgeRenderer && typeof badge.metadataBadgeRenderer === 'object')) === null || _1 === void 0 ? void 0 : _1.metadataBadgeRenderer.style) === 'BADGE_STYLE_TYPE_VERIFIED'
                || false;
            results.channel.push({
                channelId,
                url: encodeURI('https://www.youtube.com/channel/' + channelId),
                channelName,
                username,
                avatar: encodeURI('https:' + avatar),
                isVerified,
                subscriberH,
                subscriber,
                description,
                type: 'channel'
            });
        }
        if (isMix) {
            results.playlist.push({
                playlistId: result.playlistId,
                title: result.title.simpleText,
                thumbnail: result.thumbnail.thumbnails.pop().url,
                video: result.videos.map(({ childVideoRenderer }) => {
                    return {
                        videoId: childVideoRenderer.videoId,
                        title: childVideoRenderer.title.simpleText,
                        durationH: childVideoRenderer.lengthText.accessibility
                            .accessibilityData.label,
                        duration: childVideoRenderer.lengthText.simpleText
                    };
                }),
                type: 'mix'
            });
        }
    }
    return index_js_1.YoutubeSearchSchema.parse(results);
}
exports.default = youtubeSearch;
const durationMultipliers = {
    1: {
        0: 1
    },
    2: {
        0: 60,
        1: 1
    },
    3: {
        0: 3600,
        1: 60,
        2: 1
    }
};
