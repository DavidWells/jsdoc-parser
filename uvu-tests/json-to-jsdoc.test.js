import { test } from 'uvu'
import * as assert from 'uvu/assert'
import convert from '../lib/utils/json-to-jsdoc'


test.after(() => console.log('tests done'))

test('API is exposed', async () => {
  assert.is(typeof convert, 'function')
})

test('JSON to JSDOC', async () => {
  const obj = {
    "userId": 1,
    "id": 1,
    "title": "delectus aut autem",
    "completed": false,
    "items": [ 'one', 'two' ],
    "tuple": [ false, true ],
    "funky": {
      "nice": "rad",
      "whatever": true
    }
  }

  const jsdocOne = `
  /** 
  * @typedef {Object} MyType
  * @property {Number} userId
  * @property {Number} id
  * @property {String} title
  * @property {Boolean} completed
  * @property {String[]} items
  * @property {Boolean[]} tuple
  * @property {Object} funky
  * @property {String} funky.nice
  * @property {Boolean} funky.whatever
  */`
  const one = convert(obj)
  console.log('one', one)
  equal(one, jsdocOne, 'makes jsdocOne')

  // const objTwo = {
  //   "userId": false,
  //   "id": 1
  // }
  // const jsdocTwo = `
  // /** @typedef {Object} json
  // * @property {Boolean} userId
  // * @property {Number} id
  // */`
  // equal(convert(objTwo), jsdocTwo, 'makes jsdocTwo')
})

test('simple object', async () => {
  const obj = {
    "userId": 1,
  }

  const jsdocOne = `
/**
 * @typedef {Object} MyType
 * @property {Number} userId
 */`
  const one = convert(obj)
  console.log('one', one)
  equal(one, jsdocOne, 'makes jsdocOne')
})

// This is incorrect
test.skip('simple array', async () => {
  const obj = [{
    "userId": 1,
  }]

  const jsdocOne = `
/**
 * @typedef {Array} MyType
 * @property {Object} 0
 * @property {Number} 0.userId
 */`
  const one = convert(obj)
  console.log('one', one)
  equal(one, jsdocOne, 'makes jsdocOne')
  // SHOULD BE THIS
  // /**
  //  * @typedef MyType
  //  * @type {Object}
  //  * @property {string} userId
  //  */
  // /**
  //  * @typedef MyTypeArray
  //  * @type {Array.<MyType>}
  //  */
  // /** @type {MyTypeArray} */
})

test('JSON to JSDOC DEEP', async () => {
  const obj = {
    "userId": 1,
    "id": 1,
    "funky": {
      "nice": "rad",
      "whatever": true
    },
    "deep": {
      "thing": {
        "here": {
          "cool": true,
          "arrayOfAny": [],
        }
      },
      other: ['str', 'strTwo'],
      fun: 122
    }
  }

  const jsdocOne = `
/**
 * @typedef {Object} MyType
 * @property {Number} userId
 * @property {Number} id
 * @property {Object} funky
 * @property {String} funky.nice
 * @property {Boolean} funky.whatever
 * @property {Object} deep
 * @property {Object} deep.thing
 * @property {Object} deep.thing.here
 * @property {Boolean} deep.thing.here.cool
 * @property {Array} deep.thing.here.arrayOfAny
 * @property·{String[]}·deep.other
 * @property·{Number}·deep.fun
 */`
  const one = convert(obj)
  console.log('one', one)
  equal(one, jsdocOne, 'makes jsdocOne')
})

/**
 * @typedef {Object} json
 * @property {Number} userId
 * @property {Number} id
 * @property {String} title
 * @property {Boolean} completed
 * @property {String[]} items
 * @property {Boolean[]} tuple
 * @property {object} funky
 * @property {String} funky.nice
 * @property {Boolean} funky.whatever
*/

/**
 * @typedef {Object} ButtonPropTypes
 * @property {string} text
 * @property {string} icon
 */

/** 
* @typedef {Object} MyObj
* @property {Number} userId
* @property {Number} id
* @property {String} title
* @property {Boolean} completed
* @property {String[]} items
* @property·{Array<Array<Boolean>, Boolean>}·tuple
*/


/**
 * @typedef AwesomeObject
 * @type {Object}
 * @property {string} name
 * @property {boolean} next
 * @property {string} test
 */

/**
 * @param {Array.<AwesomeObject>} awesomeObjects Awesome objects.
 */

/**
 * Test
 * @param {MyObj} obj 
 */
function testing(obj) {

}

testing()

function equal(one, two, details = '') {
  assert.equal(trimTrailingSpace(one), trimTrailingSpace(two), details)
}

function trimTrailingSpace(str) {
  return str.trim().split('\n').map((s) => {
    return s
      .replace(/^\s*/, '')
      .replace(/\s*$/, '')
      .replace(/·/g, ' ')
  }).join('\n')
}

function dedent(strings, ...values) {
  const raw = typeof strings === "string" ? [strings] : strings.raw;
  let result = "";
  for (let i = 0; i < raw.length; i++) {
    result += raw[i]
      // join lines when there is a suppressed newline
      .replace(/\\\n[ \t]*/g, "")
      // handle escaped backticks
      .replace(/\\`/g, "`");
    if (i < values.length) {
      result += values[i];
    }
  }
  const lines = result.split("\n");
  let mindent = null;
  lines.forEach(l => {
    let m = l.match(/^(\s+)\S+/);
    if (m) {
      let indent = m[1].length;
      if (!mindent) {
        // this is the first indented line
        mindent = indent;
      } else {
        mindent = Math.min(mindent, indent);
      }
    }
  });
  if (mindent !== null) {
    const m = mindent; // appease Flow
    result = lines.map(l => l[0] === " " ? l.slice(m) : l).join("\n");
  }
  return result
    .trim()
    .replace(/\\n/g, "\n");
}

test.run()