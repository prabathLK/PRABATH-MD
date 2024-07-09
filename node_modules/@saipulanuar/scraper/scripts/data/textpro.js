const got = require('got')
const { load } = require('cheerio')
const { writeFileSync } = require('fs')

const PAGE = 12
const MAX_PARAMETERS = 3
const BASE_URL = 'https://textpro.me';
(async () => {
  const url = `${BASE_URL}/home-p`
  const results = []
  for (let i = 1; i <= PAGE; i++) {
    const html = await got(`${url}${i}`)
    const $ = load(html.body)
    const links = $('div.col-md-12 > div.row > div.col-md-4')
    links.each(async (i, e) => {
      const link = $(e).find('a').attr('href')
      const title = $(e).find('.title-effect-home').text()
      if (!link || !title) return
      const html = await got(`${BASE_URL}${link}`)
      const $$ = load(html.body)
      const parameters = []
      for (let j = 0; j <= MAX_PARAMETERS; j++) {
        const parameter = $$(`#text-${j}`).length
        const isParameterExist = !!parameter
        parameters.push(isParameterExist)
        if (isParameterExist) {
          // eslint-disable-next-line eqeqeq
          for (let k = 0; k <= parameter.length; k++) if (parameters[k] == false) throw new Error(`${title} is not parameterized`)
        }
      }
      if (link && title) {
        results.push({
          link,
          title,
          parameters
        })
      }
    })
  }
  writeFileSync('data/textpro.json', JSON.stringify(results, null, 2))
})()
