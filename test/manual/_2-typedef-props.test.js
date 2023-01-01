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
      tags: [
        {
          type: 'typedef',
          types: [ 'Props' ],
          typesDescription: 'Props',
          optional: false,
          nullable: false,
          nonNullable: false,
          variable: false,
          jsDocAst: { type: 'NAME', name: 'Props' },
          string: 'Props',
          html: '<p>Props</p>'
        },
        {
          type: 'prop',
          name: '[text]',
          description: 'My button',
          types: [ 'string' ],
          typesDescription: 'string',
          optional: true,
          nullable: false,
          nonNullable: false,
          variable: false,
          jsDocAst: { type: 'NAME', name: 'string' },
          string: '{string} [text] - My button',
          descriptionHtml: '<p>My button</p>'
        },
        {
          type: 'prop',
          name: '[textColor]',
          description: 'the color of the text in the button',
          types: [ 'string' ],
          typesDescription: 'string',
          optional: true,
          nullable: false,
          nonNullable: false,
          variable: false,
          jsDocAst: { type: 'NAME', name: 'string' },
          string: '{string} [textColor] - the color of the text in the button',
          descriptionHtml: '<p>the color of the text in the button</p>'
        },
        {
          type: 'prop',
          name: '[bgColor]',
          description: 'the background color of the button',
          types: [ 'string' ],
          typesDescription: 'string',
          optional: true,
          nullable: false,
          nonNullable: false,
          variable: false,
          jsDocAst: { type: 'NAME', name: 'string' },
          string: '{string} [bgColor] - the background color of the button',
          descriptionHtml: '<p>the background color of the button</p>'
        },
        {
          type: 'prop',
          name: '[overrideStyles]',
          description: 'used to set the CSS of the button',
          types: [ 'React.CSSProperties' ],
          typesDescription: 'React.CSSProperties',
          optional: true,
          nullable: false,
          nonNullable: false,
          variable: false,
          jsDocAst: {
            type: 'MEMBER',
            owner: { type: 'NAME', name: 'React' },
            name: 'CSSProperties',
            quoteStyle: 'none',
            hasEventPrefix: false
          },
          string: '{React.CSSProperties} [overrideStyles] - used to set the CSS of the button',
          descriptionHtml: '<p>used to set the CSS of the button</p>'
        },
        {
          type: 'prop',
          name: '[onLogin]',
          description: '',
          types: [ 'ARROW' ],
          typesDescription: '() => void',
          optional: true,
          nullable: false,
          nonNullable: false,
          variable: false,
          jsDocAst: {
            type: 'ARROW',
            params: [],
            returns: { type: 'NAME', name: 'void' },
            new: null
          },
          string: '{()=>void} [onLogin]',
          html: '<p>{()=&gt;void} [onLogin]</p>'
        }
      ],
      description: { raw: '', full: '', summary: '', body: '' },
      isPrivate: false,
      isConstructor: false,
      isClass: false,
      isEvent: false,
      ignore: false,
      line: 4,
      codeStart: 12
    },
    {
      tags: [
        {
          type: 'param',
          name: 'props',
          description: '',
          types: [ 'Props' ],
          typesDescription: 'Props',
          optional: false,
          nullable: false,
          nonNullable: false,
          variable: false,
          jsDocAst: { type: 'NAME', name: 'Props' },
          string: '{Props} props',
          html: '<p>{Props} props</p>'
        },
        {
          type: 'return',
          types: [ 'React.ReactElement' ],
          typesDescription: 'React.ReactElement',
          optional: false,
          nullable: false,
          nonNullable: false,
          variable: false,
          jsDocAst: {
            type: 'MEMBER',
            owner: { type: 'NAME', name: 'React' },
            name: 'ReactElement',
            quoteStyle: 'none',
            hasEventPrefix: false
          },
          description: 'React component',
          string: '{React.ReactElement} - React component',
          descriptionHtml: '<p>React component</p>'
        }
      ],
      description: {
        raw: 'Renders a <Button /> component\n\nLol hi hi hi',
        full: '<p>Renders a <Button /> component</p>\n<p>Lol hi hi hi</p>',
        summary: '<p>Renders a <Button /> component</p>',
        body: '<p>Lol hi hi hi</p>'
      },
      isPrivate: false,
      isConstructor: false,
      isClass: false,
      isEvent: false,
      ignore: false,
      line: 13,
      codeStart: 20,
      code: 'export default function ButtonTwo(props = {}) {\n' +
        '  return (\n' +
        "    <button>{props.text || 'my button'}</button>\n" +
        '  )\n' +
        '}',
      ctx: { type: 'function', name: 'ButtonTwo', string: 'ButtonTwo()' }
    }
  ], 'comments match')
})

test.run()