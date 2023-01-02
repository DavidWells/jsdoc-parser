const { test } = require('uvu')
const assert = require('uvu/assert')
const doxxx = require('../../lib/dox')
const deepLog = require('../utils/log')

test('API is exposed', async () => {
  assert.is(typeof doxxx.parseComments, 'function')
})

test('React component with basic doc block', async () => {
const basicDocBlock = `
/**
* Renders a <Button /> component
* 
* More stuff in here
*
* @param  {object}  [props] - Button props
* @param  {string}  [props.text] - My button
* @param  {boolean} [props.isActive] - is button active
* @param  {string}  [props.className] - CSS class name
* @param  {React.ReactNode} [props.children] - component children;
* @param  {React.CSSProperties} [props.style] - used to set the CSS of the button
* @return {React.ReactElement} - React component
*/
export default function Button(props = {}) {
  return (
    <button style={props.style}>
      {props.text}
      {props.children || 'my button'}
    </button>
  )
}
`
  const comments = doxxx.parseComments(basicDocBlock)
  /*
  deepLog(comments)
  process.exit(1)
  /** */


  assert.equal(comments, [
    {
      tags: [
        {
          tagType: 'param',
          tagValue: '{object}  [props] - Button props',
          tagFull: '@param  {object}  [props] - Button props',
          name: 'props',
          nameRaw: '[props]',
          description: 'Button props',
          type: 'object',
          types: [ 'object' ],
          optional: true,
          nullable: false,
          nonNullable: false,
          variable: false,
          jsDocAst: { type: 'NAME', name: 'object' }
        },
        {
          tagType: 'param',
          tagValue: '{string}  [props.text] - My button',
          tagFull: '@param  {string}  [props.text] - My button',
          name: 'props.text',
          nameRaw: '[props.text]',
          description: 'My button',
          type: 'string',
          types: [ 'string' ],
          optional: true,
          nullable: false,
          nonNullable: false,
          variable: false,
          jsDocAst: { type: 'NAME', name: 'string' }
        },
        {
          tagType: 'param',
          tagValue: '{boolean} [props.isActive] - is button active',
          tagFull: '@param  {boolean} [props.isActive] - is button active',
          name: 'props.isActive',
          nameRaw: '[props.isActive]',
          description: 'is button active',
          type: 'boolean',
          types: [ 'boolean' ],
          optional: true,
          nullable: false,
          nonNullable: false,
          variable: false,
          jsDocAst: { type: 'NAME', name: 'boolean' }
        },
        {
          tagType: 'param',
          tagValue: '{string}  [props.className] - CSS class name',
          tagFull: '@param  {string}  [props.className] - CSS class name',
          name: 'props.className',
          nameRaw: '[props.className]',
          description: 'CSS class name',
          type: 'string',
          types: [ 'string' ],
          optional: true,
          nullable: false,
          nonNullable: false,
          variable: false,
          jsDocAst: { type: 'NAME', name: 'string' }
        },
        {
          tagType: 'param',
          tagValue: '{React.ReactNode} [props.children] - component children;',
          tagFull: '@param  {React.ReactNode} [props.children] - component children;',
          name: 'props.children',
          nameRaw: '[props.children]',
          description: 'component children;',
          type: 'React.ReactNode',
          types: [ 'React.ReactNode' ],
          optional: true,
          nullable: false,
          nonNullable: false,
          variable: false,
          jsDocAst: {
            type: 'MEMBER',
            owner: { type: 'NAME', name: 'React' },
            name: 'ReactNode',
            quoteStyle: 'none',
            hasEventPrefix: false
          }
        },
        {
          tagType: 'param',
          tagValue: '{React.CSSProperties} [props.style] - used to set the CSS of the button',
          tagFull: '@param  {React.CSSProperties} [props.style] - used to set the CSS of the button',
          name: 'props.style',
          nameRaw: '[props.style]',
          description: 'used to set the CSS of the button',
          type: 'React.CSSProperties',
          types: [ 'React.CSSProperties' ],
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
          }
        },
        {
          tagType: 'return',
          tagValue: '{React.ReactElement} - React component',
          tagFull: '@return {React.ReactElement} - React component',
          description: 'React component',
          type: 'React.ReactElement',
          types: [ 'React.ReactElement' ],
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
          }
        }
      ],
      description: {
        summary: 'Renders a <Button /> component',
        body: 'More stuff in here',
        text: 'Renders a <Button /> component\n\nMore stuff in here',
        html: '<p>Renders a <Button /> component</p>\n<p>More stuff in here</p>',
        summaryHtml: '<p>Renders a <Button /> component</p>',
        bodyHtml: '<p>More stuff in here</p>'
      },
      isPrivate: false,
      isConstructor: false,
      isClass: false,
      isEvent: false,
      ignore: false,
      line: 2,
      codeStart: 15,
      code: 'export default function Button(props = {}) {\n' +
        '  return (\n' +
        '    <button style={props.style}>\n' +
        '      {props.text}\n' +
        "      {props.children || 'my button'}\n" +
        '    </button>\n' +
        '  )\n' +
        '}',
      ctx: { type: 'function', name: 'Button', text: 'Button()' }
    }
  ], 'comments match')
})

test.run()
