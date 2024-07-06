# ffmpeg-static

Static **[ffmpeg](https://ffmpeg.org) binaries for macOS, Linux, Windows.**

Supports macOS (64-bit and arm64), Linux (32 and 64-bit, armhf, arm64), Windows (32 and 64-bit). [The ffmpeg version currently used is `6.0`.](https://github.com/eugeneware/ffmpeg-static/releases/tag/b6.0)

[![npm version](https://img.shields.io/npm/v/ffmpeg-static.svg)](https://www.npmjs.com/package/ffmpeg-static)
![minimum Node.js version](https://img.shields.io/node/v/ffmpeg-static.svg)

*Note:* The version of `ffmpeg-static` follows [SemVer](http://semver.org). When releasing new versions, **we do *not* consider breaking changes in `ffmpeg` itself**, but only the JS interface (see below). For example, `ffmpeg-static@4.5.0` might download ffmpeg `5.0`. To prevent an `ffmpeg-static` upgrade downloading backwards-incompatible ffmpeg versions, [use a strict version range](https://docs.npmjs.com/files/package.json#dependencies) for it or use a [lockfile](https://docs.npmjs.com/files/package-lock.json).

Also check out [`node-ffmpeg-installer`](https://github.com/kribblo/node-ffmpeg-installer)!

## Installation

``` bash
$ npm install ffmpeg-static
```

*Note:* During installation, it will download the appropriate `ffmpeg` binary from the [`b6.0` GitHub release](https://github.com/eugeneware/ffmpeg-static/releases/tag/b6.0). Use and distribution of the binary releases of `ffmpeg` are covered by their respective license.

### Custom binaries url

By default, the `ffmpeg` binary will get downloaded from `https://github.com/eugeneware/ffmpeg-static/releases/download`. To customise this, e.g. when using a mirror, set the `FFMPEG_BINARIES_URL` environment variable.

```shell
export FFMPEG_BINARIES_URL=https://cdn.npmmirror.com/binaries/ffmpeg-static
npm install ffmpeg-static
```

### Electron & other cross-platform packaging tools

Because `ffmpeg-static` will download a binary specific to the OS/platform, you need to purge `node_modules` before (re-)packaging your app *for a different OS/platform* ([read more in #35](https://github.com/eugeneware/ffmpeg-static/issues/35#issuecomment-630225392)).

## Example Usage

Returns the path of a statically linked ffmpeg binary on the local filesystem.

``` js
const pathToFfmpeg = require('ffmpeg-static')
console.log(pathToFfmpeg)
// /Users/j/playground/node_modules/ffmpeg-static/ffmpeg
```

Check the [example script](example.js) for a more thorough example.

## Sources of the binaries

The binaries downloaded by `ffmpeg-static` are from these locations:

- [Windows x64 builds](https://www.gyan.dev/ffmpeg/builds/)
- [Windows x86 builds](https://github.com/sudo-nautilus/FFmpeg-Builds-Win32/)
- [Linux x64/x86/ARM/ARM64 builds](https://johnvansickle.com/ffmpeg/)
- macOS [x64 (Intel)](https://evermeet.cx/pub/ffmpeg/) & [ARM64 (Apple Silicon)](https://osxexperts.net/) builds

## Show your support

This npm package includes statically linked binaries that are produced by the following individuals. Please consider supporting and donating to them who have been providing quality binary builds for many years:

- **Linux builds**: [John Van Sickle](https://www.johnvansickle.com/ffmpeg/)
- **macOS builds**: [Helmut K. C. Tessarek](https://evermeet.cx/ffmpeg/#donations)
