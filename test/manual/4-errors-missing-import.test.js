const { test } = require('uvu')
const assert = require('uvu/assert')
const doxxx = require('../../lib/dox')
const deepLog = require('../utils/log')

const missingImportCode = `
/**
* Renders a <Button /> component
* @param { import("./types").Pet } p - Pet type
* @return {React.ReactElement} - React component
* @example
  <Button>
    hi
  </Button>
*/
export default function Button(props = {}) {
  return (
    <button>{props.text || 'my button'}</button>
  )
}
`

test('Throws on missing type import', async () => {
  let comments
  let error
  try {
    comments = doxxx.parseComments(missingImportCode)
  } catch(e) {
    error = e.message
  }
  /*
  deepLog(comments)
  process.exit(1)
  /** */
  // Has error
  assert.ok(error)
})

test.run()
