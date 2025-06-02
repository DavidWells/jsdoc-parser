const util = require('util')
const { test } = require('uvu') 
const assert = require('uvu/assert')
const { getRequires, getImports, getTypeImports } = require('./get-imports')

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
      name: '{ test }',
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
      isRelative: false
    },
    {
      line: "const assert = require('uvu/assert')",
      name: 'assert',
      definitions: [ { declaration: 'assert', name: 'assert' } ],
      from: 'uvu/assert',
      index: 37,
      isRequire: true,
      isRelative: false
    },
    {
      line: "const { getRequires } = require('./get-imports')",
      name: '{ getRequires }',
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
      isRelative: true
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
      name: '{ test : funky, foo = false }',
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
      isRelative: false
    },
    {
      line: "const assert = require('uvu/assert')",
      name: 'assert',
      definitions: [ { declaration: 'assert', name: 'assert' } ],
      from: 'uvu/assert',
      index: 58,
      isRequire: true,
      isRelative: false
    },
    {
      line: "const { getRequires } = require('./get-imports')",
      name: '{ getRequires }',
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
      isRelative: true
    }
  ])
})


test('getImports', async () => {
    const code = `
  import {fileURLToPath, URL, whatever as funky} from 'url'
  import foo from 'fs'
  import * as Fs from 'fs'
  import assert from 'uvu/assert'
  const { test } = require('uvu')
  const { getRequires } = require('./get-imports')
    `

    const importsFound = getImports(code)
    /*
    console.log('importsFound')
    deepLog(importsFound)
    /** */
    assert.equal(importsFound, [
    {
      line: "import {fileURLToPath, URL, whatever as funky} from 'url'",
      name: '{fileURLToPath, URL, whatever as funky}',
      definitions: [
        {
          expectsDestructuring: true,
          declaration: '{fileURLToPath, URL, whatever as funky}',
          destructuredParameters: [
            { declaration: 'fileURLToPath', name: 'fileURLToPath' },
            { declaration: 'URL', name: 'URL' },
            {
              declaration: 'whatever as funky',
              name: 'whatever',
              alias: 'funky'
            }
          ],
          name: '{fileURLToPath, URL, whatever as funky}'
        }
      ],
      from: 'url',
      index: 3,
      isImport: true,
      isRelative: false
    },
    {
      line: "import foo from 'fs'",
      name: 'foo',
      definitions: [ { declaration: 'foo', name: 'foo' } ],
      from: 'fs',
      index: 63,
      isImport: true,
      isRelative: false
    },
    {
      line: "import * as Fs from 'fs'",
      name: '* as Fs',
      definitions: [ { declaration: '* as Fs', name: '*', alias: 'Fs' } ],
      from: 'fs',
      index: 86,
      isImport: true,
      isRelative: false
    },
    {
      line: "import assert from 'uvu/assert'",
      name: 'assert',
      definitions: [ { declaration: 'assert', name: 'assert' } ],
      from: 'uvu/assert',
      index: 113,
      isImport: true,
      isRelative: false
    }
  ])
})


test('get jsDoc Imports', async () => {
    const code = `
    /**
     * @param {string}   [fin="cool"]
     * @param {import("./foo").hdhdhdhdhddh} [api] - lol
     * @param {import("lodash").omit} Cool - lodash omit
     * @param {import("uvu/assert")} Rad - other thing
     */ 
    `

    const importsFound = getTypeImports(code)
    /*
    console.log('importsFound')
    deepLog(importsFound)
    /** */
    assert.equal(importsFound, [
      {
        importStatement: 'import("./foo").hdhdhdhdhddh',
        importPath: './foo',
        importName: 'hdhdhdhdhddh',
        index: 62,
        isImport: true,
        isRelative: true
      },
      {
        importStatement: 'import("lodash").omit',
        importPath: 'lodash',
        importName: 'omit',
        index: 119,
        isImport: true,
        isRelative: false
      },
      {
        importStatement: 'import("uvu/assert")',
        importPath: 'uvu/assert',
        importName: '',
        index: 176,
        isImport: true,
        isRelative: false
      }
    ])
})

test.run()