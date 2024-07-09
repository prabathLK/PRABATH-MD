var expect = require('chai').expect;
var shell = require('shelljs');
var vizion = require("../../index.js");
var p = require('path');

if (shell.which('git') === null) process.exit(0);

describe('Functional: Git', function () {
  var testRepoPath = '';
  var tmp_meta = {};

  before(function (done) {
    shell.cd('test/fixtures');

    shell.rm('-rf', 'angular-bridge');
    shell.exec('git clone https://github.com/Unitech/angular-bridge.git', () => {
      testRepoPath = p.join(shell.pwd().toString(), 'angular-bridge');
      done()
    });
  });

  after(function () {
    shell.rm('-rf', 'angular-bridge');
    shell.cd('../..'); // go back to root
  });

  it('should recursively downgrade to first commit', function (done) {
    var callback = function (err, meta) {
      if (err) {
        return done(err);
      }

      if (meta.success === true) {
        vizion.prev({folder: testRepoPath}, callback);
      }
      else {
        expect(meta.success).to.eq(false);
        vizion.analyze({folder: testRepoPath}, function (err, meta) {
          if (err) {
            return done(err);
          }

          expect(meta.prev_rev).to.eq(null);
          expect(meta.revision).to.eq('445c0b78e447e87eaec2140d32f67652108b434e');
          done();
        });
      }
    };

    vizion.prev({folder: testRepoPath}, callback);
  });

  it('should recursively upgrade to most recent commit', function (done) {
    var callback = function (err, meta) {
      if (err) {
        return done(err);
      }

      if (meta.success === true) {
        vizion.next({folder: testRepoPath}, callback);
      }
      else {
        expect(meta.success).to.eq(false);
        vizion.analyze({folder: testRepoPath}, function (err, meta) {
          if (err) {
            return done(err);
          }
          expect(meta.next_rev).to.eq(null);
          expect(meta.revision).to.eq('d1dee188a0d82f21c05a398704ac3237f5523ca7');
          done();
        });
      }
    };

    vizion.next({folder: testRepoPath}, callback);
  });

  describe('at head', function () {

    describe('analyze', function () {
      it('ok', function (done) {
        console.log('start')
        vizion.analyze({folder: testRepoPath}, function (err, meta) {
          if (err) {
            return done(err);
          }

          expect(meta.type).to.eq('git');
          expect(meta.url).to.eq('https://github.com/Unitech/angular-bridge.git');
          expect(meta.branch).to.eq('master');
          expect(meta.comment).to.eq('Merge pull request #17 from jorge-d/express_4\n\nExpress 4');
          expect(meta.unstaged).to.eq(false);
          expect(meta.branch).to.eq('master');
          expect(meta.remotes).to.deep.eq(['origin']);
          expect(meta.remote).to.eq('origin');
          expect(meta.branch_exists_on_remote).to.eq(true);
          expect(meta.ahead).to.eq(false);
          expect(meta.next_rev).to.eq(null);
          expect(meta.prev_rev).to.eq('da29de44b4884c595468b6978fb19f17bee76893');
          expect(meta.tags).to.deep.eq(['v0.3.4']);

          tmp_meta = meta;

          done();
        });
      });
    });

    describe('isUpToDate', function () {
      it('up to date', function (done) {
        vizion.isUpToDate({
          folder: testRepoPath
        }, function (err, meta) {
          if (err) {
            return done(err);
          }

          expect(meta.is_up_to_date).to.eq(true);
          done();
        });
      });
    });

  });

  describe('previous commit', function () {
    before(function beforeTest(done) {
      vizion.revertTo({
        folder: testRepoPath,
        revision: 'eb488c1ca9024b6da2d65ef34dc1544244d8c714'
      }, function (err, meta) {
        if (err) {
          return done(err);
        }

        expect(meta.success).to.eq(true);
        done();
      });
    });

    describe('analyze', function () {

      it('ok', function it(done) {
        vizion.analyze({folder: testRepoPath}, function (err, meta) {
          if (err) {
            return done(err);
          }

          expect(meta.type).to.eq('git');
          expect(meta.branch).to.eq('master');
          expect(meta.comment).to.eq('Fix indentation\n');
          expect(meta.unstaged).to.eq(false);
          expect(meta.branch).to.eq('master');
          expect(meta.remotes).to.deep.eq(['origin']);
          expect(meta.remote).to.eq('origin');
          expect(meta.branch_exists_on_remote).to.eq(true);
          expect(meta.ahead).to.eq(false);
          expect(meta.next_rev).to.eq('759120ab5b19953886424b7c847879cf7f4cb28e');
          expect(meta.prev_rev).to.eq('0c0cb178a3de0b8c69a81d1fd2f0d72fe0f23a11');
          expect(meta.tags).to.deep.eq(['v0.3.4']);

          done();
        });
      });
    });

    describe('isUpToDate', function () {
      it('not up to date', function (done) {
        vizion.isUpToDate({
          folder: testRepoPath
        }, function (err, meta) {
          if (err) {
            return done(err);
          }

          expect(meta.is_up_to_date).to.eq(false);
          done();
        });
      });
    });

    describe('update', function () {
      it('should update to latest', function (done) {
        vizion.update({
          folder: testRepoPath
        }, function (err, meta) {
          if (err) {
            return done(err);
          }

          expect(meta.success).to.eq(true);

          vizion.analyze({folder: testRepoPath}, function (err, meta) {
            if (err) {
              return done(err);
            }

            expect(meta.revision).to.eq('d1dee188a0d82f21c05a398704ac3237f5523ca7');
            done();
          });
        });
      });
    });
  });


});
