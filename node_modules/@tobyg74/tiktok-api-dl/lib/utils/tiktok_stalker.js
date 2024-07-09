"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiktokStalk = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
const api_1 = require("../api");
const getCookie = () => new Promise((resolve, reject) => {
    axios_1.default
        .get("https://pastebin.com/raw/ELJjcbZT")
        .then(({ data: cookie }) => {
        resolve(cookie);
    })
        .catch((e) => resolve({ status: "error", message: "Failed to fetch cookie." }));
});
const TiktokStalk = (username, options) => new Promise(async (resolve, reject) => {
    username = username.replace("@", "");
    axios_1.default
        .get(`${api_1._tiktokurl}/@${username}`, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
            cookie: (options?.cookie ? options.cookie : await getCookie())
        }
    })
        .then(({ data }) => {
        const $ = (0, cheerio_1.load)(data);
        const result = JSON.parse($("script#__UNIVERSAL_DATA_FOR_REHYDRATION__").text());
        if (!result?.__DEFAULT_SCOPE__?.["webapp.user-detail"]) {
            return resolve({
                status: "error",
                message: "User not found!"
            });
        }
        const dataUser = result.__DEFAULT_SCOPE__["webapp.user-detail"].userInfo;
        const users = {
            username: dataUser.user.uniqueId,
            nickname: dataUser.user.nickname,
            avatarLarger: dataUser.user.avatarLarger,
            avatarThumb: dataUser.user.avatarThumb,
            avatarMedium: dataUser.user.avatarMedium,
            signature: dataUser.user.signature,
            verified: dataUser.user.verified,
            privateAccount: dataUser.user.privateAccount,
            region: dataUser.user.region,
            commerceUser: dataUser.user.commerceUserInfo.commerceUser,
            usernameModifyTime: dataUser.user.uniqueIdModifyTime,
            nicknameModifyTime: dataUser.user.nickNameModifyTime
        };
        const stats = {
            followerCount: dataUser.stats.followerCount,
            followingCount: dataUser.stats.followingCount,
            heartCount: dataUser.stats.heartCount,
            videoCount: dataUser.stats.videoCount,
            likeCount: dataUser.stats.diggCount,
            friendCount: dataUser.stats.friendCount
        };
        resolve({
            status: "success",
            result: {
                users,
                stats
            }
        });
    })
        .catch((e) => resolve({ status: "error", message: e.message }));
});
exports.TiktokStalk = TiktokStalk;
