# Changelog

## [0.2.6] - 2023-02-18

### Fixed

- Improve support for integer values
- Fix splitting null terminated buffer

## [0.2.5] - 2022-12-02

### Added

- Add ETCO and COMR frames
- Add constants for usage in tags (by @pbricout)
- Add ID3v2.4.0 text frames
- Allow mixing of ID3v2.3.0 and ID3v2.4.0 frames

### Changed

- Internal refactor of code to simplify functions (by @pbricout)

### Fixed

- Frame compression is now handled correctly

## [0.2.4] - 2022-11-09

- Add synchronised lyrics (SYLT frame) (by @pbricout)

## [0.2.3] - 2021-04-30

- Don't change APIC mime type on read
- Fix unsynchronisation implementation

## [0.2.2] - 2021-01-01

### Fixed

- Bug in iTunes where artwork doesn't show up when description is empty
- Creating tags with undefined, terminated UTF-16 value now passes FF FE 00 00 instead of 00 00
- Add raw to TypeScript definition
- Add removeTags async to TypeScript definition

### Added

- Added options to update

## [0.2.1] - 2020-10-30

### Fixed

- Removed wrong import from TypeScript definition file
- Added Promises to TypeScript definition file

## [0.2.0] - 2020-10-26

### Added

- Tests & checks with jsmediatags to ensure more consistency
- Support for UTF-8 & UTF-16LE
- Promise versions of methods are available by calling require('node-id3').Promise
- Exposed functions have JSDoc comments
- Changelog
- Pass options to .read (include, exclude, noRaw, onlyRaw)
- Read unsynchronisation & dataLengthIndicator of frame header (v2.4.0)
- Skip extended header if present

### Changed

- Frames are now build/read by a frame builder definition instead of the manual programmed way
- Change the way definitions are saved to make code simpler
- Internal functions are not exposed by index.js anymore
- Change from exporting a function constructor to exporting every function itself

### Fixed

- async read function didn't return anything when buffer was passend

## [0.1.21] - 2020-10-23

### Fixed

- Fix image reading for UTF16 descriptions

## [0.1.20] - 2020-10-22

### Added

- Implemented CTOC frame

### Fixed

- Correctly write image description

## [0.1.19] - 2020-09-25

### Fixed

- Pass Buffer.read32BE(0) optional argument
- Fix TypeScript return type for text frames

## [0.1.18] - 2020-07-30

### Added

- Add URL support

### Fixed

- Fix ID3v2.2 bug

## [0.1.17] - 2020-06-01

### Added

- Add TypeScript annotation for chapter frame (by @pablobirukov)
- Add URL frames support (WCOM, ..., WXXX) with TypeScript annotation (by @FelicitusNeko)

### Changed

- Set iconv-lite version to 0.5.1 (by @pablobirukov)

### Fixed

- Fix chapter starting at 0ms skipped bug (by @pablobirukov)
- Pass Buffer offset argument required by node v10+ (by @pablobirukov)

## [0.1.16] - 2020-03-22

### Fixed

- rename private var to _private

## [0.1.15] - 2020-03-21

### Added

- Add chapters (CHAP frame)

## [0.1.14] - 2020-03-02

### Added

- Add private frame

### Fixed

- Fix buffer index error

## [0.1.13] - 2019-11-24

### Added

- Add popularimeter #56 thanks to @tiusnonos

## [0.1.12] - 2019-11-04

### Added

- added basic ID3v2.2.0 support

### Fixed

- prevents buffer alloc from overflowing when frame body size is too big

## [0.1.11] - 2019-08-01

### Added

- Add TXXX support

## [0.1.8] - 2019-07-15

### Changed

- improve read speed performance by up to 10x

### Fixed

- fix variable leak

## [0.1.7] - 2018-10-06

### Fixed

- fix read of apic description from breaking data

## [0.1.6] - 2018-09-12

### Fixed

- fix wrong frame size for id3v2.4.0

## [0.1.3] - 2018-02-07

### Added

