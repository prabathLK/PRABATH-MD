var npm = require('npm'),
    semver = require('semver'),
    fs = require('fs'),
		log = require('npmlog');

log.heading = 'publish';

exports.start = function(tagName, callback) {
		var loadOptions = {};
		if (tagName) {
				log.info('Using tag', tagName);
				loadOptions.tag = tagName;
		}
    npm.load(loadOptions, function (err) {
        callback(err, npm);
    });
};

function localPackage(callback) {
    try {
        callback(null, JSON.parse(fs.readFileSync('./package.json')));
    } catch (err) {
        callback(err);
    }
}
exports.localPackage = localPackage;

function remoteVersion(localPackage, callback) {
    npm.commands.view([localPackage.name, 'version'], true, function (err, message) {
        if (err) {
            if (err.code === 'E404') {
                callback('You have not published yet your first version of this module: publish will do nothing\n' +
                         'You must publish manually the first release of your module');
            } else {
                callback(err);
            }
        } else {
            for (var remoteVersion in message) break;
						if (remoteVersion) {
            		callback(null, remoteVersion);
						} else {
								callback('No version of this package has yet been published for tag "' + npm.config.get('tag') + '".\n' +
										     'You must publish manually the first release of your module');
						}
        }
    });
}
exports.remoteVersion = remoteVersion;

exports.publish = function(options, callback) {
    localPackage(function(err, pkg) {
        if (err) {
            callback('publish can only be performed from the root of npm modules (where the package.json resides)');
        } else {
            var localVersion = pkg.version;
            if (localVersion == null) {
                callback('you have not defined a version in your npm module, check your package.json');
            }

            remoteVersion(pkg, function(err, remoteVersion) {
                if (err) {
                    callback(err);
                } else if (shouldPublish(options, localVersion, remoteVersion) && !options.test) {
                    if (isTravis()) {
                        log.info('running in travis');
                        var npmUser = npmUserCredentials();
                        if (npmUser) {
                            npmAddUser(npmUser, function(err) {
                                if (err) {
                                    callback('error while trying to add npm user in travis: ' + err);
                                } else {
                                    npmPublish(callback);
                                }
                            });
                        } else {
                            callback('npm user credentials not found, make sure NPM_USERNAME, NPM_PASSWORD and NPM_EMAIL environment variables are set');
                        }
                    } else {
                        npmPublish(callback);
                    }
                }
            });
        }
    });
};


function npmPublish(callback) {
    npm.commands.publish([], false, function (err, message) {
        if (err) {
						log.error('publish failed:', message);
            callback(err);
        } else {
            log.info('published ok');
            callback();
        }
    });
}

function npmUserCredentials() {
    if (process.env.NPM_USERNAME && process.env.NPM_PASSWORD && process.env.NPM_EMAIL) {
        return {'username':process.env.NPM_USERNAME, 'password':process.env.NPM_PASSWORD, 'email':process.env.NPM_EMAIL}
    } else {
        return null;
    }
}

function isTravis() {
    return process.env.TRAVIS;
}

function npmAddUser(npmUser, callback) {
    npm.registry.adduser(npmUser.username, npmUser.password, npmUser.email, function(err) {
        npm.config.set("email", npmUser.email, "user");
        callback(err);
    });
}

function shouldPublish(options, localVersion, remoteVersion) {
    options = options || {};

    log.info('Local version: ' + localVersion);
    log.info('Published version: ' + remoteVersion);
    if (semver.eq(remoteVersion, localVersion)) {
        log.info('Your local version is the same as your published version: publish will do nothing');
        return false;
    } else if (semver.gt(remoteVersion, localVersion)) {
        log.warn('Your local version is smaller than your published version: publish will do nothing');
        return false;
    } else if (containsOnVersion(options)) {
        var diff = semver.diff(remoteVersion, localVersion);
        if (!options['on-' + diff]) {
            log.info('Your local version does not satisfy your --on-[major|minor|patch|build] options; publish will do nothing');
            return false;
        }
    }
		log.info('Defined criteria met; publish will release a new version');
		return true;
}
exports.shouldPublish = shouldPublish;

function containsOnVersion(options) {
    return options['on-major'] || options['on-minor'] || options['on-patch'] || options['on-build'];
}
