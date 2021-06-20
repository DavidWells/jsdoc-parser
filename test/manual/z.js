var dox = require('../')

var tag = dox.parseTag('@type {...Variadic}');

const { inspect } = require('util')
console.log('result')
console.log(inspect(tag, {showHidden: false, depth: null}))