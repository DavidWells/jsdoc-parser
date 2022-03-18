const dox = require('../../lib/dox')

var code = [
  '/**',
  ' * Some free text',
  ' *',
  ' * @public',
  ' * @extends',
  ' * SuperLongClassName',
  ' * @multiline-example',
  ' * E.g. for example code',
  ' *',
  ' *     var foo = bar;',
  ' *',
  ' * With description.',
  ' *',
  ' * @param {string} foo',
  ' * @param {number} bar',
  ' * @returns {boolean} Some desciption',
  ' */',
].join('\n');


var obj = dox.parseComments(code);
const { inspect } = require('util')
console.log(inspect(obj, {showHidden: false, depth: null}))