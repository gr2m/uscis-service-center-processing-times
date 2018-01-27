module.exports = getServiceCenterProcessingTimes

const pRetry = require('p-retry')

const getCenters = require('./lib/get-centers')
const getProcessingTimes = require('./lib/get-processing-times')

async function getServiceCenterProcessingTimes (options) {
  const state = {
    sessionId: null,
    centerId: options && options.id,
    timeout: 200,
    retries: 5
  }
  const centers = await getCenters(state)

  if (state.centerId && !centers[state.centerId]) {
    const allCenterIdsString = Object.keys(centers).map(id => {
      return `${id}: ${centers[id].shortName} – ${centers[id].longName}`
    }).join('\n')
    throw new Error(`No center exists with id: ${state.centerId}. Must be one of\n${allCenterIdsString}`)
  }

  return Object.keys(centers).reduce(async (promise, centerId) => {
    await promise

    if (state.centerId && state.centerId !== parseInt(centerId, 10)) {
      return Promise.resolve(centers)
    }

    const center = centers[centerId]

    // delay to not trip over the USCIS server
    const processingTimes = await pRetry(
      getProcessingTimes.bind(null, state, centerId),
      {
        retries: state.retries,
        minTimeout: state.timeout,
        randomize: true
      }
    )
    Object.assign(center, processingTimes)

    return Promise.resolve(centers)
  }, Promise.resolve())

  .then(centers => {
    if (state.centerId) {
      return centers[state.centerId]
    }

    return centers
  })
}
