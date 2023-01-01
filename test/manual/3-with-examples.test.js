const { test } = require('uvu')
const assert = require('uvu/assert')
const doxxx = require('../../lib/dox')
const deepLog = require('../utils/log')

test('API is exposed', async () => {
  assert.is(typeof doxxx.parseComments, 'function')
})

test('React component with examples', async () => {
const basicDocBlock = `
/**
* Renders a <Button /> component
* @param  {object}  [props] - Button props
* @param  {string}  [props.text] - My button
* @param  {boolean} [props.isActive] - is button active
* @param  {string}  [props.className] - CSS class name
* @param  {React.ReactNode} [props.children] - component children;
* @param  {React.CSSProperties} [props.style] - used to set the CSS of the button
* @return {React.ReactElement} - React component
* @example
  <Button className='cool'>
    Words
  </Button>
* @example
  <Button className='other'>
    Words
  </Button>
* @example
* <Button className='third'>
*   Words
* </Button>
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
        type: 'param',
        name: '[props]',
        description: 'Button props',
        types: [ 'object' ],
        typesDescription: 'object',
        optional: true,
        nullable: false,
        nonNullable: false,
        variable: false,
        jsDocAst: { type: 'NAME', name: 'object' },
        string: '{object}  [props] - Button props',
        descriptionHtml: '<p>Button props</p>'
      },
      {
        type: 'param',
        name: '[props.text]',
        description: 'My button',
        types: [ 'string' ],
        typesDescription: 'string',
        optional: true,
        nullable: false,
        nonNullable: false,
        variable: false,
        jsDocAst: { type: 'NAME', name: 'string' },
        string: '{string}  [props.text] - My button',
        descriptionHtml: '<p>My button</p>'
      },
      {
        type: 'param',
        name: '[props.isActive]',
        description: 'is button active',
        types: [ 'boolean' ],
        typesDescription: 'boolean',
        optional: true,
        nullable: false,
        nonNullable: false,
        variable: false,
        jsDocAst: { type: 'NAME', name: 'boolean' },
        string: '{boolean} [props.isActive] - is button active',
        descriptionHtml: '<p>is button active</p>'
      },
      {
        type: 'param',
        name: '[props.className]',
        description: 'CSS class name',
        types: [ 'string' ],
        typesDescription: 'string',
        optional: true,
        nullable: false,
        nonNullable: false,
        variable: false,
        jsDocAst: { type: 'NAME', name: 'string' },
        string: '{string}  [props.className] - CSS class name',
        descriptionHtml: '<p>CSS class name</p>'
      },
      {
        type: 'param',
        name: '[props.children]',
        description: 'component children;',
        types: [ 'React.ReactNode' ],
        typesDescription: 'React.ReactNode',
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
        },
        string: '{React.ReactNode} [props.children] - component children;',
        descriptionHtml: '<p>component children;</p>'
      },
      {
        type: 'param',
        name: '[props.style]',
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
        string: '{React.CSSProperties} [props.style] - used to set the CSS of the button',
        descriptionHtml: '<p>used to set the CSS of the button</p>'
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
      },
      {
        type: 'example',
        string: "<Button className='cool'>\n  Words\n</Button>",
        html: '<pre><code>\n' +
          "<Button className='cool'>\n" +
          '  Words\n' +
          '</Button>\n' +
          '</code></pre>'
      },
      {
        type: 'example',
        string: "<Button className='other'>\n  Words\n</Button>",
        html: '<pre><code>\n' +
          "<Button className='other'>\n" +
          '  Words\n' +
          '</Button>\n' +
          '</code></pre>'
      },
      {
        type: 'example',
        string: "<Button className='third'>\n  Words\n</Button>",
        html: '<pre><code>\n' +
          "<Button className='third'>\n" +
          '  Words\n' +
          '</Button>\n' +
          '</code></pre>'
      }
    ],
    description: {
      raw: 'Renders a <Button /> component',
      full: '<p>Renders a <Button /> component</p>',
      summary: '<p>Renders a <Button /> component</p>',
      body: ''
    },
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    ignore: false,
    line: 2,
    codeStart: 24,
    code: 'export default function Button(props = {}) {\n' +
      '  return (\n' +
      '    <button style={props.style}>\n' +
      '      {props.text}\n' +
      "      {props.children || 'my button'}\n" +
      '    </button>\n' +
      '  )\n' +
      '}',
    ctx: { type: 'function', name: 'Button', string: 'Button()' }
  }
], 'comments match')
})

test.run()
