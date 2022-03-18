const dox = require('../../lib/dox')
var code = `
/**
 * tester
 * @template T
 * @extends {Set<T>}
 * @example
 * lol()
 * console.log('hi')
 */
class SortableSet extends Set {
  // ...
}


/**
 * Does xyz
 * @returns {Promise<{
 *   pass: number,
 *   fail: number
 * }>}
 */
async function run() {
  return Promise.resolve({
    pass: 1,
    fail: 3
  })
}


/**
* Renders a <Button /> component
* @custom whatever
* @param { import("./types").Pet } p - Pet type
* @param  {object} [props] - button props
* @param  {string} [props.text] - My button
* @param  {string} [props.textColor] - the color of the text in the button
* @param  {string} [props.bgColor] - the background color of the button
* @param  {object} [props.overrideStyles] - used to set the CSS of the button
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
`;


var obj = dox.parseComments(code);
const { inspect } = require('util')
console.log(inspect(obj, {showHidden: false, depth: null}))