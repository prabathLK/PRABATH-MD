# publish

[![Build Status](https://secure.travis-ci.org/cmanzana/node-publish.png)](http://travis-ci.org/cmanzana/node-publish)

npm module to automate publishing of npm modules
Useful when you want to publish every time you bump the version in your module as part of your continuos integration setup.

When running publish in your module:
- if your module is not yet in the registry then publish will do nothing (you need to publish manually the first version of your module)
- if your module has the same version, or lower version than the version in the registry then publish will do nothing
- if your module has bigger version than the version in the registry then publish will perform a ['npm publish'](http://npmjs.org/doc/publish.html) of your module

## Installation

npm install publish

## Usage

The most common way of using publish is to have it as a posttest script in your package.json:

    "scripts": {
      "test": "tap test/*.js", // tap as an example
      "posttest": "publish"
    }

which means that on successful test run, publish will try to 'npm publish' your module.

Notice that your CI machine needs to be configured with an npm user (http://npmjs.org/doc/adduser.html) that is
authorized to publish the package.

The options that you can use with publish are:

* --on-major  Publishes on major version changes.
* --on-minor  Publishes on minor version changes.
* --on-patch  Publishes on patch version changes.
* --on-build  Publishes on build version changes.
* --test      Prints the versions of the packages and whether it would publish.
* --tag <tag> Publishes the change with the given tag. (npm defaults to 'latest')
* --version   Print the version of publish.
* --help      Print the help of publish.

### Examples

    publish --on-major --on-minor

will only publish when the local major or minor versions are higher than the remote ones

    publish --on-build

will only publish when the local build version is higher than the remote one

    publish

will only publish when the local version is higher than the remote one


## License
[MIT](https://github.com/cmanzana/node-publish/blob/master/MIT-LICENSE)
