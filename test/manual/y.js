const doxxx = require('../../lib/dox')

var tag = doxxx.parseTag('@param {String|Buffer|Boolean|Number} [fun] - blah');
 
// tag.type.should.equal('param');
// tag.types.should.eql(['String', 'Buffer']);
// tag.name.should.equal('');
// tag.description.should.equal('');
// tag.string.should.equal('{String|Buffer}');
// tag.optional.should.be.false;

const { inspect } = require('util')
console.log('result')
console.log(inspect(tag, {showHidden: false, depth: null}))