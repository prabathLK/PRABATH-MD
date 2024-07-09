var assert = require('assert'),
    pkg = require('../package.json'),
    figaro = require('../index');

describe('publish', function () {
    before(function (done) {
        // setup default npm using our start function
        // note: npm.load() only has an affect the first time it's called in a process
        figaro.start(null, function(e) {
            assert.ifError(e);
            done();
        });
    });
    describe('#shouldPublish', function () {
        it('should publish because local version is higher than remote version', function () {
            assert.ok(figaro.shouldPublish(null, '1.3.5', '1.3.4'));
        });
        it('should not publish because local version is equal to remote version', function () {
            assert.ok(!figaro.shouldPublish(null, '1.3.5', '1.3.5'));
        });
        it('should not publish because local version is lower than remote version', function () {
            assert.ok(!figaro.shouldPublish(null, '1.3.3', '1.3.5'));
        });
        it('should not publish because on-minor does not trigger on major changes', function () {
            assert.ok(!figaro.shouldPublish({'on-minor':true}, '2.3.3', '1.3.3'));
        });
        it('should not publish because on-minor does not on trigger major and patch changes', function () {
            assert.ok(!figaro.shouldPublish({'on-minor':true}, '2.3.5', '1.3.3'));
        });
        it('should publish because on-minor triggers on minor changes', function () {
            assert.ok(figaro.shouldPublish({'on-minor':true}, '2.3.3', '2.2.3'));
        });
        it('should publish because on-minor and on-patch triggers on minor changes', function () {
            assert.ok(figaro.shouldPublish({'on-minor':true, 'on-patch': true}, '2.3.3', '2.2.3'));
        });
    });

    describe('#localPackage', function() {
        it('should report an error because it cannot find package.json', function(done) {
            figaro.localPackage(function(err) {
                assert.ok(err);
                done();
            });
        });
    });

    describe('#remoteVersion', function() {
        it('should provide the remote version of this module', function(done) {
            figaro.remoteVersion(pkg, function(err, remoteVersion) {
                assert.ifError(err);
                assert.ok(remoteVersion);
                done();
            });
        });
        it('should report an error because module not found', function (done) {
            figaro.remoteVersion({'name':'mysuperbogusnamethatcannotbefoundpublishedanywhere'}, function (err, remoteVersion) {
                assert.ok(err);
                done();
            });
        });
    });
});
