var dox = require('../')

const code = `
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
 * @param {Error} e
 * @returns {string}
 */
function findAtLineFromError (e) {
  return 'lol'
}

/**
 * @param {Error | null} err
 * @param {string} [msg]
 * @returns {void}
 */
function ifError(err, msg) {
  xyz(!err, err, 'no error', msg || String(err), 'ifError')
}
`

var obj = dox.parseComments(code);
const { inspect } = require('util')
console.log('result')
console.log(inspect(obj, {showHidden: false, depth: null}))
