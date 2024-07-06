"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicalDown = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
const api_1 = require("../api");
const getRequest = (url) => new Promise((resolve, reject) => {
    axios_1.default.get(api_1._musicaldownurl, {
        headers: {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/111.0"
        }
    })
        .then((data) => {
        const cookie = data.headers["set-cookie"][0].split(";")[0] + "; " + "lang=en";
        const $ = (0, cheerio_1.load)(data.data);
        const input = $("div > input").map((_, el) => $(el));
        const request = {
            [input.get(0).attr("name")]: url,
            [input.get(1).attr("name")]: input.get(1).attr("value"),
            [input.get(2).attr("name")]: input.get(2).attr("value")
        };
        resolve({ status: "success", request, cookie });
    })
        .catch((e) => resolve({ status: "error", message: "Failed to get the request form!" }));
});
const getMusic = (cookie) => new Promise((resolve, reject) => {
    axios_1.default.get(api_1._musicaldownmusicapi, {
        headers: {
            cookie: cookie,
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/111.0"
        }
    })
        .then(({ data }) => {
        const $ = (0, cheerio_1.load)(data);
        const music = $("audio > source").attr("src");
        resolve({ status: "success", result: music });
    })
        .catch((e) => resolve({ status: "error" }));
});
const MusicalDown = (url) => new Promise(async (resolve, reject) => {
    const request = await getRequest(url);
    if (request.status !== "success")
        return resolve({ status: "error", message: request.message });
    (0, axios_1.default)(api_1._musicaldownapi, {
        method: "POST",
        headers: {
            cookie: request.cookie,
            "Upgrade-Insecure-Requests": "1",
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/111.0"
        },
        data: new URLSearchParams(Object.entries(request.request))
    })
        .then(async ({ data }) => {
        const $ = (0, cheerio_1.load)(data);
        const images = [];
        $("div.row > div[class='col s12 m3']")
            .get()
            .map((v) => {
            images.push($(v).find("img").attr("src"));
        });
        let i = 1;
        let videos = {};
        $("div[class='col s12 l8'] > a")
            .get()
            .map((v) => {
            if ($(v).attr("href") !== "#modal2") {
                let text = $(v).text().trim().replace(/\s/, " ").replace("arrow_downward", "").toLowerCase();
                videos[text.includes("hd") ? "video_hd" : text.includes("watermark") ? "video_watermark" : `video${i}`] = $(v).attr("href");
                i++;
            }
        });
        if (images.length !== 0) {
            resolve({
                status: "success",
                result: {
                    type: "image",
                    author: {
                        nickname: $("h2.white-text").text().trim().replace("Download Now: Check out ", "").replace("’s video! #TikTok >If MusicallyDown has helped you, you can help us too", "").replace("Download Now: ", "").replace("If MusicallyDown has helped you, you can help us too", "")
                    },
                    images,
                    music: $("a.download").attr("href")
                }
            });
        }
        else {
            const music = await getMusic(request.cookie);
            resolve({
                status: "success",
                result: {
                    type: "video",
                    author: {
                        avatar: $("div.img-area > img").attr("src"),
                        nickname: $("div.row > div > div > h2")
                            .map((_, el) => $(el).text())
                            .get(0)
                    },
                    desc: $("div.row > div > div > h2")
                        .map((_, el) => $(el).text())
                        .get(1),
                    music: music.result,
                    ...videos
                }
            });
        }
    })
        .catch((e) => resolve({ status: "error", message: e.message }));
});
exports.MusicalDown = MusicalDown;
