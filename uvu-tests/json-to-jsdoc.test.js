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
    "items": [ 'one', 'two' ]
  }

  const jsdocOne = `
  /** @typedef {Object} json
  * @property {Number} userId
  * @property {Number} id
  * @property {String} title
  * @property {Boolean} completed
  * @property {Array} items
  */`
  equal(convert(obj), jsdocOne, 'makes jsdocOne')

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

function equal(one, two, details = '') {
  assert.equal(trimTrailingSpace(one), trimTrailingSpace(two), details)
}

function trimTrailingSpace(str) {
  return str.trim().split('\n').map((s) => {
    return s
      .replace(/^\s*/, '')
      .replace(/\s*$/, '')
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