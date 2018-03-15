# uscis-service-center-processing-times

> Get processing time for one or all USCIS service centers

[![Build Status](https://travis-ci.org/gr2m/uscis-service-center-processing-times.svg?branch=master)](https://travis-ci.org/gr2m/uscis-service-center-processing-times)
[![Greenkeeper badge](https://badges.greenkeeper.io/gr2m/uscis-service-center-processing-times.svg)](https://greenkeeper.io/)

| ID   | Name                            | Last update     |
|------|---------------------------------| --------------- |
| 990  | VSC - Vermont Service Center    | March 14, 2018 |
| 991  | CSC - California Service Center | March 14, 2018 |
| 992  | NSC - Nebraska Service Center   | March 14, 2018 |
| 993  | TSC - Texas Service Center      | March 14, 2018 |
| 1031 | YSC - Potomac Service Center    | March 14, 2018 |

## Usage as CLI

Requires: [latest Node LTS](https://nodejs.org/en/)

Load all service centers

```js
npx uscis-service-center-processing-times
```

Load single service center by passing center ID

```js
npx uscis-service-center-processing-times 992
```

## Usage with Node

Install with `npm install uscis-service-center-processing-times`

```js
const getServiceCenterProcessingTimes = require('uscis-service-center-processing-times')

// get all
getServiceCenterProcessingTimes()
  .then(result => {
    // {
    //   "990": {
    //     "shortName": "VSC",
    //     "longName": "Vermont Service Center",
    //     "lastUpdated": "January 5, 2018",
    //     "processingTimes": {
    //       "I-102": {
    //         "Initial issuance or replacement of a Form I-94": "April 24, 2017"
    //       },
    //       ...
    //     }
    //   },
    //   ...
    // }
  })
  .catch(console.log)

// get one
getServiceCenterProcessingTimes({id: 990})
  .then(result => {
    // {
    //   "shortName": "VSC",
    //   "longName": "Vermont Service Center",
    //   "lastUpdated": "January 5, 2018",
    //   "processingTimes": {
    //     "I-102": {
    //       "Initial issuance or replacement of a Form I-94": "April 24, 2017"
    //     },
    //     ...
    //   }
    // }
  })
  .catch(console.log)
```

### License

[Apache 2.0](LICENSE.md)
