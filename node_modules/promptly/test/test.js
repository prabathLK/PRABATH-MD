'use strict';

var expect   = require('expect.js');
var promptly = require('../index');
var async    = require('async');

// Mock stdout
var stdout = '';
var oldWrite = process.stdout.write;
process.stdout.write = function (data) {
    stdout += data;
    return oldWrite.apply(process.stdout, arguments);
};

// Function to send a line to stdin
function sendLine(line) {
    setImmediate(function () {
        process.stdin.emit('data', line + '\n');
    });
}

beforeEach(function () {
    stdout = '';
});

describe('prompt()', function () {
    it('should prompt the user', function (next) {
        promptly.prompt('something: ', function (err, value) {
            expect(err).to.be(null);
            expect(value).to.be('yeaa');
            expect(stdout).to.contain('something: ');
            next();
        });

        sendLine('yeaa');
    });

    it('should keep asking if no value is passed and no default was defined', function (next) {
        promptly.prompt('something: ', function (err, value) {
            expect(err).to.be(null);
            expect(value).to.be('yeaa');
            expect(stdout).to.contain('something: ');
            expect(stdout.indexOf('something')).to.not.be(stdout.lastIndexOf('something'));
            next();
        });

        sendLine('');
        sendLine('yeaa');
    });


    it('should assume default value if nothing is passed', function (next) {
        promptly.prompt('something: ', { 'default': 'myValue' }, function (err, value) {
            expect(err).to.be(null);
            expect(value).to.be('myValue');
            expect(stdout).to.contain('something: ');
            next();
        });

        sendLine('');
    });

    it('should trim the user input if trim is enabled', function (next) {
        promptly.prompt('something: ', { trim: true }, function (err, value) {
            expect(err).to.be(null);
            expect(value).to.be('yeaa');
            expect(stdout).to.contain('something: ');
            next();
        });

        sendLine(' yeaa ');
    });

    it('should call validator after trimming', function (next) {
        function validator(value) {
            if (value !== 'yeaa') {
                throw new Error('bla');
            }

            return value;
        }

        promptly.prompt('something: ', { validator: validator, retry: false }, function (err, value) {
            expect(err).to.be(null);
            expect(value).to.be('yeaa');
            expect(stdout).to.contain('something: ');
            next();
        });

        sendLine(' yeaa ');
    });

    it('should assume values from the validator', function (next) {
        function validator() { return 'bla'; }

        promptly.prompt('something: ', { validator: validator }, function (err, value) {
            expect(err).to.be(null);
            expect(value).to.be('bla');
            expect(stdout).to.contain('something: ');
            next();
        });

        sendLine(' yeaa ');
    });

    it('should automatically retry if a validator fails by default', function (next) {
        function validator(value) {
            if (value !== 'yeaa') {
                throw new Error('bla');
            }

            return value;
        }

        promptly.prompt('something: ', { validator: validator, retry: true }, function (err, value) {
            expect(stdout).to.contain('something: ');
            expect(stdout.indexOf('something')).to.not.be(stdout.lastIndexOf('something'));
            expect(stdout).to.contain('bla');
            expect(value).to.equal('yeaa');
            next();
        });

        sendLine('wtf');
        sendLine('yeaa');
    });

    it('should give error if the validator fails and retry is false', function (next) {
        function validator() { throw new Error('bla'); }

        promptly.prompt('something: ', { validator: validator, retry: false }, function (err) {
            expect(err).to.be.an(Error);
            expect(err.message).to.be('bla');
            expect(stdout).to.contain('something: ');
            next();
        });

        sendLine(' yeaa ');
    });

    it('should give retry ability on error', function (next) {
        var times = 0;

        function validator(value) {
            if (value !== 'yeaa') {
                throw new Error('bla');
            }

            return value;
        }

        promptly.prompt('something: ', { validator: validator, retry: false }, function (err, value) {
            times++;

            if (times === 1) {
                expect(err).to.be.an(Error);
                err.retry();
                return sendLine('yeaa');
            }

            expect(value).to.equal('yeaa');
            expect(stdout).to.contain('something: ');
            expect(stdout.indexOf('something')).to.not.be(stdout.lastIndexOf('something'));
            next();
        });

        sendLine('wtf');
    });

    it('should write input to stdout by default', function (next) {
        promptly.prompt('something: ', function (err, value) {
            expect(err).to.be(null);
            expect(value).to.be('yeaa');
            expect(stdout).to.contain('something: ');
            expect(stdout).to.contain(value);
            next();
        });

        sendLine('yeaa');
    });

    it('should write input to stdout if silent is false', function (next) {
        promptly.prompt('something: ', { silent: true }, function (err, value) {
            expect(err).to.be(null);
            expect(value).to.be('yeaa');
            expect(stdout).to.contain('something: ');
            expect(stdout).to.not.contain(value);
            next();
        });

        sendLine('yeaa');
    });

    it('should prompt the user (using promise)', function (next) {
        promptly.prompt('something: ')
        .then(function (value) {
            expect(value).to.be('yeaa');
            expect(stdout).to.contain('something: ');
            next();
        })
        .catch(function () {
            expect().fail();
            next();
        });

        sendLine('yeaa');
    });
});

