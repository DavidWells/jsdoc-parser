const { test } = require('uvu')
const assert = require('uvu/assert')
const doxxx = require('../../lib/dox')
const deepLog = require('../utils/log')

test('React component with @typedef Props', async () => {
const code = `
import React, { Component } from 'react'

/**
 * @typedef Props
 * @prop {string} [text] - My button
 * @prop {string} [textColor] - the color of the text in the button
 * @prop {string} [bgColor] - the background color of the button
 * @prop {React.CSSProperties} [overrideStyles] - used to set the CSS of the button
 * @prop {()=>void} [onLogin]
 */

/**
 * Renders a <Button /> component
 * 
 * Lol hi hi hi
 * @param {Props} props
 * @return {React.ReactElement} - React component
 */
export default function ButtonTwo(props = {}) {
  return (
    <button>{props.text || 'my button'}</button>
  )
}
`
  const comments = doxxx.parseComments(code)
  /*
  deepLog(comments)
  process.exit(1)
  /** */

assert.equal(comments, [
  {
    description: {
      summary: '',
      body: '',
      text: '',
      html: '',
      summaryHtml: '',
      bodyHtml: ''
    },
    tags: [
      {
        tagType: 'typedef',
        tagValue: 'Props',
        tagFull: '@typedef Props',
        name: '',
        nameRaw: '',
        description: '',
        type: 'Props',
        types: [ 'Props' ],
        isOptional: false,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: { type: 'NAME', name: 'Props' },
        html: '<p>Props</p>'
      },
      {
        tagType: 'prop',
        tagValue: '{string} [text] - My button',
        tagFull: '@prop {string} [text] - My button',
        name: 'text',
        nameRaw: '[text]',
        description: 'My button',
        type: 'string',
        types: [ 'string' ],
        isOptional: true,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: { type: 'NAME', name: 'string' }
      },
      {
        tagType: 'prop',
        tagValue: '{string} [textColor] - the color of the text in the button',
        tagFull: '@prop {string} [textColor] - the color of the text in the button',
        name: 'textColor',
        nameRaw: '[textColor]',
        description: 'the color of the text in the button',
        type: 'string',
        types: [ 'string' ],
        isOptional: true,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: { type: 'NAME', name: 'string' }
      },
      {
        tagType: 'prop',
        tagValue: '{string} [bgColor] - the background color of the button',
        tagFull: '@prop {string} [bgColor] - the background color of the button',
        name: 'bgColor',
        nameRaw: '[bgColor]',
        description: 'the background color of the button',
        type: 'string',
        types: [ 'string' ],
        isOptional: true,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: { type: 'NAME', name: 'string' }
      },
      {
        tagType: 'prop',
        tagValue: '{React.CSSProperties} [overrideStyles] - used to set the CSS of the button',
        tagFull: '@prop {React.CSSProperties} [overrideStyles] - used to set the CSS of the button',
        name: 'overrideStyles',
        nameRaw: '[overrideStyles]',
        description: 'used to set the CSS of the button',
        type: 'React.CSSProperties',
        types: [ 'React.CSSProperties' ],
        isOptional: true,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: {
          type: 'MEMBER',
          owner: { type: 'NAME', name: 'React' },
          name: 'CSSProperties',
          quoteStyle: 'none',
          hasEventPrefix: false
        }
      },
      {
        tagType: 'prop',
        tagValue: '{()=>void} [onLogin]',
        tagFull: '@prop {()=>void} [onLogin]',
        name: 'onLogin',
        nameRaw: '[onLogin]',
        description: '',
        type: '() => void',
        types: [ 'ARROW' ],
        isOptional: true,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: {
          type: 'ARROW',
          params: [],
          returns: { type: 'NAME', name: 'void' },
          new: null
        },
        html: '<p>{()=&gt;void} [onLogin]</p>'
      }
    ],
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 4,
    comment: {
      lines: [ 4, 11 ],
      text: '@typedef Props\n' +
        '@prop {string} [text] - My button\n' +
        '@prop {string} [textColor] - the color of the text in the button\n' +
        '@prop {string} [bgColor] - the background color of the button\n' +
        '@prop {React.CSSProperties} [overrideStyles] - used to set the CSS of the button\n' +
        '@prop {()=>void} [onLogin]',
      rawText: '/**\n' +
        ' * @typedef Props\n' +
        ' * @prop {string} [text] - My button\n' +
        ' * @prop {string} [textColor] - the color of the text in the button\n' +
        ' * @prop {string} [bgColor] - the background color of the button\n' +
        ' * @prop {React.CSSProperties} [overrideStyles] - used to set the CSS of the button\n' +
        ' * @prop {()=>void} [onLogin]\n' +
        ' */',
      fullText: '/**\n' +
        ' * @typedef Props\n' +
        ' * @prop {string} [text] - My button\n' +
        ' * @prop {string} [textColor] - the color of the text in the button\n' +
        ' * @prop {string} [bgColor] - the background color of the button\n' +
        ' * @prop {React.CSSProperties} [overrideStyles] - used to set the CSS of the button\n' +
        ' * @prop {()=>void} [onLogin]\n' +
        ' */'
    }
  },
  {
    description: {
      summary: 'Renders a <Button /> component',
      body: 'Lol hi hi hi',
      text: 'Renders a <Button /> component\n\nLol hi hi hi',
      html: '<p>Renders a <Button /> component</p>\n<p>Lol hi hi hi</p>',
      summaryHtml: '<p>Renders a <Button /> component</p>',
      bodyHtml: '<p>Lol hi hi hi</p>'
    },
    tags: [
      {
        tagType: 'param',
        tagValue: '{Props} props',
        tagFull: '@param {Props} props',
        name: 'props',
        nameRaw: 'props',
        description: '',
        type: 'Props',
        types: [ 'Props' ],
        isOptional: false,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: { type: 'NAME', name: 'Props' },
        html: '<p>{Props} props</p>'
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
    line: 13,
    comment: {
      lines: [ 13, 19 ],
      text: 'Renders a <Button /> component\n' +
        '\n' +
        'Lol hi hi hi\n' +
        '@param {Props} props\n' +
        '@return {React.ReactElement} - React component',
      rawText: '/**\n' +
        ' * Renders a <Button /> component\n' +
        ' * \n' +
        ' * Lol hi hi hi\n' +
        ' * @param {Props} props\n' +
        ' * @return {React.ReactElement} - React component\n' +
        ' */',
      fullText: '/**\n' +
        ' * Renders a <Button /> component\n' +
        ' * \n' +
        ' * Lol hi hi hi\n' +
        ' * @param {Props} props\n' +
        ' * @return {React.ReactElement} - React component\n' +
        ' */'
    },
    code: 'export default function ButtonTwo(props = {}) {\n' +
      '  return (\n' +
      "    <button>{props.text || 'my button'}</button>\n" +
      '  )\n' +
      '}',
    ctx: { type: 'function', name: 'ButtonTwo', text: 'ButtonTwo()' },
    codeStart: 20,
    codeEnd: 24,
    codeLines: [ 20, 24 ]
  }
], 'comments match')
})

test.run()