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
      description: {
        summary: 'Renders a <Button /> component',
        body: 'More stuff in here',
        text: 'Renders a <Button /> component\n\nMore stuff in here',
        html: '<p>Renders a <Button /> component</p>\n<p>More stuff in here</p>',
        summaryHtml: '<p>Renders a <Button /> component</p>',
        bodyHtml: '<p>More stuff in here</p>'
      },
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
          isOptional: true,
          isNullable: false,
          isNonNullable: false,
          isVariadic: false,
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
          isOptional: true,
          isNullable: false,
          isNonNullable: false,
          isVariadic: false,
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
          isOptional: true,
          isNullable: false,
          isNonNullable: false,
          isVariadic: false,
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
          isOptional: true,
          isNullable: false,
          isNonNullable: false,
          isVariadic: false,
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
          isOptional: true,
          isNullable: false,
          isNonNullable: false,
          isVariadic: false,
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
      line: 2,
      comment: {
        lines: [ 2, 14 ],
        text: 'Renders a <Button /> component\n' +
          '\n' +
          'More stuff in here\n' +
          '\n' +
          '@param  {object}  [props] - Button props\n' +
          '@param  {string}  [props.text] - My button\n' +
          '@param  {boolean} [props.isActive] - is button active\n' +
          '@param  {string}  [props.className] - CSS class name\n' +
          '@param  {React.ReactNode} [props.children] - component children;\n' +
          '@param  {React.CSSProperties} [props.style] - used to set the CSS of the button\n' +
          '@return {React.ReactElement} - React component',
        rawText: '/**\n' +
          '* Renders a <Button /> component\n' +
          '* \n' +
          '* More stuff in here\n' +
          '*\n' +
          '* @param  {object}  [props] - Button props\n' +
          '* @param  {string}  [props.text] - My button\n' +
          '* @param  {boolean} [props.isActive] - is button active\n' +
          '* @param  {string}  [props.className] - CSS class name\n' +
          '* @param  {React.ReactNode} [props.children] - component children;\n' +
          '* @param  {React.CSSProperties} [props.style] - used to set the CSS of the button\n' +
          '* @return {React.ReactElement} - React component\n' +
          '*/',
      },
      code: 'export default function Button(props = {}) {\n' +
        '  return (\n' +
        '    <button style={props.style}>\n' +
        '      {props.text}\n' +
        "      {props.children || 'my button'}\n" +
        '    </button>\n' +
        '  )\n' +
        '}',
      ctx: { type: 'function', name: 'Button', text: 'Button()' },
      codeStart: 15,
      codeEnd: 22,
      codeLines: [ 15, 22 ],
      validationErrors: []
    }
  ], 'comments match')
})

test.run()
