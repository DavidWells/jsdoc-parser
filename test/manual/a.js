const dox = require('../../lib/dox')

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

/**
 *
 * @param {number | string | {length: number, type: {name: {first: string, last: string}, id: number | string}}} a Description of param
 */
function nestedComplexTypeParam(a) {

}

/**
 *
 * @param {number=} a
 */
function optionalParam(a) {

}

/**
 *
 * @param {?number} a
 */
function nullableParam(a) {

}

/**
 *
 * @param {!number} a
 */
function nonNullableParam(a) {

}

/**
 *
 * @param {...number} a
 */
function variableParam(a) {

}
`

var obj = dox.parseComments(code);
const { inspect } = require('util')
console.log('result')
// console.log(inspect(obj[3], {showHidden: false, depth: null}))
console.log(inspect(obj, {showHidden: false, depth: null}))
