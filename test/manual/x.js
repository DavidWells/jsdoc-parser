const doxxx = require('../../lib/dox')
// TODO fix moudle resolution this doesnt work
var tag = doxxx.parseTag('@type {(module:path/to/file.js).foo}');

const { inspect } = require('util')
console.log(inspect(tag, {showHidden: false, depth: null}))