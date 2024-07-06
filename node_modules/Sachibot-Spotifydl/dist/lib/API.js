"use strict";
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
var spotify_web_api_node_1 = __importDefault(require("spotify-web-api-node"));
var Atrist_1 = __importDefault(require("./details/Atrist"));
var Playlist_1 = __importDefault(require("./details/Playlist"));
var Track_1 = __importDefault(require("./details/Track"));
var MAX_LIMIT_DEFAULT = 50;
var REFRESH_ACCESS_TOKEN_SECONDS = 55 * 60;
var SpotifyApi = /** @class */ (function () {
    function SpotifyApi(auth) {
        var _this = this;
        this.auth = auth;
        this.verifyCredentials = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!this.nextTokenRefreshTime || this.nextTokenRefreshTime < new Date())) return [3 /*break*/, 2];
                        this.nextTokenRefreshTime = new Date();
                        this.nextTokenRefreshTime.setSeconds(this.nextTokenRefreshTime.getSeconds() + REFRESH_ACCESS_TOKEN_SECONDS);
                        return [4 /*yield*/, this.checkCredentials()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); };
        this.checkCredentials = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.spotifyAPI.getRefreshToken()];
                    case 1:
                        if (!!(_a.sent())) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.requestTokens()];
                    case 2: return [2 /*return*/, void (_a.sent())];
                    case 3: return [4 /*yield*/, this.refreshToken()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.requestTokens = function () { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.spotifyAPI.clientCredentialsGrant()];
                    case 1:
                        data = (_a.sent()).body;
                        this.spotifyAPI.setAccessToken(data['access_token']);
                        this.spotifyAPI.setRefreshToken(data['refresh_token']);
                        return [2 /*return*/];
                }
            });
        }); };
        this.refreshToken = function () { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.spotifyAPI.refreshAccessToken()];
                    case 1:
                        data = (_a.sent()).body;
                        this.spotifyAPI.setAccessToken(data['access_token']);
                        return [2 /*return*/];
                }
            });
        }); };
        this.extractTrack = function (trackId) { return __awaiter(_this, void 0, void 0, function () {
            var data, details;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.spotifyAPI.getTrack(trackId)];
                    case 1:
                        data = (_a.sent()).body;
                        details = new Track_1.default();
                        details.name = data.name;
                        data.artists.forEach(function (artist) {
                            details.artists.push(artist.name);
                        });
                        details.album_name = data.album.name;
                        details.release_date = data.album.release_date;
                        details.cover_url = data.album.images[0].url;
                        return [2 /*return*/, details];
                }
            });
        }); };
        this.extractPlaylist = function (playlistId) { return __awaiter(_this, void 0, void 0, function () {
            var data, details, offset, playlistTracksData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.spotifyAPI.getPlaylist(playlistId)];
                    case 1:
                        data = (_a.sent()).body;
                        details = new Playlist_1.default('', 0, data.tracks.items.map(function (item) { return item.track.id; }));
                        details.name = data.name + ' - ' + data.owner.display_name;
                        details.total_tracks = data.tracks.total;
                        if (!data.tracks.next) return [3 /*break*/, 4];
                        offset = details.tracks.length;
                        _a.label = 2;
                    case 2:
                        if (!(details.tracks.length < details.total_tracks)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.spotifyAPI.getPlaylistTracks(playlistId, { limit: MAX_LIMIT_DEFAULT, offset: offset })];
                    case 3:
                        playlistTracksData = (_a.sent()).body;
                        details.tracks = details.tracks.concat(playlistTracksData.items.map(function (item) { return item.track.id; }));
                        offset += MAX_LIMIT_DEFAULT;
                        return [3 /*break*/, 2];
                    case 4: return [2 /*return*/, details];
                }
            });
        }); };
        this.extractAlbum = function (albumId) { return __awaiter(_this, void 0, void 0, function () {
            var data, details, offset, albumTracks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.spotifyAPI.getAlbum(albumId)];
                    case 1:
                        data = (_a.sent()).body;
                        details = new Playlist_1.default('', 0, data.tracks.items.map(function (item) { return item.id; }));
                        details.name = data.name + ' - ' + data.label;
                        details.total_tracks = data.tracks.total;
                        if (!data.tracks.next) return [3 /*break*/, 4];
                        offset = details.tracks.length;
                        _a.label = 2;
                    case 2:
                        if (!(details.tracks.length < data.tracks.total)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.spotifyAPI.getAlbumTracks(albumId, { limit: MAX_LIMIT_DEFAULT, offset: offset })];
                    case 3:
                        albumTracks = (_a.sent()).body;
                        details.tracks = details.tracks.concat(albumTracks.items.map(function (item) { return item.id; }));
                        offset += MAX_LIMIT_DEFAULT;
                        return [3 /*break*/, 2];
                    case 4: return [2 /*return*/, details];
                }
            });
        }); };
        this.extractArtist = function (artistId) { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.spotifyAPI.getArtist(artistId)];
                    case 1:
                        data = (_a.sent()).body;
                        return [2 /*return*/, new Atrist_1.default(data.id, data.name, data.href)];
                }
            });
        }); };
        this.extractArtistAlbums = function (artistId) { return __awaiter(_this, void 0, void 0, function () {
            var artistAlbums, albums, offset, additionalArtistAlbums;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.spotifyAPI.getArtistAlbums(artistId, { limit: MAX_LIMIT_DEFAULT })];
                    case 1:
                        artistAlbums = (_a.sent()).body;
                        albums = artistAlbums.items;
                        if (!artistAlbums.next) return [3 /*break*/, 4];
                        offset = albums.length;
                        _a.label = 2;
                    case 2:
                        if (!(albums.length < artistAlbums.total)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.spotifyAPI.getArtistAlbums(artistId, { limit: MAX_LIMIT_DEFAULT, offset: offset })];
                    case 3:
                        additionalArtistAlbums = (_a.sent()).body;
                        albums = albums.concat(additionalArtistAlbums.items);
                        offset += MAX_LIMIT_DEFAULT;
                        return [3 /*break*/, 2];
                    case 4: return [2 /*return*/, albums];
                }
            });
        }); };
        this.getUser = function (id) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.verifyCredentials()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.spotifyAPI.getUser(id)];
                    case 2: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        this.spotifyAPI = new spotify_web_api_node_1.default(this.auth);
    }
    return SpotifyApi;
}());
exports.default = SpotifyApi;
