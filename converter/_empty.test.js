const fs = require('fs').promises
const path = require('path')
const { test } = require('uvu') 
const assert = require('uvu/assert')
const { parseCode } = require('./code-to-jsdoc')

const util = require('util')

function deepLog(myObject) {
  console.log(util.inspect(myObject, {showHidden: false, depth: null, colors: true}))
}

test('Handles empty function', async () => {
  const code = await fs.readFile(path.resolve(__dirname, 'tests/fixtures/empty-function.js'), 'utf8')
  const values = parseCode(code)
  deepLog(values)
  assert.equal(values, [
    {
      name: 'emptyFunction',
      nameWithKind: 'function emptyFunction',
      isAsync: false,
      params: {
        ast: [],
        paramStr: '',
        paramData: [],
        paramNames: [],
        inferredTypes: {}
      },
      varDeclarations: { asts: [] },
      returnStatements: { asts: [], inferredTypes: [] },
      code: 'function emptyFunction() {\n\n}',
      position: { start: 2, end: 31 },
      jsDocs: {
        name: 'emptyFunction',
        description: 'function emptyFunction',
        fnParamNames: [],
        fnParams: [],
        returnStatements: [],
        isFunction: true,
        data: {},
        render: ''
      }
    }
  ])
})

test.run()