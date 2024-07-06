
var assert = require("assert");
var path = require("path");
var fs = require("./lib/node-fs");
var nodeFs = require("fs");

var directoryPath = path.join(__dirname, "test", "fixtures");
var temporaryPath = path.join(__dirname, "test", "temporary.txt");
var numbersPath = path.join(directoryPath, "numbers.txt");
var nonPath = path.join(directoryPath, "nope.txt");

fs.readFile(numbersPath, function (err, numbers) {
  assert.strictEqual(err, null);
  assert.strictEqual(numbers.toString("utf-8"), "0123456789\n");
});

fs.readFile(nonPath, function (err, numbers) {
  assert.strictEqual(err, undefined);
  assert.strictEqual(numbers, undefined);
});

fs.readChunk(numbersPath, 2, 4, function (err, numbers) {
  assert.strictEqual(err, null);
  assert.strictEqual(numbers.toString("utf-8"), "23");
});

fs.readChunk(nonPath, 2, 4, function (err, numbers) {
  assert.strictEqual(err, undefined);
  assert.strictEqual(numbers, undefined);
});

fs.readDir(directoryPath, function (err, names) {
  assert.strictEqual(err, null);
  assert.strictEqual(1, names.length);
  assert.strictEqual("numbers.txt", names[0]);
});

fs.writeFile(temporaryPath, new Buffer("Hello, World!\n"), function (err) {
  assert.strictEqual(err, null);
  fs.readFile(temporaryPath, function (err, content) {
    assert.strictEqual(err, null);
    assert.strictEqual("Hello, World!\n", content.toString());
    nodeFs.unlink(temporaryPath, function (err) {
      assert.strictEqual(err, null);
    });
  });
});

