const util = require('util')
const { test } = require('uvu') 
const assert = require('uvu/assert')
const { getRequires, getDynamicRequires } = require('./get-requires')

function deepLog(myObject) {
  console.log(util.inspect(myObject, {showHidden: false, depth: null, colors: true}))
}

test('Exports api', async () => {
  assert.is(typeof getRequires, 'function', 'Exports getDocs')
})

test('getRequires', async () => {
  const code = `
  const { test } = require('uvu')
  const assert = require('uvu/assert')
  const { getRequires } = require('./get-imports')
  `

  const requiresFound = getRequires(code)
  /*
  console.log('requiresFound')
  deepLog(requiresFound)
  /** */
  assert.equal(requiresFound, [
    {
      line: "const { test } = require('uvu')",
      varType: 'const',
      varName: '{ test }',
      definitions: [
        {
          expectsDestructuring: true,
          declaration: '{ test }',
          destructuredParameters: [ { declaration: 'test', name: 'test' } ],
          name: '{ test }'
        }
      ],
      from: 'uvu',
      index: 3,
      isRequire: true,
      isRelative: false,
      isDynamic: false
    },
    {
      line: "const assert = require('uvu/assert')",
      varType: 'const',
      varName: 'assert',
      definitions: [ { declaration: 'assert', name: 'assert' } ],
      from: 'uvu/assert',
      index: 37,
      isRequire: true,
      isRelative: false,
      isDynamic: false
    },
    {
      line: "const { getRequires } = require('./get-imports')",
      varType: 'const',
      varName: '{ getRequires }',
      definitions: [
        {
          expectsDestructuring: true,
          declaration: '{ getRequires }',
          destructuredParameters: [ { declaration: 'getRequires', name: 'getRequires' } ],
          name: '{ getRequires }'
        }
      ],
      from: './get-imports',
      index: 76,
      isRequire: true,
      isRelative: true,
      isDynamic: false
    }
  ])
})

test('getRequires 2', async () => {
  const code = `
  const { test : funky, foo = false } = require('uvu')
  const assert = require('uvu/assert')
  const { getRequires } = require('./get-imports')
  `
  const requiresFound = getRequires(code)
  /*
  console.log('requiresFound')
  deepLog(requiresFound)
  /** */

  assert.equal(requiresFound, [
    {
      line: "const { test : funky, foo = false } = require('uvu')",
      varType: 'const',
      varName: '{ test : funky, foo = false }',
      definitions: [
        {
          expectsDestructuring: true,
          declaration: '{ test : funky, foo = false }',
          destructuredParameters: [
            { declaration: 'test : funky', name: 'test', alias: 'funky' },
            {
              defaultValue: 'false',
              declaration: 'foo = false',
              name: 'foo'
            }
          ],
          name: '{ test : funky, foo = false }'
        }
      ],
      from: 'uvu',
      index: 3,
      isRequire: true,
      isRelative: false,
      isDynamic: false
    },
    {
      line: "const assert = require('uvu/assert')",
      varType: 'const',
      varName: 'assert',
      definitions: [ { declaration: 'assert', name: 'assert' } ],
      from: 'uvu/assert',
      index: 58,
      isRequire: true,
      isRelative: false,
      isDynamic: false
    },
    {
      line: "const { getRequires } = require('./get-imports')",
      varType: 'const',
      varName: '{ getRequires }',
      definitions: [
        {
          expectsDestructuring: true,
          declaration: '{ getRequires }',
          destructuredParameters: [ { declaration: 'getRequires', name: 'getRequires' } ],
          name: '{ getRequires }'
        }
      ],
      from: './get-imports',
      index: 97,
      isRequire: true,
      isRelative: true,
      isDynamic: false
    }
  ])
})

test('getRequires with dynamic requires', async () => {
  const code = `
  const moduleName = 'fs'
  const dynamicRequire = require(moduleName)
  const path = require('path')
  const dynamicPath = require(path.join(__dirname, 'utils'))
  const foo = require('foo-pkg')
  require(\`./$\{folder}/file\`)
  const { test : funky, foo = false } = require(moduleTwo)
  `

  const requiresFound = getDynamicRequires(code)
  /*
  console.log('requiresFound')
  deepLog(requiresFound)
  /** */
  assert.equal(requiresFound, [
    {
      line: 'const dynamicRequire = require(moduleName)',
      varType: 'const',
      varName: 'dynamicRequire',
      definitions: [ { declaration: 'dynamicRequire', name: 'dynamicRequire' } ],
      from: 'moduleName',
      index: 29,
      isRequire: true,
      isRelative: false,
      isDynamic: true
    },
    {
      line: "const dynamicPath = require(path.join(__dirname, 'utils'))",
      varType: 'const',
      varName: 'dynamicPath',
      definitions: [ { declaration: 'dynamicPath', name: 'dynamicPath' } ],
      from: "path.join(__dirname, 'utils')",
      index: 105,
      isRequire: true,
      isRelative: false,
      isDynamic: true
    },
    {
      line: 'require(`./${folder}/file`)',
      varType: '',
      varName: '',
      definitions: [],
      from: '`./${folder}/file`',
      index: 199,
      isRequire: true,
      isRelative: false,
      isDynamic: true
    },
    {
      line: 'const { test : funky, foo = false } = require(moduleTwo)',
      varType: 'const',
      varName: '{ test : funky, foo = false }',
      definitions: [
        {
          expectsDestructuring: true,
          declaration: '{ test : funky, foo = false }',
          destructuredParameters: [
            { declaration: 'test : funky', name: 'test', alias: 'funky' },
            {
              defaultValue: 'false',
              declaration: 'foo = false',
              name: 'foo'
            }
          ],
          name: '{ test : funky, foo = false }'
        }
      ],
      from: 'moduleTwo',
      index: 229,
      isRequire: true,
      isRelative: false,
      isDynamic: true
    }
  ])
})

test.run()