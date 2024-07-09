"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const Utils_1 = require("../Utils");
const Constant_1 = require("../Constant");
function validatingLimit(value) {
    if (value >= 100) {
        return 50;
    }
    return value;
}
async function search(query, limitValue = 50) {
    try {
        const { data } = await Utils_1.Axios.get(Constant_1.MusicApiJamendoBaseUrl + "/v3.0/tracks/", {
            params: {
                client_id: "f5db3eb4",
                format: "json",
                limit: validatingLimit(limitValue),
                order: "downloads_total",
                include: "",
                imagesize: "200",
                groupby: "artist_id",
                namesearch: query,
            },
        }).catch((e) => e?.response);
        if (data &&
            data.results &&
            Array.isArray(data.results) &&
            data.results.length) {
            const _sortie = [];
            const _filtered = data.results.filter((v) => v.audiodownload_allowed && v.audio);
            for (const obj of _filtered) {
                _sortie.push({
                    title: obj.name,
                    artist: obj.artist_name,
                    album: obj.album_name,
                    release_date: obj.releasedate,
                    thumbnail: obj.image,
                    audio: obj.audio,
                });
            }
            return _sortie;
        }
        else {
            throw new Error(data?.headers?.error_message ||
                data?.headers?.warnings ||
                `Failed to retrieve data from ${Constant_1.MusicApiJamendoBaseUrl}`);
        }
    }
    catch (e) {
        return {
            error: true,
            message: String(e),
        };
    }
}
exports.search = search;
