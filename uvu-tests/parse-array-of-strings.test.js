const { test } = require('uvu')
const assert = require('uvu/assert')
const doxxx = require('../lib/dox')
const deepLog = require('../test/utils/log')


test('Resolve array type constant', async () => {
  const code = `/**
  * TypeScript style
  * @type {Rgb[]}
  */
 const color2 = [{ red: 111, green: 111, blue: 111 }];
`
  const result = doxxx.parseComments(code)
  // deepLog(result)
  // console.log('foundValues', foundValues)

assert.equal(result,[
  {
    description: {
      summary: 'TypeScript style',
      body: '',
      text: 'TypeScript style',
      html: '<p>TypeScript style</p>',
      summaryHtml: '<p>TypeScript style</p>',
      bodyHtml: ''
    },
    tags: [
      {
        tagType: 'type',
        tagValue: '{Rgb[]}',
        tagFull: '@type {Rgb[]}',
        name: '',
        nameRaw: '',
        description: '',
        type: 'Rgb[]',
        types: [ 'Array<Rgb>' ],
        isOptional: false,
        isArray: true,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: {
          type: 'GENERIC',
          subject: { type: 'NAME', name: 'Array' },
          objects: [ { type: 'NAME', name: 'Rgb' } ],
          meta: { syntax: 'SQUARE_BRACKET' }
        },
        html: '<p>{Rgb[]}</p>'
      }
    ],
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 1,
    comment: {
      lines: [ 1, 4 ],
      text: 'TypeScript style\n@type {Rgb[]}',
      rawText: '/**\n  * TypeScript style\n  * @type {Rgb[]}\n  */',
    },
    code: 'const color2 = [{ red: 111, green: 111, blue: 111 }];',
    ctx: {
      type: 'declaration',
      name: 'color2',
      value: '[{ red: 111, green: 111, blue: 111 }]',
      text: 'color2'
    },
    codeStart: 5,
    codeEnd: 5,
    codeLines: [ 5, 5 ]
  }
])
})

test('Resolve array types', async () => {
  const code = `
import React, { Component } from 'react'

/**
 * Renders a <Button /> component
 * @param {Array.<string>}
 * @return {React.ReactElement} - React component
 */
export default function ButtonTwo(props = {}) {
  return (
    <button>{props.text || 'my button'}</button>
  )
}
`
  const result = doxxx.parseComments(code)
  // deepLog(result)
  // console.log('foundValues', foundValues)

assert.equal(result, [
  {
    description: {
      summary: 'Renders a <Button /> component',
      body: '',
      text: 'Renders a <Button /> component',
      html: '<p>Renders a <Button /> component</p>',
      summaryHtml: '<p>Renders a <Button /> component</p>',
      bodyHtml: ''
    },
    tags: [
      {
        tagType: 'param',
        tagValue: '{Array.<string>}',
        tagFull: '@param {Array.<string>}',
        name: '',
        nameRaw: '',
        description: '',
        type: 'Array.<string>',
        types: [ 'Array<string>' ],
        isOptional: false,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: {
          type: 'GENERIC',
          subject: { type: 'NAME', name: 'Array' },
          objects: [ { type: 'NAME', name: 'string' } ],
          meta: { syntax: 'ANGLE_BRACKET_WITH_DOT' }
        },
        html: '<p>{Array.<string>}</p>'
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
      text: 'Renders a <Button /> component\n' +
        '@param {Array.<string>}\n' +
        '@return {React.ReactElement} - React component',
      rawText: '/**\n' +
        ' * Renders a <Button /> component\n' +
        ' * @param {Array.<string>}\n' +
        ' * @return {React.ReactElement} - React component\n' +
        ' */',
    },
    code: 'export default function ButtonTwo(props = {}) {\n' +
      '  return (\n' +
      "    <button>{props.text || 'my button'}</button>\n" +
      '  )\n' +
      '}',
    ctx: { type: 'function', name: 'ButtonTwo', text: 'ButtonTwo()' },
    codeStart: 9,
    codeEnd: 13,
    codeLines: [ 9, 13 ]
  }
])
})


test.run()