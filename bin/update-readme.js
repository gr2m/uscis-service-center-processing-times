const octokit = require('@octokit/rest')()

const getServiceCenterProcessingTimes = require('..')

if (!process.env.GH_TOKEN) {
  console.log('GH_TOKEN must be set')
  process.exit(1)
}

if (!process.env.TRAVIS_REPO_SLUG) {
  console.log('TRAVIS_REPO_SLUG must be set')
  process.exit(1)
}

const regex = /\| \d{3,4}[^\n]+/g
const [owner, repo] = process.env.TRAVIS_REPO_SLUG.split('/')
let readmeContent
let readmeSha

octokit.authenticate({
  type: 'token',
  token: process.env.GH_TOKEN
})

loadReadme()

.then(findReadmeLastUpdate)

.then(loadCenters)

.then(console.log)

.catch(console.log)

async function loadReadme () {
  console.log('🤖  loading README')
  const {data: {content, sha}} = await octokit.repos.getContent({
    owner,
    repo,
    path: 'README.md'
  })

  readmeSha = sha

  return Buffer.from(content, 'base64').toString()
}

function findReadmeLastUpdate (readme) {
  readmeContent = readme
  const lines = readmeContent.match(regex)

  return lines.reduce((map, line) => {
    const [, id, , lastUpdated] = line.split(/\s*\|\s*/)
    map[id] = lastUpdated
    return map
  }, {})
}

async function loadCenters (readmeLastUpdated) {
  console.log('🤖  loading centers')
  const centers = await getServiceCenterProcessingTimes()

  let hasChanges = false
  Object.keys(centers).forEach(id => {
    if (centers[id].lastUpdated !== readmeLastUpdated[id]) {
      hasChanges = true
      readmeLastUpdated[id] = centers[id].lastUpdated
    }
  })

  if (!hasChanges) {
    console.log('🤖  everything is up-to-date')
    return
  }

  readmeContent = readmeContent.replace(/\| \d{3,4}[^\n]+/g, function (line, id) {
    const centerId = line.match(/^\|\s*(\d+)/).pop()
    return line.replace(/\|([^|]+)\|\s*$/, `| ${centers[centerId].lastUpdated} |`)
  })

  await octokit.repos.updateFile({
    owner,
    repo,
    path: 'README.md',
    message: 'USCIS center last update changed',
    content: Buffer.from(readmeContent).toString('base64'),
    sha: readmeSha
  })

  console.log('🤖  README.md updated')
}
