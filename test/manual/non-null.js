const { inspect } = require('util')
const doxxx = require('../../lib/dox')

function deepLog(x) {
  console.log(inspect(x, {showHidden: false, depth: null}))
}

const codeTwo = `
/** 
 * JSDoc types lack a non-null assertion.
 * https://github.com/Microsoft/TypeScript/issues/23405#issuecomment-873331031
 * 
 * @template T
 * @param {T} value
 */
function notNull(value) {
  // Use '==' to check for both null and undefined
  if (value == null) throw new Error('did not expect value to be null or undefined')
  return value
}
`

deepLog(doxxx.parseComments(codeTwo))
