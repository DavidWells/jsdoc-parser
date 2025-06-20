const { test } = require('uvu')
const assert = require('uvu/assert')
const doxxx = require('../lib/dox')
const deepLog = require('../test/utils/log')

const code = `
/**!
 * Test
 * here
 */
`

test('Parses trailing ignore !', async () => {
  const result = doxxx.parseComments(code)
  // deepLog(result)
  assert.equal(result[0].isIgnored, true)

  assert.equal(result, [
    {
      description: {
        summary: 'Test\nhere',
        body: '',
        text: 'Test\nhere',
        html: '<p>Test<br />\nhere</p>',
        summaryHtml: '<p>Test<br />\nhere</p>',
        bodyHtml: ''
      },
      tags: [],
      isIgnored: true,
      isPrivate: false,
      isConstructor: false,
      isClass: false,
      isEvent: false,
      line: 2,
      comment: {
        lines: [ 2, 5 ],
        text: '!\nTest\nhere',
        rawText: '/**!\n * Test\n * here\n */',
      },
      validationErrors: []
    }
  ])
})


const codeTwo = `
/**!
 * Function Name
 *
 * @param {String} a
 * @param {Number} b
 */
`

test('Parses trailing ignore ! in function', async () => {
  const result = doxxx.parseComments(codeTwo)
  // deepLog(result)
  assert.equal(result[0].isIgnored, true)
})

const codeThree = `
/**
 * Function Name
 *
 * @ignore
 * @param {String} a
 * @param {Number} b
 */
`

test('Ignore via @ignore tag', async () => {
  const result = doxxx.parseComments(codeThree)
  // deepLog(result)
  assert.equal(result[0].isIgnored, true)
})

test.run()