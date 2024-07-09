# Changelog

## 2.0.0

- add borders: false option
- Adapt test to mocha
- Replace manual padding with .padEnd
- Allow only Node 8
- Update travis test suite
- Upgrade chalk to 3.0.0

0.3.1 / 2014-10-22
==================

 * fix example for new paths
 * Readme badges
 * Lighter production installs
 * Safe colors
 * In addition to 256-xterm ansi colors, handle 24-bit colors
 * set up .travis.yml

0.3.0 / 2014-02-02
==================

 * Switch version of colors to avoid npm broken-ness
 * Handle custom colored strings correctly
 * Removing var completely as return var width caused other problems.
 * Fixing global leak of width variable.
 * Omit horizontal decoration lines if empty
 * Add a test for the the compact mode
 * Make line() return the generated string instead of appending it to ret
 * Customize the vertical cell separator separately from the right one
 * Allow newer versions of colors to be used
 * Added test for bordercolor
 * Add bordercolor in style options and enable deepcopy of options

0.2.0 / 2012-10-21
==================

  * test: avoid module dep in tests
  * fix type bug on integer vertical table value
  * handle newlines in vertical and cross tables
  * factor out common style setting function
  * handle newlines in body cells
  * fix render bug when no header provided
  * correctly calculate width of cells with newlines
  * handles newlines in header cells
  * ability to create cross tables
  * changing table chars to ones that windows supports
  * allow empty arguments to Table constructor
  * fix headless tables containing empty first row
  * add vertical tables
  * remove reference to require.paths
  * compact style for dense tables
  * fix toString without col widths by cloning array
  * [api]: Added abiltity to strip out ANSI color escape codes when calculating cell padding

0.0.1 / 2011-01-03
==================

Initial release


## Jun 28, 2017

Fork of `Automattic/cli-table`

- Merges [cli-table/#83](https://github.com/Automattic/cli-table/pull/83) (test in [6d5d4b](https://github.com/keymetrics/cli-table/commit/6d5d4b293295e312ad1370e28f409e5a3ff3fc47)) to add array method names in the data set.
- Releases a fix on null/undefined values, [cli-table/#71](https://github.com/Automattic/cli-table/pull/71).
- Lint the code using [standard](https://github.com/standard/standard).
- Use `chalk` instead of `colors`.
- Bump version to stable `1.0.0`
