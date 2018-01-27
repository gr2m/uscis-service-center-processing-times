#! /usr/bin/env node

const table = require('markdown-table')

const getServiceCenterProcessingTimes = require('..')

const [centerId] = process.argv.slice(2)

if (centerId) {
  if (isNaN(parseInt(centerId, 10))) {
    console.log(`${centerId} is not a valid USCIS center ID, must be a number`)
    process.exit(1)
  }

  getServiceCenterProcessingTimes({id: parseInt(centerId, 10)})

  .then(logResult)

  .catch(error => {
    console.log(error)
    process.exit(1)
  })
} else {
  getServiceCenterProcessingTimes()

  .then((result) => {
    Object.keys(result).map(centerId => result[centerId]).forEach(logResult)
  })

  .catch(error => {
    console.log(error.message)
    process.exit(1)
  })
}

function logResult (result) {
  console.log(`${result.shortName} - ${result.longName} (${result.id})`)

  Object.keys(result.processingTimes).forEach(formId => {
    console.log(`\n${formId}\n`)

    const forms = Object.keys(result.processingTimes[formId]).reduce((list, description) => {
      list.push([description, result.processingTimes[formId][description]])
      return list
    }, [])

    console.log(table(forms))
  })

  console.log(`\nLast updated: ${result.lastUpdated}\n`)
}

function logUsage () {
  console.log()
}
