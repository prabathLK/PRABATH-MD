"use strict";

/* eslint-disable no-extra-parens */

/* eslint-disable no-console */
var fs = require('fs');

var _process$env = process.env,
    GOOGLE_IT_TITLE_SELECTOR = _process$env.GOOGLE_IT_TITLE_SELECTOR,
    GOOGLE_IT_LINK_SELECTOR = _process$env.GOOGLE_IT_LINK_SELECTOR,
    GOOGLE_IT_SNIPPET_SELECTOR = _process$env.GOOGLE_IT_SNIPPET_SELECTOR,
    GOOGLE_IT_RESULT_STATS_SELECTOR = _process$env.GOOGLE_IT_RESULT_STATS_SELECTOR,
    GOOGLE_IT_CURSOR_SELECTOR = _process$env.GOOGLE_IT_CURSOR_SELECTOR,
    _process$env$GOOGLE_I = _process$env.GOOGLE_IT_INCLUDE_SITES,
    GOOGLE_IT_INCLUDE_SITES = _process$env$GOOGLE_I === void 0 ? '' : _process$env$GOOGLE_I,
    _process$env$GOOGLE_I2 = _process$env.GOOGLE_IT_EXCLUDE_SITES,
    GOOGLE_IT_EXCLUDE_SITES = _process$env$GOOGLE_I2 === void 0 ? '' : _process$env$GOOGLE_I2; // NOTE:
// I chose the User-Agent value from http://www.browser-info.net/useragents
// Not setting one causes Google search to not display results

var defaultUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:34.0) Gecko/20100101 Firefox/34.0';
var defaultLimit = 10;
var defaultStart = 0;

var getFullQuery = function getFullQuery(query) {
  var includeSites = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : GOOGLE_IT_INCLUDE_SITES;
  var excludeSites = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : GOOGLE_IT_EXCLUDE_SITES;

  if (includeSites === '' && excludeSites === '') {
    return query;
  }

  if (includeSites !== '') {
    var _addition = includeSites.split(',').map(function (site) {
      return " site:".concat(site);
    }).join(' OR');

    return query + _addition;
  }

  var addition = excludeSites.split(',').map(function (site) {
    return " -site:".concat(site);
  }).join(' AND');
  return query + addition;
};

var getDefaultRequestOptions = function getDefaultRequestOptions(_ref) {
  var limit = _ref.limit,
      query = _ref.query,
      userAgent = _ref.userAgent,
      start = _ref.start,
      includeSites = _ref.includeSites,
      excludeSites = _ref.excludeSites;
  return {
    url: 'https://www.google.com/search',
    qs: {
      q: getFullQuery(query, includeSites, excludeSites),
      num: limit || defaultLimit,
      start: start || defaultStart
    },
    headers: {
      'User-Agent': userAgent || defaultUserAgent
    }
  };
};

var titleSelector = 'div.Gx5Zad.fP1Qef.xpd.EtOod.pkphOe';
var titlefinder = 'div.BNeawe.vvjwJb.AP7Wnd';
var linkSelector = 'div.fP1Qef > div:nth-child(1) > a';
var snippetSelector = '#main > div > div > div > div:not(.v9i61e) > div.AP7Wnd';
var resultStatsSelector = '#resultStats';
var cursorSelector = '#nav > tbody > tr > td.cur';

var getTitleSelector = function getTitleSelector(passedValue) {
  return passedValue || GOOGLE_IT_TITLE_SELECTOR || titleSelector;
};

var getLinkSelector = function getLinkSelector(passedValue) {
  return passedValue || GOOGLE_IT_LINK_SELECTOR || linkSelector;
};

var getSnippetSelector = function getSnippetSelector(passedValue) {
  return passedValue || GOOGLE_IT_SNIPPET_SELECTOR || snippetSelector;
};

var getResultStatsSelector = function getResultStatsSelector(passedValue) {
  return passedValue || GOOGLE_IT_RESULT_STATS_SELECTOR || resultStatsSelector;
};

var getResultCursorSelector = function getResultCursorSelector(passedValue) {
  return passedValue || GOOGLE_IT_CURSOR_SELECTOR || cursorSelector;
};

var logIt = function logIt(message, disableConsole) {
  if (!disableConsole) {
    console.log(message);
  }
};

var saveToFile = function saveToFile(output, results) {
  if (output !== undefined) {
    fs.writeFile(output, JSON.stringify(results, null, 2), 'utf8', function (err) {
      if (err) {
        console.error("Error writing to file ".concat(output, ": ").concat(err));
      }
    });
  }
};

var saveResponse = function saveResponse(response, htmlFileOutputPath) {
  if (htmlFileOutputPath) {
    fs.writeFile(htmlFileOutputPath, response.body, function () {
      console.log("Html file saved to ".concat(htmlFileOutputPath));
    });
  }
};

module.exports = {
  defaultUserAgent: defaultUserAgent,
  defaultLimit: defaultLimit,
  defaultStart: defaultStart,
  getDefaultRequestOptions: getDefaultRequestOptions,
  getTitleSelector: getTitleSelector,
  getLinkSelector: getLinkSelector,
  titleSelector: titleSelector,
  titlefinder: titlefinder,
  linkSelector: linkSelector,
  snippetSelector: snippetSelector,
  getSnippetSelector: getSnippetSelector,
  resultStatsSelector: resultStatsSelector,
  getResultStatsSelector: getResultStatsSelector,
  getResultCursorSelector: getResultCursorSelector,
  logIt: logIt,
  saveToFile: saveToFile,
  saveResponse: saveResponse,
  getFullQuery: getFullQuery
};