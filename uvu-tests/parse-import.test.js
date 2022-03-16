import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { getRequires, getTypeImports, getImports } from '../lib/utils/get-imports'


test.after(() => console.log('tests done'))

test('API is exposed', async () => {
  assert.is(typeof getRequires, 'function')
  assert.is(typeof getTypeImports, 'function')
  assert.is(typeof getImports, 'function')
})

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

  const three = `
import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { getRequires, getTypeImports, getImports } from '../lib/utils/get-imports'
  `
  const valueThree = getRequires(three)
  // console.log('valueThree', valueThree)
  assert.equal(valueThree, [], 'valueThree')
})

test.run()