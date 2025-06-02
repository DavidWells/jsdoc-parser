const { inspect } = require('util')
const fs = require('fs')
const path = require('path')
const doxxx = require('../../lib/dox')

function deepLog(x) {
  console.log(inspect(x, {showHidden: false, depth: null}))
}

const code = fs.readFileSync(path.join(__dirname, '../fixtures/box.d.ts'), 'utf8')
console.log(code)

deepLog(doxxx.parseComments(code))
