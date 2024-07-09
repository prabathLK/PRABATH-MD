var assert = require('assert'),
    path = require('path'),
    spawn = require('child_process').spawn;

describe('publish', function () {
    var script = path.resolve(__dirname, '..', 'bin', 'publish.js');
    var opts = {
      cwd: path.resolve(__dirname, '..')
    };
    describe('#publishTag', function () {
        it('should use the default config value when not provided', function (done) {
            var testTagDefault = spawn(script, ['--test'], opts),
                output = "";
						testTagDefault.stderr.on('data', function (data) {
                output += data;
            });
            testTagDefault.on('close', function (code) {
								assert.ok(!output.includes('Using tag'), 'The output included "Using tag":\n' + output);
								assert.ifError(code, 'Unexpected error code: ' + code);
                done();
            });
        });
        it('should set the tag provided', function (done) {
            var testTagSet = spawn(script, ['--test', '--tag', 'foo'], opts),
                output = "";
						testTagSet.stderr.on('data', function (data) {
                output += data;
            });
            testTagSet.on('close', function (code) {
								assert.ok(output.includes('Using tag foo'), 'The output did not include "Using tag foo":\n' + output);
								assert.ok(code, 'Unexpected error code: ' + code);
                done();
            });
        });
    });
});

// older versions of node did not support String.includes(), Polyfill from MDN:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes#Polyfill
if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    if (typeof start !== 'number') {
      start = 0;
    }
    
    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}
