var dox = require('../')
var tag = dox.parseTag('@type {(module:path/to/file.js).foo}');

const { inspect } = require('util')
console.log(inspect(tag, {showHidden: false, depth: null}))