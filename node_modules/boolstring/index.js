var boolString = function(string) {
    return ['true', 'yes', 'enabled', 'enable', 'valid', 'on', '1'].includes(string.toLowerCase());
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = boolString;
}