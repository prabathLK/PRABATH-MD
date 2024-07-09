"use strict";
var nodeFs = require("fs");
var nodePath = require("path");

// Implements the fs interface required by js-git/fs-db
var fs = module.exports = {};

fs.readFile = readFile;
fs.readChunk = readChunk;
fs.writeFile = writeFile;
fs.readDir = readDir;
fs.rename = rename;

// Reads all bytes for given path.
// => binary
// => undefined if file does not exist
function readFile(path, callback) {
  nodeFs.readFile(path, function (err, binary) {
    if (err) {
      if (err.code === "ENOENT") return callback();
      return callback(err);
    }
    return callback(null, binary);
  });
}

// Reads bytes from inclusive [start, end) exclusive for given path.
// => binary
// => undefined if file does not exist
function readChunk(path, start, end, callback) {
  if (end < 0) {
    return readLastChunk(path, start, end, callback);
  }
  var stream = nodeFs.createReadStream(path, {
    start: start,
    end: end - 1
  });
  var chunks = [];
  stream.on("readable", function () {
    var chunk = stream.read();
    if (chunk === null) return callback(null, Buffer.concat(chunks));
    return chunks.push(chunk);
  });
  stream.on("error", function (err) {
    if (err.code === "ENOENT") return callback();
    return callback(err);
  });
}

// Node.js readable streams do not support reading from a position to the end
// of the file, but we can roll our own using the lower-level fs.open and
// fs.read on a file descriptor, which allows read to seek.
function readLastChunk(path, start, end, callback) {
  nodeFs.open(path, "r", function (err, fd) {
    if (err) {
      if (err.code === "EACCES") return callback();
      return callback(err);
    }
    var buffer = new Buffer(4096);
    var length = 0;
    read();
    // Only the first read needs to seek.
    // All subsequent reads will continue from the end of the previous.
    start = null;

    function read() {
      if (buffer.length - length === 0) {
        grow();
      }
      nodeFs.read(fd, buffer, length, buffer.length - length, start, onread);
    }

    function onread(err, bytesRead) {
      if (err) return callback(err);
      length += bytesRead;
      if (bytesRead === 0) {
        return callback(null, buffer.slice(0, buffer.length + end));
      }
      read();
    }

    function grow() {
      var newBuffer = new Buffer(buffer.length * 2);
      buffer.copy(newBuffer);
      buffer = newBuffer;
    }
  });
}

// Writes all bytes over file at given path.
// Creates all necessary parent directories.
// => undefined
function writeFile(path, binary, callback) {
  mkdirp(nodePath.dirname(path), function (err) {
    if (err) return callback(err);
    nodeFs.writeFile(path, binary, callback);
  });
}

// Renames the given file.
// Creates all necessary parent directories.
// => undefined
function rename(oldPath, newPath, callback) {
  var oldBase = nodePath.dirname(oldPath);
  var newBase = nodePath.dirname(newPath);
  if (oldBase === newBase) {
    return nodeFs.rename(oldPath, newPath, callback);
  }
  mkdirp(nodePath.dirname(path), function (err) {
    if (err) return callback(err);
    nodeFs.rename(oldPath, newPath, callback);
  });
}

// Reads all entry names for a given path.
// All names are relative to the directory itself, not fully qualified paths.
// => array<name>
// => undefined if directory does not exist
function readDir(path, callback) {
  nodeFs.readdir(path, function (err, names) {
    if (err) {
      if (err.code === "ENOENT") return callback();
      return callback(err);
    }
    return callback(null, names);
  });
}

function mkdirp(path, callback) {
  nodeFs.mkdir(path, function (err) {
    if (err) {
      if (err.code === "ENOENT") {
        return mkdirp(nodePath.dirname(path), function (err) {
          if (err) return callback(err);
          nodeFs.mkdir(path, function (err) {
            if (err && err.code !== "EEXIST") return callback(err);
            return callback();
          });
        });
      }
      if (err.code === "EEXIST") return callback();
      return callback(err);
    }
    callback();
  });
}
