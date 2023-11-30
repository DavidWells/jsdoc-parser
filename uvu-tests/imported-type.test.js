import { test } from 'uvu'
import * as assert from 'uvu/assert'
import doxxx from '../lib/dox'
import deepLog from '../test/utils/log'

const tsImport = `
import React from 'react'

/**
 * Renders a <ButtonImport /> component with imported types
 * @param { import("./_imported-type").Chill } isChill
 * @return {React.ReactElement} - React component
 */
export default function ButtonImport(props) {
  return (
    <button>
      {props.message || 'my button'}
    </button>
  )
}
`

test('Resolve basic imported types', async () => {
  const result = doxxx.parseComments(tsImport)
  /*
  deepLog(result)
  // process.exit(1)
  /** */
  
  // console.log('foundValues', foundValues)
  assert.ok(result[0].tags.length)
  assert.ok(result[0].tags[0].importedType)

assert.equal(result, [
  {
    description: {
      summary: 'Renders a <ButtonImport /> component with imported types',
      body: '',
      text: 'Renders a <ButtonImport /> component with imported types',
      html: '<p>Renders a <ButtonImport /> component with imported types</p>',
      summaryHtml: '<p>Renders a <ButtonImport /> component with imported types</p>',
      bodyHtml: ''
    },
    tags: [
      {
        tagType: 'param',
        tagValue: '{ import("./_imported-type").Chill } isChill',
        tagFull: '@param { import("./_imported-type").Chill } isChill',
        name: 'isChill',
        nameRaw: 'isChill',
        description: '',
        type: 'import("./_imported-type").Chill',
        types: [ 'import("./_imported-type").Chill' ],
        isOptional: false,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        importedType: {
          name: 'Chill',
          type: 'number[]',
          filePath: '/Users/david/Workspace/repos/jsdoc-parser/_imported-type.ts',
          location: '/Users/david/Workspace/repos/jsdoc-parser/_imported-type.ts:1:0',
          start: 0,
          end: 46,
          code: '/**\n * Chill\n */\nexport type Chill = number[];',
          tags: [
            {
              tagType: 'typedef',
              tagValue: '{number[]} Chill',
              tagFull: '@typedef {number[]} Chill',
              name: 'Chill',
              nameRaw: 'Chill',
              description: 'Chill',
              type: 'number[]',
              types: [ 'Array<number>' ],
              isOptional: false,
              isArray: true,
              isNullable: false,
              isNonNullable: false,
              isVariadic: false,
              jsDocAst: {
                type: 'GENERIC',
                subject: { type: 'NAME', name: 'Array' },
                objects: [ { type: 'NAME', name: 'number' } ],
                meta: { syntax: 'SQUARE_BRACKET' }
              }
            }
          ]
        },
        jsDocAst: {
          type: 'MEMBER',
          owner: {
            type: 'IMPORT',
            path: {
              type: 'STRING_VALUE',
              quoteStyle: 'double',
              string: './_imported-type'
            }
          },
          name: 'Chill',
          quoteStyle: 'none',
          hasEventPrefix: false
        },
        html: '<p>{ import(&quot;./_imported-type&quot;).Chill } isChill</p>'
      },
      {
        tagType: 'return',
        tagValue: '{React.ReactElement} - React component',
        tagFull: '@return {React.ReactElement} - React component',
        description: 'React component',
        type: 'React.ReactElement',
        types: [ 'React.ReactElement' ],
        isOptional: false,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: {
          type: 'MEMBER',
          owner: { type: 'NAME', name: 'React' },
          name: 'ReactElement',
          quoteStyle: 'none',
          hasEventPrefix: false
        }
      }
    ],
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 4,
    comment: {
      lines: [ 4, 8 ],
      text: 'Renders a <ButtonImport /> component with imported types\n' +
        '@param { import("./_imported-type").Chill } isChill\n' +
        '@return {React.ReactElement} - React component',
      rawText: '/**\n' +
        ' * Renders a <ButtonImport /> component with imported types\n' +
        ' * @param { import("./_imported-type").Chill } isChill\n' +
        ' * @return {React.ReactElement} - React component\n' +
        ' */',
    },
    code: 'export default function ButtonImport(props) {\n' +
      '  return (\n' +
      '    <button>\n' +
      "      {props.message || 'my button'}\n" +
      '    </button>\n' +
      '  )\n' +
      '}',
    ctx: { type: 'function', name: 'ButtonImport', text: 'ButtonImport()' },
    codeStart: 9,
    codeEnd: 15,
    codeLines: [ 9, 15 ]
  }
], 'resolve imported type')
})


test.run()