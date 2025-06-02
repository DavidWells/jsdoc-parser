const { test } = require('uvu')
const doxxx = require('../lib/dox')
const assert = require('uvu/assert')

const emptyCode = ``

test('Parses empty code ok', async () => {
  const result = doxxx.parseComments(emptyCode)
  assert.equal(result, [])
})

test.run()