module.exports = getCenters

const got = require('got')
const cheerio = require('cheerio')

const USCIS_PROCESSING_TIME_URL = 'https://egov.uscis.gov/cris/processTimesDisplay.do'

async function getCenters (state) {
  const {body, headers} = await got(USCIS_PROCESSING_TIME_URL)
  state.sessionId = headers['set-cookie'][0].match(/^JSESSIONID=(\w+)/).pop()
  const $ = cheerio.load(body)
  const centers = {}

  $('#serviceCenter option').each((i, el) => {
    const [shortName, longName] = $(el).text().trim().split(' - ')
    const id = $(el).val()
    centers[id] = {
      id,
      shortName,
      longName
    }
  })

  return centers
}
