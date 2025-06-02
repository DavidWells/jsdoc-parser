const fs = require('fs').promises
const path = require('path')
const { test } = require('uvu') 
const assert = require('uvu/assert')
const { getDocs } = require('./parser')

const util = require('util')

function deepLog(myObject) {
  console.log(util.inspect(myObject, {showHidden: false, depth: null, colors: true}))
}

let testFile
// testFile = './parser-test.js'
testFile = path.resolve(__dirname, 'tests/fixtures/parser/0_Button_PropTypes_Class/index.jsx')
testFile = path.resolve(__dirname, 'tests/fixtures/parser/0_Button_PropTypes_Function/index.jsx')
testFile = path.resolve(__dirname, 'tests/fixtures/parser/1_Button_JSDoc_Simple/index.jsx')
// testFile = path.resolve(__dirname, 'tests/fixtures/parser/2_Button_JSDoc_TypeDef_Function/index.jsx')
// testFile = path.resolve(__dirname, 'tests/fixtures/parser/2.1_Button_JSDoc_Function_Extend/index.jsx')
// testFile = path.resolve(__dirname, 'tests/fixtures/parser/3_Button_JSDoc_TypeDef_Class/index.jsx')
// testFile = path.resolve(__dirname, 'tests/fixtures/parser/4_Button_JSDoc_ImportedTypes/index.jsx')
// testFile = path.resolve(__dirname, 'tests/fixtures/parser/5_Button_JSDoc_ImportedTypes_React/index.jsx')

test('Exports api', async () => {
  assert.is(typeof getDocs, 'function', 'Exports getDocs')
})

test.only('Run getDocs', async () => {
  const allDocs = getDocs(testFile)
  console.log('allDocs.length', allDocs.length)
  allDocs.forEach((doc) => {
    console.log('doc', doc)
    const props = doc.parameters || doc.properties || []
    props.forEach((prop) => {
      console.log(`param "${prop.name}" properties`, prop)
    })
  })
})

test.run()