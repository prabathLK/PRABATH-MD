"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Playlist = /** @class */ (function () {
    function Playlist(name, total_tracks, tracks) {
        if (name === void 0) { name = ''; }
        if (total_tracks === void 0) { total_tracks = 0; }
        if (tracks === void 0) { tracks = []; }
        this.name = name;
        this.total_tracks = total_tracks;
        this.tracks = tracks;
    }
    return Playlist;
}());
exports.default = Playlist;
