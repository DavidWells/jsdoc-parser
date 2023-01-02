const { inspect } = require('util')
const doxxx = require('../../lib/dox')

function deepLog(x) {
  console.log(inspect(x, {showHidden: false, depth: null}))
}

const codeTwo = `
/**
 * An optional parameter (using JSDoc syntax)
 * @param {string} [somebody] - Somebody's name.
 */
function sayHello(somebody) {
  if (!somebody) {
    somebody = 'John Doe';
  }
  alert('Hello ' + somebody);
}

/**
 * An optional parameter (using Google Closure Compiler syntax)
 * @param {string=} somebody - Somebody's name.
 */
function sayBye(somebody) {
  if (!somebody) {
    somebody = 'John Doe';
  }
  alert('Hello ' + somebody);
}

/**
 * An optional parameter and default value
 * @param {string} [somebody=John Doe] - Somebody's name.
 */
function sayYo(somebody) {
  if (!somebody) {
    somebody = 'John Doe';
  }
  alert('Hello ' + somebody);
}
`

const codeTwox = `
/**
 * An optional parameter (using Google Closure Compiler syntax)
 * @param {string=} somebody - Somebody's name.
 */
function sayBye(somebody) {
  if (!somebody) {
    somebody = 'John Doe';
  }
  alert('Hello ' + somebody);
}
`

const codeNoQuotes = `
/**
 * An optional parameter and default value
 * @param {string} [somebody=John Doe] - Somebody's name.
 */
function sayYo(somebody) {
  if (!somebody) {
    somebody = 'John Doe';
  }
  alert('Hello ' + somebody);
}
`

const codeSingleQuotes = `
/**
 * An optional parameter and default value
 * @param {string} [somebody='John Doe'] - Somebody's name.
 */
function sayYo(somebody) {
  if (!somebody) {
    somebody = 'John Doe';
  }
  alert('Hello ' + somebody);
}
`

const codeDoubleQuotes = `
/**
 * An optional parameter and default value
 * @param {string} [somebody="John Doe hehehe"] - Somebody's name.
 */
function sayYo(somebody) {
  if (!somebody) {
    somebody = 'John Doe';
  }
  alert('Hello ' + somebody);
}
`

const multiLine = `
/**
 * first
 *
 * @param {String} foo
 * one
 * two
 * three
 * @bar last
 */
function firstParam() {
}
`

deepLog(doxxx.parseComments(codeSingleQuotes))
