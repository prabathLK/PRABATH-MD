var testFiles = require('./helpers/testfiles');
var test = require('tape');
var binaryType = require('../');

test('bmp test file guessed as image/bmp', function(t) {
  t.plan(1);
  t.equal(binaryType.guess(testFiles.bmp), 'image/bmp', 'ok');
});

test('gif89a test file guessed as image/gif', function(t) {
  t.plan(1);
  t.equal(binaryType.guess(testFiles.gif), 'image/gif', 'ok');
});

test('jpeg test file guessed as image/jpeg', function(t) {
  t.plan(1);
  t.equal(binaryType.guess(testFiles.jpeg), 'image/jpeg', 'ok');
});

test('jpeg #2 test file guessed as image/jpeg', function(t) {
  t.plan(1);
  t.equal(binaryType.guess(testFiles.jpeg2), 'image/jpeg', 'ok');
});

test('png test file guessed as image/png', function(t) {
  t.plan(1);
  t.equal(binaryType.guess(testFiles.png), 'image/png', 'ok');
});

test('pdf test file guessed as application/pdf', function(t) {
  t.plan(1);
  t.equal(binaryType.guess(testFiles.pdf), 'application/pdf', 'ok');
});

test('ogg test file guessed as audio/ogg', function(t) {
  t.plan(1);
  t.equal(binaryType.guess(testFiles.ogg), 'audio/ogg', 'ok');
});
