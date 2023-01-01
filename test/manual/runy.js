const dox = require('../../lib/dox')
var code = `
/**
 * makes banana
 * @returns {string}
 * @example
  banana(
    'cool',
    'red'
  )
 */
`;

/**
 * makes banana
 * @param {string} one - fruit one
 * @param {string} two - fruit one
 * @returns {string}
 * @example
   banana(
    'cool',
    'red'
  )
 */
function banana(one, two) {
  return one + two + 'yummers'
}

var obj = dox.parseComments(code);
const { inspect } = require('util')
console.log(inspect(obj, {showHidden: false, depth: null}))