/* eslint-disable no-extra-parens */
/* eslint-disable no-console */

const fs = require('fs');

const {
  GOOGLE_IT_TITLE_SELECTOR,
  GOOGLE_IT_LINK_SELECTOR,
  GOOGLE_IT_SNIPPET_SELECTOR,
  GOOGLE_IT_RESULT_STATS_SELECTOR,
  GOOGLE_IT_CURSOR_SELECTOR,
  GOOGLE_IT_INCLUDE_SITES = '',
  GOOGLE_IT_EXCLUDE_SITES = '',
} = process.env;

// NOTE:
// I chose the User-Agent value from http://www.browser-info.net/useragents
// Not setting one causes Google search to not display results
const defaultUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:34.0) Gecko/20100101 Firefox/34.0';

const defaultLimit = 10;
const defaultStart = 0;

const getFullQuery = (
  query,
  includeSites = GOOGLE_IT_INCLUDE_SITES,
  excludeSites = GOOGLE_IT_EXCLUDE_SITES
) => {
  if (includeSites === '' && excludeSites === '') {
    return query;
  }
  if (includeSites !== '') {
    const addition = includeSites.split(',').map((site) => ` site:${site}`).join(' OR');
    return query + addition;
  }
  const addition = excludeSites.split(',').map((site) => ` -site:${site}`).join(' AND');
  return query + addition;
};

const getDefaultRequestOptions = ({
  limit, query, userAgent, start, includeSites, excludeSites,
}) => ({
  url: 'https://www.google.com/search',
  qs: {
    q: getFullQuery(query, includeSites, excludeSites),
    num: limit || defaultLimit,
    start: start || defaultStart,
  },
  headers: {
    'User-Agent': userAgent || defaultUserAgent,
  },
});

var titleSelector = 'div.Gx5Zad.fP1Qef.xpd.EtOod.pkphOe';
var titlefinder = 'div.BNeawe.vvjwJb.AP7Wnd';
var linkSelector = 'div.fP1Qef > div:nth-child(1) > a';
const snippetSelector = '#main > div > div > div > div:not(.v9i61e) > div.AP7Wnd';
const resultStatsSelector = '#resultStats';
const cursorSelector = '#nav > tbody > tr > td.cur';

const getTitleSelector = (passedValue) => (
  passedValue || GOOGLE_IT_TITLE_SELECTOR || titleSelector
);

const getLinkSelector = (passedValue) => (
  passedValue || GOOGLE_IT_LINK_SELECTOR || linkSelector
);

const getSnippetSelector = (passedValue) => (
  passedValue || GOOGLE_IT_SNIPPET_SELECTOR || snippetSelector
);

const getResultStatsSelector = (passedValue) => (
  passedValue || GOOGLE_IT_RESULT_STATS_SELECTOR || resultStatsSelector
);

const getResultCursorSelector = (passedValue) => (
  passedValue || GOOGLE_IT_CURSOR_SELECTOR || cursorSelector
);

const logIt = (message, disableConsole) => {
  if (!disableConsole) {
    console.log(message);
  }
};

const saveToFile = (output, results) => {
  if (output !== undefined) {
    fs.writeFile(output, JSON.stringify(results, null, 2), 'utf8', (err) => {
      if (err) {
        console.error(`Error writing to file ${output}: ${err}`);
      }
    });
  }
};

const saveResponse = (response, htmlFileOutputPath) => {
  if (htmlFileOutputPath) {
    fs.writeFile(htmlFileOutputPath, response.body, () => {
      console.log(`Html file saved to ${htmlFileOutputPath}`);
    });
  }
};

module.exports = {
  defaultUserAgent,
  defaultLimit,
  defaultStart,
  getDefaultRequestOptions,
  getTitleSelector,
  getLinkSelector,
  titleSelector,
  titlefinder,
  linkSelector,
  snippetSelector,
  getSnippetSelector,
  resultStatsSelector,
  getResultStatsSelector,
  getResultCursorSelector,
  logIt,
  saveToFile,
  saveResponse,
  getFullQuery,
};