- add unsynchronised lyrics

### Changed

- rearrange comment reading/writing

### Fixed

- use correct text encoding

## [0.1.0] - 2017-10-11

### Added

- add create / update method
- add async versions

### Changed

- more comments and improved code quality
- better reading mechanism

## [0.0.10] - 2017-08-06

### Added

- add ability to use raw tag names
- add ability to use buffer containing an image instead of only a filepath

### Fixed

- fix problems with null characters

## [0.0.9] - 2017-01-14

### Added

- Add image read support

### Fixed

- CRITICAL: Fix wrong implementation of tag sizes

## [0.0.8] - 2017-01-12

### Added

- added comment tag

### Changed

- changed default encoding from ISO to UTF-16
- improved decode

## [0.0.7] - 2016-11-11

### Fixed

- Fixed encoding issues when reading ID3 tags

## [0.0.6] - 2016-10-24

### Changed

- Write picture as cover to create better compatibility with certain devices

## [0.0.5] - 2016-09-09

### Added

- Partial read support

### Fixed

- Fix node v6

[unreleased](https://github.com/Zazama/node-id3/compare/0.2.6...HEAD)
[0.2.6](https://github.com/Zazama/node-id3/compare/0.2.5...0.2.6)
[0.2.5](https://github.com/Zazama/node-id3/compare/0.2.4...0.2.5)
[0.2.4](https://github.com/Zazama/node-id3/compare/0.2.3...0.2.4)
[0.2.3](https://github.com/Zazama/node-id3/compare/0.2.2...0.2.3)
[0.2.2](https://github.com/Zazama/node-id3/compare/0.2.1...0.2.2)
[0.2.1](https://github.com/Zazama/node-id3/compare/0.2.0...0.2.1)
[0.2.0](https://github.com/Zazama/node-id3/compare/0.1.21...0.2.0)
[0.1.21](https://github.com/Zazama/node-id3/compare/0.1.20...0.1.21)
[0.1.20](https://github.com/Zazama/node-id3/compare/0.1.19...0.1.20)
[0.1.19](https://github.com/Zazama/node-id3/compare/0.1.18...0.1.19)
[0.1.18](https://github.com/Zazama/node-id3/compare/0.1.17...0.1.18)
[0.1.17](https://github.com/Zazama/node-id3/compare/0.1.16...0.1.17)
[0.1.16](https://github.com/Zazama/node-id3/compare/0.1.15...0.1.16)
[0.1.15](https://github.com/Zazama/node-id3/compare/0.1.14...0.1.15)
[0.1.14](https://github.com/Zazama/node-id3/compare/0.1.13...0.1.14)
[0.1.13](https://github.com/Zazama/node-id3/compare/0.1.12...0.1.13)
[0.1.12](https://github.com/Zazama/node-id3/compare/0.1.11...0.1.12)
[0.1.11](https://github.com/Zazama/node-id3/compare/0.1.8...0.1.11)
[0.1.8](https://github.com/Zazama/node-id3/compare/0.1.7...0.1.8)
[0.1.7](https://github.com/Zazama/node-id3/compare/0.1.6...0.1.7)
[0.1.6](https://github.com/Zazama/node-id3/compare/0.1.3...0.1.6)
[0.1.3](https://github.com/Zazama/node-id3/compare/0.1.0...0.1.3)
[0.1.0](https://github.com/Zazama/node-id3/compare/0.0.10...0.1.0)
[0.0.10](https://github.com/Zazama/node-id3/compare/0.0.9...0.0.10)
[0.0.9](https://github.com/Zazama/node-id3/compare/0.0.8...0.0.9)
[0.0.8](https://github.com/Zazama/node-id3/compare/0.0.7...0.0.8)
[0.0.7](https://github.com/Zazama/node-id3/compare/0.0.6...0.0.7)
[0.0.6](https://github.com/Zazama/node-id3/compare/0.0.5...0.0.6)
[0.0.5](https://github.com/Zazama/node-id3/releases/tag/0.0.5)
