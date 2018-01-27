module.exports = getProcessingTimes

const got = require('got')
const cheerio = require('cheerio')

const USCIS_CENTER_PROCESSING_TIME_URL = 'https://egov.uscis.gov/cris/processingTimesDisplay.do'

async function getProcessingTimes (state, centerId) {
  const processingTimes = {}
  const payload = `serviceCenter=${centerId}&displaySCProcTimes=Service+Center+Processing+Dates`

  const response = await got.post(USCIS_CENTER_PROCESSING_TIME_URL, {
    body: payload,
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': payload.length,
      'Cookie': `JSESSIONID=${state.sessionId}`,
      'Referer': 'https://egov.uscis.gov/cris/processTimesDisplay.do',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.119 Safari/537.36'
    }
  })

  const $ = cheerio.load(response.body)
  const lastUpdated = $('#posted').text().substr('Last Updated: '.length)

  $('#ptResults tbody').each((i, el) => {
    const formName = $(el).attr('title')
    const form = processingTimes[formName] = {}

    $(el).find('tr th + td + td').each((i, el) => {
      const classification = $(el).text().trim()
      const processingDate = $(el).next().text().trim()
      form[classification] = processingDate
    })
  })

  return {
    processingTimes,
    lastUpdated
  }
}
