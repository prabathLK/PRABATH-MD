"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = require("fs-extra");
var API_1 = __importDefault(require("./lib/API"));
var download_1 = require("./lib/download");
var Error_1 = __importDefault(require("./lib/Error"));
var getYtlink_1 = __importDefault(require("./lib/getYtlink"));
var metadata_1 = __importDefault(require("./lib/metadata"));
var SpotifyFetcher = /** @class */ (function (_super) {
    __extends(SpotifyFetcher, _super);
    function SpotifyFetcher(auth) {
        var _this = _super.call(this, auth) || this;
        /**
         * Get the track details of the given track URL
         * @param url
         * @returns {SongDetails} Track
         */
        _this.getTrack = function (url) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.verifyCredentials()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.extractTrack(this.getID(url))];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        /**
         * Gets the info the given album URL
         * @param url
         * @returns {Playlist} Album
         */
        _this.getAlbum = function (url) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.verifyCredentials()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.extractAlbum(this.getID(url))];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        /**
         * Gets the info of the given Artist URL
         * @param url
         * @returns {Artist} Artist
         */
        _this.getArtist = function (url) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.verifyCredentials()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.extractArtist(this.getID(url))];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        /**
         * Gets the list of albums from the given Artists URL
         * @param url
         * @returns {Playlist[]} Albums
         */
        _this.getArtistAlbums = function (url) { return __awaiter(_this, void 0, void 0, function () {
            var artistResult, albumsResult, albumIds, albumInfos, x, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.verifyCredentials()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, this.getArtist(url)];
                    case 2:
                        artistResult = _c.sent();
                        return [4 /*yield*/, this.extractArtistAlbums(artistResult.id)];
                    case 3:
                        albumsResult = _c.sent();
                        albumIds = albumsResult.map(function (album) { return album.id; });
                        albumInfos = [];
                        x = 0;
                        _c.label = 4;
                    case 4:
                        if (!(x < albumIds.length)) return [3 /*break*/, 7];
                        _b = (_a = albumInfos).push;
                        return [4 /*yield*/, this.extractAlbum(albumIds[x])];
                    case 5:
                        _b.apply(_a, [_c.sent()]);
                        _c.label = 6;
                    case 6:
                        x++;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/, {
                            albums: albumInfos,
                            artist: artistResult
                        }];
                }
            });
        }); };
        /**
         * Gets the playlist info from URL
         * @param url URL of the playlist
         * @returns
         */
        _this.getPlaylist = function (url) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.verifyCredentials()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.extractPlaylist(this.getID(url))];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        _this.getID = function (url) {
            var splits = url.split('/');
            return splits[splits.length - 1];
        };
        /**
         * Downloads the given spotify track
         * @param url Url to download
         * @param filename file to save to
         * @returns `buffer` if no filename is provided and `string` if it is
         */
        _this.downloadTrack = function (url, filename) { return __awaiter(_this, void 0, void 0, function () {
            var info, link, data, buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.verifyCredentials()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getTrack(url)];
                    case 2:
                        info = _a.sent();
                        return [4 /*yield*/, (0, getYtlink_1.default)("".concat(info.name, " ").concat(info.artists[0]))];
                    case 3:
                        link = _a.sent();
                        if (!link)
                            throw new Error_1.default("Couldn't get a download URL for the track: ".concat(info.name));
                        return [4 /*yield*/, (0, download_1.downloadYTAndSave)(link, filename)];
                    case 4:
                        data = _a.sent();
                        return [4 /*yield*/, (0, metadata_1.default)(info, data)];
                    case 5:
                        _a.sent();
                        if (!!filename) return [3 /*break*/, 7];
                        return [4 /*yield*/, fs_extra_1.promises.readFile(data)];
                    case 6:
                        buffer = _a.sent();
                        (0, fs_extra_1.unlink)(data);
                        /* eslint-disable @typescript-eslint/no-explicit-any */
                        return [2 /*return*/, buffer];
                    case 7: 
                    /* eslint-disable @typescript-eslint/no-explicit-any */
                    return [2 /*return*/, data];
                }
            });
        }); };
        /**
         * Gets the Buffer of track from the info
         * @param info info of the track got from `spotify.getTrack()`
         * @returns
         */
        _this.downloadTrackFromInfo = function (info) { return __awaiter(_this, void 0, void 0, function () {
            var link;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, getYtlink_1.default)("".concat(info.name, " ").concat(info.artists[0]))];
                    case 1:
                        link = _a.sent();
                        if (!link)
                            throw new Error_1.default("Couldn't get a download URL for the track: ".concat(info.name));
                        return [4 /*yield*/, (0, download_1.downloadYT)(link)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        _this.downloadBatch = function (url, type) { return __awaiter(_this, void 0, void 0, function () {
            var playlist;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.verifyCredentials()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this[type === 'album' ? 'getAlbum' : 'getPlaylist'](url)];
                    case 2:
                        playlist = _a.sent();
                        return [2 /*return*/, Promise.all(playlist.tracks.map(function (track) { return __awaiter(_this, void 0, void 0, function () {
                                var err_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, this.downloadTrack(track)];
                                        case 1: return [2 /*return*/, _a.sent()];
                                        case 2:
                                            err_1 = _a.sent();
                                            return [2 /*return*/, ''];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                }
            });
        }); };
        /**
         * Downloads the tracks of a playlist
         * @param url URL of the playlist
         * @returns `Promise<(string|Buffer)[]>`
         */
        _this.downloadPlaylist = function (url) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.downloadBatch(url, 'playlist')
                    /**
                     * Downloads the tracks of a Album
                     * @param url URL of the Album
                     * @returns `Promise<(string|Buffer)[]>`
                     */
                ];
                case 1: return [2 /*return*/, _a.sent()
                    /**
                     * Downloads the tracks of a Album
                     * @param url URL of the Album
                     * @returns `Promise<(string|Buffer)[]>`
                     */
                ];
            }
        }); }); };
        /**
         * Downloads the tracks of a Album
         * @param url URL of the Album
         * @returns `Promise<(string|Buffer)[]>`
         */
        _this.downloadAlbum = function (url) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.downloadBatch(url, 'album')
                    /**
                     * Gets the info of tracks from playlist URL
                     * @param url URL of the playlist
                     */
                ];
                case 1: return [2 /*return*/, _a.sent()
                    /**
                     * Gets the info of tracks from playlist URL
                     * @param url URL of the playlist
                     */
                ];
            }
        }); }); };
        /**
         * Gets the info of tracks from playlist URL
         * @param url URL of the playlist
         */
        _this.getTracksFromPlaylist = function (url) { return __awaiter(_this, void 0, void 0, function () {
            var playlist, tracks;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.verifyCredentials()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getPlaylist(url)];
                    case 2:
                        playlist = _a.sent();
                        return [4 /*yield*/, Promise.all(playlist.tracks.map(function (track) { return _this.getTrack(track); }))];
                    case 3:
                        tracks = _a.sent();
                        return [2 /*return*/, {
                                name: playlist.name,
                                total_tracks: playlist.total_tracks,
                                tracks: tracks
                            }];
                }
            });
        }); };
        /**
         * Gets the info of tracks from Album URL
         * @param url URL of the playlist
         */
        _this.getTracksFromAlbum = function (url) { return __awaiter(_this, void 0, void 0, function () {
            var playlist, tracks;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.verifyCredentials()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getAlbum(url)];
                    case 2:
                        playlist = _a.sent();
                        return [4 /*yield*/, Promise.all(playlist.tracks.map(function (track) { return _this.getTrack(track); }))];
                    case 3:
                        tracks = _a.sent();
                        return [2 /*return*/, {
                                name: playlist.name,
                                total_tracks: playlist.total_tracks,
                                tracks: tracks
                            }];
                }
            });
        }); };
        _this.getSpotifyUser = function (id) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.getUser(id)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); };
        return _this;
    }
    return SpotifyFetcher;
}(API_1.default));
exports.default = SpotifyFetcher;
