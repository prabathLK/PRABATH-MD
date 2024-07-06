var expect = require('chai').expect;
var fs = require('fs');
var sinon = require('sinon');
var ini = require('ini');

var git = require("../../lib/git/git.js");
var jsGitService = require("../../lib/git/js-git-service.js");


describe('Unit: git', function () {

  describe('parseGitConfig', function parseGitConfigTest() {
    var folder = "my-folder";
    var config = {stub: 'config'};
    var data = {stub: 'data'};
    var readFileStub, parseStub;

    before(function beforeTest() {
      readFileStub = sinon.stub(fs, 'readFile').callsFake(function (path, encoding, cb) {
        if (process.platform !== 'win32' && process.platform !== 'win64')
          expect(path).to.eq('my-folder/.git/config');
        else
          expect(path).to.eq('my-folder\\.git\\config');

        cb(null, data);
      });

      parseStub = sinon.stub(ini, 'parse').callsFake(function (myData) {
        expect(myData).to.eq(data);

        return config;
      });
    });

    it('ok', function it(done) {
      git.parseGitConfig(folder, function (err, myConfig) {
        if (err) {
          return done(err);
        }

        expect(myConfig).to.eq(config);
        done();
      })
    });

    after(function afterTest() {
      readFileStub.restore();
      parseStub.restore();
    });
  });

  describe('getUrl', function getUrlTest() {
    var folder = "my-folder";
    var config = {
      'remote "origin"': {
        url: 'test-url'
      }
    };
    var parseGitConfigStub;

    before(function beforeTest() {
      parseGitConfigStub = sinon.stub(git, 'parseGitConfig').callsFake(function (myFolder, cb) {
        expect(myFolder).to.eq(folder);

        cb(null, config);
      });
    });

    it('ok', function it(done) {
      git.getUrl(folder, function (err, data) {
        if (err) {
          return done(err);
        }

        expect(data).to.deep.eq({
          "type": "git",
          "url": "test-url"
        });
        done();
      });
    });

    after(function afterTest() {
      parseGitConfigStub.restore();
    });
  });


  describe('getCommitInfo', function getCommitInfoTest() {
    var folder = "my-folder";
    var commit = {
      hash: 'xfd4560',
      message: 'my message'
    };
    var data = {};
    var getHeadCommitStub;

    before(function beforeTest() {
      getHeadCommitStub = sinon.stub(jsGitService, 'getHeadCommit').callsFake(function (myFolder, cb) {
        expect(myFolder).to.eq(folder);

        cb(null, commit);
      });
    });

    it('ok', function it(done) {
      git.getCommitInfo(folder, data, function (err, data) {
        if (err) {
          return done(err);
        }

        expect(data).to.deep.eq({
          "revision": commit.hash,
          "comment": commit.message
        });
        done();
      });
    });

    after(function afterTest() {
      getHeadCommitStub.restore();
    });
  });

  describe('getBranch', function getBranchTest() {
    var folder = "my-folder";
    var data = {};
    var readFileStub;

    before(function beforeTest() {
      readFileStub = sinon.stub(fs, 'readFile').callsFake(function (path, encoding, cb) {
        if (process.platform !== 'win32' && process.platform !== 'win64')
            expect(path).to.eq('my-folder/.git/HEAD');
        else
            expect(path).to.eq('my-folder\\.git\\HEAD');
        expect(encoding).to.eq('utf-8');

        cb(null, "ref: refs/heads/master");
      });
    });

    it('ok', function it(done) {
      git.getBranch(folder, data, function (err, data) {
        if (err) {
          return done(err);
        }

        expect(data).to.deep.eq({
          "branch": "master",
        });
        done();
      });
    });

    after(function afterTest() {
      readFileStub.restore();
    });
  });

  describe('getRemote', function getRemoteTest() {
    var folder = "my-folder";
    var config = {
      'remote "origin"': {
        url: 'test-url'
      },
      'remote "other"': {
        url: 'other-url'
      }
    };
    var data = {};
    var parseGitConfigStub;

    before(function beforeTest() {
      parseGitConfigStub = sinon.stub(git, 'parseGitConfig').callsFake(function (myFolder, cb) {
        expect(myFolder).to.eq(folder);

        cb(null, config);
      });
    });

    it('ok', function it(done) {
      git.getRemote(folder, data, function (err, data) {
        if (err) {
          return done(err);
        }

        expect(data).to.deep.eq({
          "remote": "origin",
          "remotes": [
            "origin",
            "other"
          ]
        });
        done();
      });
    });

    after(function afterTest() {
      parseGitConfigStub.restore();
    });
  });


  describe('isCurrentBranchOnRemote', function isCurrentBranchOnRemoteTest() {
    var folder = "my-folder";
    var data = {
      branch: 'my-branch',
      remote: 'my-remote'
    };
    var getRefHashStub;

    context('not on remote', function () {
      before(function beforeTest() {
        getRefHashStub = sinon.stub(jsGitService, 'getRefHash').callsFake(function (myFolder,myBranch,myRemote, cb) {
          expect(myFolder).to.eq(folder);
          expect(myBranch).to.eq(data.branch);
          expect(myRemote).to.eq(data.remote);

          cb(null, null);
        });
      });

      it('ok', function it(done) {
        git.isCurrentBranchOnRemote(folder, data, function (err, data) {
          if (err) {
            return done(err);
          }

          expect(data).to.deep.eq({
            "branch": "my-branch",
            "branch_exists_on_remote": false,
            "remote": "my-remote"
          });
          done();
        });
      });

      after(function afterTest() {
        getRefHashStub.restore();
      });
    });

    context('on remote', function () {
      before(function beforeTest() {
        getRefHashStub = sinon.stub(jsGitService, 'getRefHash').callsFake(function (myFolder,myBranch,myRemote, cb) {
          expect(myFolder).to.eq(folder);
          expect(myBranch).to.eq(data.branch);
          expect(myRemote).to.eq(data.remote);

          cb(null, "FX421345CX");
        });
      });

      it('ok', function it(done) {
        git.isCurrentBranchOnRemote(folder, data, function (err, data) {
          if (err) {
            return done(err);
          }

          expect(data).to.deep.eq({
            "branch": "my-branch",
            "branch_exists_on_remote": true,
            "remote": "my-remote"
          });
          done();
        });
      });

      after(function afterTest() {
        getRefHashStub.restore();
      });
    });

  });

  describe('getPrevNext', function getPrevNextTest() {
    var folder = "my-folder";
    var data = {
      branch_exists_on_remote:true,
      branch: 'my-branch',
      remote: 'my-remote',
      revision: '2'
    };
    var commitHistory = [
      {hash: '3'},
      {hash: '2'},
      {hash: '1'},
    ];
    var getCommitHistoryStub;

    before(function beforeTest() {
      getCommitHistoryStub = sinon.stub(jsGitService, 'getCommitHistory').callsFake(function (myFolder, n, myBranch, myRemote, cb) {
        expect(myFolder).to.eq(folder);
        expect(n).to.eq(100);
        expect(myBranch).to.eq(data.branch);
        expect(myRemote).to.eq(data.remote);

        cb(null, commitHistory);
      });
    });

    it('ok', function it(done) {
      git.getPrevNext(folder, data, function (err, data) {
        if (err) {
          return done(err);
        }

        expect(data).to.deep.eq({
          "ahead": false,
          "branch": "my-branch",
          "branch_exists_on_remote": true,
          "next_rev": "3",
          "prev_rev": "1",
          "remote": "my-remote",
          "revision": "2"
        });
        done();
      });
    });

    after(function afterTest() {
      getCommitHistoryStub.restore();
    });
  });

});