const { inspect } = require('util')
const doxxx = require('./lib/dox')

function deepLog(x) {
  console.log(inspect(x, {showHidden: false, depth: null}))
}

const code = `
/**
 *
 * @param {number|string|{name:string,age:number}} a
 * @param {number|{name:string,age:number}|Array} a
 * @returns {{name:string,age:number}}
 */
function complexTypeParamAndReturn(a, b) {
  return {
    name: 'Test',
    age: 30
  }
}
`

const codeTwo = `
/**
* Renders a <Button /> component
* @param  {object}  [props] - Button props
* @param  {string}  [props.text] - My button
* @param  {boolean} [props.isActive] - is button active
* @param  {string}  [props.className] - CSS class name
* @param  {React.ReactNode} [props.children] - component children;
* @param  {React.CSSProperties} [props.style] - used to set the CSS of the button
* @return {React.ReactElement} - React component
* @example
  <Button className='cool'>
    Words
  </Button>
*/
export default function Button(props = {}) {
  return (
    <button style={props.style}>
      {props.text}
      {props.children || 'my button'}
    </button>
  )
}
`

const codeThree = `
import React from 'react'

/**
 * Renders a <ButtonImport /> component with imported types
 * @param { import("./_types.ts").TinyProps } [props] - optional props
 * @param { import("./_types.ts").Lol } other - lol nice
 * @param { import("./_types.ts").Chill } isChill - the coolest
 * @return {React.ReactElement} - React component
 */
export default function ButtonImport(props) {
  return (
    <button>
      {props.message || 'my button'}
    </button>
  )
}
`

const codeFour = `
import React from 'react'
/**
 * This is a type def for tiny prop thingy
 * @typedef {object} TinyProps
 * @property {string} message   Xyz 123
 * @property {number} count   Product count
 * @property {boolean} disabled   Is disabled
 */

/**
 * Renders a <ButtonImport /> component with imported types
 * @param {TinyProps} props
 * @return {React.ReactElement} - React component
 */
export default function ButtonImport(props) {
  return (
    <button>
      {props.message || 'my button'}
    </button>
  )
}
`

deepLog(doxxx.parseComments(codeThree))
