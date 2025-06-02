const fs = require('fs').promises
const path = require('path')
const { test } = require('uvu') 
const assert = require('uvu/assert')
const { parseCode } = require('./code-to-jsdoc')

const util = require('util')

function deepLog(myObject) {
  console.log(util.inspect(myObject, {showHidden: false, depth: null, colors: true}))
}

test('Run it', async () => {
  const filePath = path.resolve(__dirname, 'tests/fixtures/simple-function.js')
  const code = await fs.readFile(filePath, 'utf8')
  const values = parseCode(code, { filePath })
  /*
  console.log('Values')
  // deepLog(values[0].jsDocs.render)
  // process.exit(1)
  /** */

  assert.equal(values[0].jsDocs.render, '/**\n' +
  '* function simpleFunction\n' +
  '* @param {*} [one]\n' +
  '* @param {*} [two]\n' +
  '* @return {object}\n' +
  '*/')
})

test.run()