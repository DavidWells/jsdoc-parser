const util = require('util')
const { test } = require('uvu') 
const assert = require('uvu/assert')
const { getStaticImports, getTypeImports, getDynamicImports } = require('./get-imports')

function deepLog(myObject) {
  console.log(util.inspect(myObject, {showHidden: false, depth: null, colors: true}))
}

test('Exports api', async () => {
  assert.is(typeof getStaticImports, 'function', 'Exports api')
  assert.is(typeof getTypeImports, 'function', 'Exports api')
})

test('getStaticImports', async () => {
    const code = `
  import {fileURLToPath, URL, whatever as funky} from 'url'
  import foo from 'fs'
  import * as Fs from 'fs'
  import assert from 'uvu/assert'
  const { test } = require('uvu')
  const { getRequires } = require('./get-imports')
    `

    const importsFound = getStaticImports(code)
    //*
    console.log('importsFound')
    deepLog(importsFound)
    /** */
    assert.equal(importsFound, [
    {
      line: "import {fileURLToPath, URL, whatever as funky} from 'url'",
      varType: 'const',
      varName: '{fileURLToPath, URL, whatever as funky}',
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
      varType: 'const',
      varName: 'foo',
      definitions: [ { declaration: 'foo', name: 'foo' } ],
      from: 'fs',
      index: 63,
      isImport: true,
      isRelative: false
    },
    {
      line: "import * as Fs from 'fs'",
      varType: 'const',
      varName: '* as Fs',
      definitions: [ { declaration: '* as Fs', name: '*', alias: 'Fs' } ],
      from: 'fs',
      index: 86,
      isImport: true,
      isRelative: false
    },
    {
      line: "import assert from 'uvu/assert'",
      varType: 'const',
      varName: 'assert',
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

test('getDynamicImports', async () => {
  const code = `
  const module = await import('./module.js')
  const moduleName = './utils.js'
  const utils = await import(moduleName)
  const folder = 'components'
  const component = await import(\`./src/\${folder}/Button.js\`)
  const modulePath = path.join('./src', 'helpers', 'api.js')
  const api = await import(modulePath)
  const { default: Component, helper } = await import('./Component.js')
  const dynamicModule = await import(getModulePath())
  `

  const importsFound = getDynamicImports(code)
  //*
  console.log('importsFound')
  deepLog(importsFound)
  /** */
  assert.equal(importsFound, [
  {
    line: "const module = await import('./module.js')",
    varType: 'const',
    varName: 'module',
    definitions: [ { declaration: 'module', name: 'module' } ],
    from: "'./module.js'",
    index: 3,
    isImport: true,
    isRelative: true,
    isDynamic: true
  },
  {
    line: 'const utils = await import(moduleName)',
    varType: 'const',
    varName: 'utils',
    definitions: [ { declaration: 'utils', name: 'utils' } ],
    from: 'moduleName',
    index: 82,
    isImport: true,
    isRelative: false,
    isDynamic: true
  },
  {
    line: 'const component = await import(`./src/${folder}/Button.js`)',
    varType: 'const',
    varName: 'component',
    definitions: [ { declaration: 'component', name: 'component' } ],
    from: '`./src/${folder}/Button.js`',
    index: 153,
    isImport: true,
    isRelative: false,
    isDynamic: true
  },
  {
    line: 'const api = await import(modulePath)',
    varType: 'const',
    varName: 'api',
    definitions: [ { declaration: 'api', name: 'api' } ],
    from: 'modulePath',
    index: 276,
    isImport: true,
    isRelative: false,
    isDynamic: true
  },
  {
    line: "const { default: Component, helper } = await import('./Component.js')",
    varType: 'const',
    varName: '{ default: Component, helper }',
    definitions: [
      {
        expectsDestructuring: true,
        declaration: '{ default: Component, helper }',
        destructuredParameters: [
          {
            declaration: 'default: Component',
            name: 'default',
            alias: 'Component'
          },
          { declaration: 'helper', name: 'helper' }
        ],
        name: '{ default: Component, helper }'
      }
    ],
    from: "'./Component.js'",
    index: 315,
    isImport: true,
    isRelative: true,
    isDynamic: true
  },
  {
    line: 'const dynamicModule = await import(getModulePath())',
    varType: 'const',
    varName: 'dynamicModule',
    definitions: [ { declaration: 'dynamicModule', name: 'dynamicModule' } ],
    from: 'getModulePath()',
    index: 387,
    isImport: true,
    isRelative: false,
    isDynamic: true
  }
])
})

test.run()