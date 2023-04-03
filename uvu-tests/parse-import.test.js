import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { getRequires, getTypeImports, getImports } from '../lib/utils/get-imports'


test.after(() => console.log('tests done'))

test('API is exposed', async () => {
  assert.is(typeof getRequires, 'function')
  assert.is(typeof getTypeImports, 'function')
  assert.is(typeof getImports, 'function')
})


const importsExample = `
import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { getRequires, getTypeImports, getImports } from '../lib/utils/get-imports'
  `

test('getRequires', async () => {
  const one = `
const path = require('path')
const ts = require('typescript')
  `
  const value = getRequires(one)
  // console.log('value', value)
  assert.equal(value, [
    {
      line: "const path = require('path')",
      names: 'path',
      from: 'path',
      index: 1,
      isRequire: true,
      isRelative: false
    },
    {
      line: "const ts = require('typescript')",
      names: 'ts',
      from: 'typescript',
      index: 30,
      isRequire: true,
      isRelative: false
    }
  ], 'getRequires')

  const two = `
const { join, resolve } = require('path')
const ts = require('typescript')
  `
  const valueTwo = getRequires(two)
  // console.log('valueTwo', valueTwo)
  assert.equal(valueTwo, [
    {
      line: "const { join, resolve } = require('path')",
      names: '{ join, resolve }',
      from: 'path',
      index: 1,
      isRequire: true,
      isRelative: false
    },
    {
      line: "const ts = require('typescript')",
      names: 'ts',
      from: 'typescript',
      index: 43,
      isRequire: true,
      isRelative: false
    }
  ], 'valueTwo')

  const valueThree = getRequires(importsExample)
  // console.log('valueThree', valueThree)
  assert.equal(valueThree, [], 'valueThree')
})


test('getImports', async () => {
  const foundValues = getImports(importsExample)
  // console.log('foundValues', foundValues)
  assert.equal(foundValues, [
    {
      line: "import { test } from 'uvu'",
      names: '{ test }',
      from: 'uvu',
      index: 1,
      isImport: true,
      isRelative: false
    },
    {
      line: "import * as assert from 'uvu/assert'",
      names: '* as assert',
      from: 'uvu/assert',
      index: 28,
      isImport: true,
      isRelative: false
    },
    {
      line: "import { getRequires, getTypeImports, getImports } from '../lib/utils/get-imports'",
      names: '{ getRequires, getTypeImports, getImports }',
      from: '../lib/utils/get-imports',
      index: 65,
      isImport: true,
      isRelative: true
    }
  ], 'getImports')
})

test.run()