describe('choose()', function () {
    it('should keep asking on invalid choice', function (next) {
        promptly.choose('apple or orange? ', ['apple', 'orange'], function (err, value) {
            expect(err).to.be(null);
            expect(value).to.be('orange');
            expect(stdout).to.contain('apple or orange? ');
            expect(stdout.indexOf('apple or orange')).to.not.be(stdout.lastIndexOf('apple or orange'));
            expect(stdout).to.contain('Invalid choice');
            next();
        });

        sendLine('bleh');
        sendLine('orange');
    });

    it('should error on invalid choice if retry is disabled', function (next) {
        promptly.choose('apple or orange? ', ['apple', 'orange'], { retry: false }, function (err) {
            expect(err).to.be.an(Error);
            expect(err.message).to.contain('choice');
            expect(stdout).to.contain('apple or orange? ');
            next();
        });

        sendLine('bleh');
    });

    it('should be ok on valid choice', function (next) {
        promptly.choose('apple or orange? ', ['apple', 'orange'], function (err, value) {
            expect(err).to.be(null);
            expect(value).to.be('apple');
            expect(stdout).to.contain('apple or orange? ');
            next();
        });

        sendLine('apple');
    });

    it('should not use strict comparison when matching against valid choices', function (next) {
        promptly.choose('choices: ', [1, 2, 3], function (err, value) {
            expect(err).to.be(null);
            expect(typeof value).to.equal('number');
            expect(value).to.be(1);
            expect(stdout).to.contain('choices: ');
            next();
        });

        sendLine('1');
    });

    it('should work using promise', function (next) {
        promptly.choose('apple or orange? ', ['apple', 'orange'])
            .then(function (value) {
                expect(value).to.be('orange');
                expect(stdout).to.contain('apple or orange? ');
                next();
            })
            .catch(function () {
                expect().fail();
                next();
            });

        sendLine('orange');
    });
});

describe('confirm()', function () {
    it('should be ok on valid choice and coerce to boolean values', function (next) {
        async.forEachSeries(['yes', 'Y', 'y', '1'], function (truthy, next) {
            promptly.confirm('test yes? ', { retry: false }, function (err, value) {
                expect(err).to.be(null);
                expect(value).to.be(true);
                expect(stdout).to.contain('test yes? ');
                next();
            });

            sendLine(truthy);
        }, function () {
            async.forEachSeries(['no', 'N', 'n', '0'], function (truthy, next) {
                promptly.confirm('test no? ', function (err, value) {
                    expect(err).to.be(null);
                    expect(value).to.be(false);
                    expect(stdout).to.contain('test no? ');
                    next();
                });

                sendLine(truthy);
            }, next);
        });
    });

    it('should keep asking on invalid choice', function (next) {
        promptly.confirm('yes or no? ', function (err, value) {
            expect(err).to.be(null);
            expect(value).to.be(true);
            expect(stdout).to.contain('yes or no? ');
            expect(stdout.indexOf('yes or no')).to.not.be(stdout.lastIndexOf('yes or no'));
            next();
        });

        sendLine('bleh');
        sendLine('y');
    });

    it('should error on invalid choice if retry is disabled', function (next) {
        promptly.confirm('yes or no? ', { retry: false }, function (err) {
            expect(err).to.be.an(Error);
            expect(err.message).to.not.contain('Invalid choice');
            expect(stdout).to.contain('yes or no? ');
            next();
        });

        sendLine('bleh');
    });

    it('should work using promise', function (next) {
        promptly.confirm('yes or no? ')
            .then(function (value) {
                expect(stdout).to.contain('yes or no? ');
                expect(value).to.be(true);
                next();
            })
            .catch(function () {
                expect().fail();
                next();
            });

        sendLine('y');
    });
});

describe('password()', function () {
    it('should prompt the user silently', function (next) {
        promptly.password('something: ', function (err, value) {
            expect(value).to.be('yeaa');
            expect(stdout).to.contain('something: ');
            expect(stdout).to.not.contain('yeaa');

            next();
        });

        sendLine('yeaa');
    });

    it('should not trim by default', function (next) {
        promptly.password('something: ', function (err, value) {
            expect(value).to.be(' yeaa ');
            expect(stdout).to.contain('something: ');
            expect(stdout).to.not.contain(' yeaa ');

            next();
        });

        sendLine(' yeaa ');
    });

    it('show allow empty passwords by default', function (next) {
        promptly.password('something: ', function (err, value) {
            expect(value).to.be('');
            expect(stdout).to.contain('something: ');

            next();
        });

        sendLine('');
    });

    it('should prompt the user silently using promise', function (next) {
        promptly.password('something: ')
            .then(function (value) {
                expect(value).to.be('yeaa');
                expect(stdout).to.contain('something: ');
                expect(stdout).to.not.contain('yeaa');
                next();
            })
            .catch(function () {
                expect().fail();
                next();
            });

        sendLine('yeaa');
    });
});
