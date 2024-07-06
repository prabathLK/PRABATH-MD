'use strict';

var crc_table = [];

for (var n = 0; n < 256; n++) {
    var c = crc_table[n] = new Buffer(4);
    c.writeUInt32BE(n, 0);

    for (var k = 0; k < 8; k++) {
        var b0 = c[0] & 1;
        var b1 = c[1] & 1;
        var b2 = c[2] & 1;
        var b3 = c[3] & 1;

        c[0] = (c[0] >> 1) ^ (b3 ? 0xed : 0);
        c[1] = (c[1] >> 1) ^ (b3 ? 0xb8 : 0) ^ (b0 ? 0x80 : 0);
        c[2] = (c[2] >> 1) ^ (b3 ? 0x83 : 0) ^ (b1 ? 0x80 : 0);
        c[3] = (c[3] >> 1) ^ (b3 ? 0x20 : 0) ^ (b2 ? 0x80 : 0);
    }
}

function update(c, buf) {
    var l = buf.length;
    for (var n = 0; n < l; n++) {
        var e = crc_table[c[3] ^ buf[n]];
        c[3] = e[3] ^ c[2];
        c[2] = e[2] ^ c[1];
        c[1] = e[1] ^ c[0];
        c[0] = e[0];
    }
}

function crc32(/* arguments */) {
    var l = arguments.length;
    var c = new Buffer(4);
    c.fill(0xff);

    for (var i = 0; i < l; i++) {
        update(c, new Buffer(arguments[i]));
    }

    c[0] = c[0] ^ 0xff;
    c[1] = c[1] ^ 0xff;
    c[2] = c[2] ^ 0xff;
    c[3] = c[3] ^ 0xff;

    return c.readUInt32BE(0);
}

module.exports = crc32;
