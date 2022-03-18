const doxxx = require('../../lib/dox')

var tag = doxxx.parseTag('@type {...Variadic}');

const { inspect } = require('util')
console.log('result')
console.log(inspect(tag, {showHidden: false, depth: null}))