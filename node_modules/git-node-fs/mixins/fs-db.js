var fsDb = require('js-git/mixins/fs-db');
var nodeFs = require('../lib/node-fs');

module.exports = function (repo, rootPath) {
  repo.rootPath = rootPath;
  fsDb(repo, nodeFs);
};
