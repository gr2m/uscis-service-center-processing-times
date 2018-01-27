const getServiceCenterProcessingTimes = require('.')

const assert = require('assert')

console.log('smoke test 1 ...')

smokeTest1()

.then(() => {
  console.log('smoke test 2 ...')

  return smokeTest2()
})

.then(() => {
  console.log('done')
})

.catch(error => {
  console.log(error)
  process.exit(1)
})

async function smokeTest1 () {
  const result = await getServiceCenterProcessingTimes()

  assert.equal(Object.keys(result).length, 5, 'Finds 5 centers when no options passed')
  assert.equal(result[990].shortName, 'VSC', 'Finds Vermont Service Center with id 990')
  assert.ok(result[990].lastUpdated, 'has lastUpdated')
  assert.ok(result[990].processingTimes, 'has processingTimes')
}

async function smokeTest2 () {
  const result = await getServiceCenterProcessingTimes({id: 990})

  assert.equal(result.shortName, 'VSC', 'finds Vermont Service Center when {id:990} passed')
  assert.ok(result.lastUpdated, 'has lastUpdated')
  assert.ok(result.processingTimes, 'has processingTimes')
}
