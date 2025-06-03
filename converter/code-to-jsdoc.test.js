const fs = require('fs').promises
const path = require('path')
const { test } = require('uvu') 
const assert = require('uvu/assert')
const { convertToJSDoc } = require('./json-to-jsdoc')
const { parseCode } = require('./code-to-jsdoc')

const util = require('util')

function deepLog(myObject) {
  console.log(util.inspect(myObject, {showHidden: false, depth: null, colors: true}))
}

test('Exports api', async () => {
  assert.is(typeof convertToJSDoc, 'function', 'Exports convertToJSDoc')
})

test.only('Run it', async () => {
  const code = await fs.readFile(path.resolve(__dirname, 'tests/fixtures/function.js'), 'utf8')
  const values = parseCode(code)

  assert.equal(values.length, 1)
  deepLog(values)
  console.log(Object.keys(values[0]))
  await fs.writeFile(
    path.resolve(__dirname, 'tests/output/function.js.json'),
    JSON.stringify(values, null, 2)
  )
  process.exit(1)
  values.forEach(({ jsDocs }) => {
    console.log(jsDocs.render)
    assert.equal(jsDocs.render, `/**
* This thing does xyz
* @param {string}   [fin="cool"]
* @param {object}   [api]
* @param {boolean}  [api.abc=false]
* @param {string[]} [api.arrayThing=["nice","cool"]]
* @param {string}   [api.awesome="chill"]
* @param {*}        [api.boss]
* @param {object}   [api.rad]
* @param {object}   [api.rad.lol]
* @param {boolean}  [api.rad.lol.cool=true]
* @param {string}   [api.rad.whatever="bar"]
* @param {*}        [api.refThing]
* @param {object}   [param2]
* @param {*}        [param2.dope]
* @param {*}        [param2.funky]
* @param {object}   [fun]
* @param {*}        [fun.bunker]
* @param {string[]} [fun.foo=["lol"]]
* @param {string}   [fun.what=""]
* @return {object}
*/`)
  })
})


test('2 empty functions', async () => {
  //const code = await fs.readFile(path.resolve(__dirname, 'tests/fixtures/function.js'), 'utf8')
  const code = await fs.readFile(path.resolve(__dirname, 'tests/fixtures/two-functions.js'), 'utf8')
  const values = parseCode(code)

  assert.equal(values.length, 2)
  deepLog(values)
  process.exit(1)
  values.forEach(({ render }) => {
    console.log(render)
    assert.equal(render, `/**
* This thing does xyz
* @param {string}   [fin="cool"]
* @param {object}   [api]
* @param {boolean}  [api.abc=false]
* @param {string[]} [api.arrayThing=["nice","cool"]]
* @param {string}   [api.awesome="chill"]
* @param {*}        [api.boss]
* @param {object}   [api.rad]
* @param {object}   [api.rad.lol]
* @param {boolean}  [api.rad.lol.cool=true]
* @param {string}   [api.rad.whatever="bar"]
* @param {*}        [api.refThing]
* @param {object}   [param2]
* @param {*}        [param2.dope]
* @param {*}        [param2.funky]
* @param {object}   [fun]
* @param {*}        [fun.bunker]
* @param {string[]} [fun.foo=["lol"]]
* @param {string}   [fun.what=""]
* @return {object}
*/`)
  })
})

test('Run it const', async () => {
  //const filePath = path.resolve(__dirname, 'tests/fixtures/const.js')
  // const filePath = path.resolve(__dirname, 'tests/fixtures/parser/2_Button_JSDoc_TypeDef_Function/index.jsx')
  // const filePath = path.resolve(__dirname, 'tests/fixtures/parser/find-fns.js')
  const filePath = path.resolve(__dirname, 'tests/fixtures/parser/iife.js')
  // const filePath = path.resolve(__dirname, 'tests/fixtures/parser/inside-vals.js')


  const code = await fs.readFile(filePath, 'utf8')
  const values = parseCode(code, { filePath })

  console.log(values[1])
  console.log(values[2])

  assert.equal(values.length, 14)
  deepLog(values)
  values.forEach(({ render, name }, i) => {
    console.log(`name ${i + 1}`, name)
  })
})

test('optional-unknown', async () => {
  const filePath = path.resolve(__dirname, 'tests/fixtures/parser/optional-unknown.js')


  const code = await fs.readFile(filePath, 'utf8')
  const values = parseCode(code, { filePath })

  console.log(values[1])
  console.log(values[2])

  assert.equal(values.length, 1)
  deepLog(values)
  values.forEach(({ render, name }, i) => {
    console.log(`name ${i + 1}`, name)
  })
})

test.run()