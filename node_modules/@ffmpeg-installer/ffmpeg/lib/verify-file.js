var fs = require('fs');

/**
 * @param {string} file
 * @return {boolean}
 */
function verifyFile(file) {
    try {
        var stats = fs.statSync(file);
        return stats.isFile();
    } catch (ignored) {
        return false;
    }
}

module.exports = verifyFile;
