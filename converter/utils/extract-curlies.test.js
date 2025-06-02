const { test } = require('uvu') 
const assert = require('uvu/assert')
const { extractOutermostCurlyBrackets } = require('./extract-curlies')

test('Handles open brackets', async () => {
  const input = "This is {some text"
  const result = extractOutermostCurlyBrackets(input)
  /*
  console.log('extractOutermostCurlyBrackets', result)
  /** */
  assert.equal(result, [])
})

test('Handles closing brackets', async () => {
  const input = "This is {some text}}";
  const result = extractOutermostCurlyBrackets(input)
  /*
  console.log('extractOutermostCurlyBrackets', result)
  /** */
  assert.equal(result, ['{some text}'])
})

test('extractOutermostCurlyBrackets', async () => {
  const input = "This is {some {nested} text} with {outermost} brackets"
  const result = extractOutermostCurlyBrackets(input)
  /*
  console.log('extractOutermostCurlyBrackets', result)
  /** */
  assert.equal(result, ['{some {nested} text}', '{outermost}'])
})

test('extractOutermostCurlyBrackets two', async () => {
  const input = "This is {some text} with {outermost} brackets"
  const result = extractOutermostCurlyBrackets(input)
  /*
  console.log('extractOutermostCurlyBrackets', result)
  /** */
  assert.equal(result, ['{some text}', '{outermost}'])
})



test.run()