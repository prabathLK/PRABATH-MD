# google-it [![Build Status](https://travis-ci.org/PatNeedham/google-it.svg?branch=master)](https://travis-ci.org/PatNeedham/google-it) [![npm version](https://badge.fury.io/js/google-it.svg)](https://www.npmjs.com/package/google-it) [![Codecov Coverage](https://img.shields.io/codecov/c/github/PatNeedham/google-it/master.svg?style=flat-square)](https://codecov.io/gh/PatNeedham/google-it/) [![Maintainability](https://api.codeclimate.com/v1/badges/fe8329b7641ea86326e4/maintainability)](https://codeclimate.com/github/PatNeedham/google-it/maintainability)

A simple library to convert Google search results to JSON output, with an interactive display option coming in the near future.

## Install

`$ npm install --save -g google-it`

## Example Usage

`$ google-it --query="Latvian unicorn"`

![GIF of google-it](./images/google-it-demo.gif?raw=true "google-it")

Prevent display in the terminal, and save results to a JSON file:

`$ google-it --query="PWAs with react-router and redux" -o results.json -n`

![GIF of google-it w/o display, results saved to file](./images/google-it-output-no-display.gif?raw=true "google-it")

`$ google-it --query="open whisper systems" -O 5`

![GIF of opening-in-browser](./images/open-results-in-browser.gif?raw=true "google-it-to-browser")

`$ google-it --query="mechanical turk" --only-urls`

![Screenshot of only-urls option](./images/onlyUrls.png?raw=true "onlyUrls")

### Command Line Arguments
- [x] *query* - the query that should be sent to the Google search
- [x] *output* - name of the JSON file to save results to
- [x] *no-display* - prevent results from appearing in the terminal output. Should only be used with --output (-o) command when saving results to a file
- [ ] *save* - name of the html file if you want to save the actual response from the html request (useful for debugging purposes)
- [x] *limit* - number of search results to be returned
- [x] *only-urls* - only display the URLs, instead of the titles and snippets
- [ ] *verbose* - console.log useful statements to show what's currently taking place
- [ ] *interactive* - once results are returned, show them in an interactive prompt where user can scroll through them
- [ ] *bold-matching-text* - only takes effect when interactive (-i) flag is set as well, will bold test in results that matched the query
- [x] *includeSites* - option to limit results to comma-separated list of sites
- [x] *excludeSites* - option to exclude results that appear in comma-separated list of sites
- [x] *open* - opens the first X number of results in the browser after finishing query
- [x] *disableConsole* - intended to be used with programmatic use, so that the color-coded search results are not displayed in the terminal (via console.log) when not wanted.

### Programmatic Use in NodeJS environment

- [x] something like:

```js
const  googleIt = require('google-it')

googleIt({'query': 'covfefe irony'}).then(results => {
  // access to results object here
}).catch(e => {
  // any possible errors that might have occurred (like no Internet connection)
})

// with request options
const options = {
  'proxy': 'http://localhost:8118'
};
googleIt({options, 'query': 'covfefe irony'}).then(results => {
  // access to results object here
}).catch(e => {
  // any possible errors that might have occurred (like no Internet connection)
})
```
