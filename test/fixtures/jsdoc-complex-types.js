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


// @param {?...number=} a ............. causes error...
// /path/repos/dox/node_modules/jsdoctypeparser/peg_lib/jsdoctype-permissive.js:7504
//     throw peg$buildStructuredError(
//     ^
// peg$SyntaxError: Expected [ \t], [\n], [\r], or end of input but "n" found.
//     at peg$buildStructuredError (/path/repos/dox/node_modules/jsdoctypeparser/peg_lib/jsdoctype-permissive.js:874:12)
//     at peg$parse (/path/repos/dox/node_modules/jsdoctypeparser/peg_lib/jsdoctype-permissive.js:7504:11)
//     at parse (/path/repos/dox/node_modules/jsdoctypeparser/lib/parsing.js:96:16)
//     at Object.exports.parseTagTypes (/path/repos/dox/lib/dox.js:412:16)
//     at exports.parseTag (/path/repos/dox/lib/dox.js:316:15)
//     at Array.map (<anonymous>)
//     at Object.exports.parseComment (/path/repos/dox/lib/dox.js:210:34)
//     at Object.exports.parseComments (/path/repos/dox/lib/dox.js:94:25)
//     at Object.<anonymous> (/path/repos/dox/a.js:66:15)
//     at Module._compile (internal/modules/cjs/loader.js:777:30) {
//   message: 'Expected [ \\t], [\\n], [\\r], or end of input but "n" found.',

// /*
//  *
//  * @param {?...number=} a
//  */
// function optionalVariableNullableParam(a) {

// }