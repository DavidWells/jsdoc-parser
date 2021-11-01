const convert = require('./lib/utils/json-to-jsdoc')
const deepLog = require('./test/utils/log')

const obj = {
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}

deepLog(convert(JSON.stringify(obj)))