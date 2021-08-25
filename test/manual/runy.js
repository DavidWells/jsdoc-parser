var dox = require('../')
var code = `
/**
 *  makes banana
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
 * @returns {string}
 * @example
   banana(
    'cool',
    'red'
  )
 */
function banana() {
  return 'yummers'
}

var obj = dox.parseComments(code);
const { inspect } = require('util')
console.log(inspect(obj, {showHidden: false, depth: null}))