"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Artist = /** @class */ (function () {
    function Artist(id, name, herf) {
        if (id === void 0) { id = ''; }
        if (name === void 0) { name = ''; }
        if (herf === void 0) { herf = ''; }
        this.id = id;
        this.name = name;
        this.herf = herf;
    }
    return Artist;
}());
exports.default = Artist;
