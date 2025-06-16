const { test } = require('uvu')
const assert = require('uvu/assert')
const doxxx = require('../../lib/dox')
const deepLog = require('../utils/log')

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
      },
      {
        tagType: 'example',
        tagValue: "<Button className='cool'>\n  Words\n</Button>",
        tagFull: "@example\n  <Button className='cool'>\n    Words\n  </Button>",
        name: '',
        nameRaw: '',
        description: '',
        html: '<pre><code>\n' +
          "<Button className='cool'>\n" +
          '  Words\n' +
          '</Button>\n' +
          '</code></pre>'
      },
      {
        tagType: 'example',
        tagValue: "<Button className='other'>\n  Words\n</Button>",
        tagFull: "@example\n  <Button className='other'>\n    Words\n  </Button>",
        name: '',
        nameRaw: '',
        description: '',
        html: '<pre><code>\n' +
          "<Button className='other'>\n" +
          '  Words\n' +
          '</Button>\n' +
          '</code></pre>'
      },
      {
        tagType: 'example',
        tagValue: "<Button className='third'>\n  Words\n</Button>",
        tagFull: "@example\n<Button className='third'>\n  Words\n</Button>",
        name: '',
        nameRaw: '',
        description: '',
        html: '<pre><code>\n' +
          "<Button className='third'>\n" +
          '  Words\n' +
          '</Button>\n' +
          '</code></pre>'
      }
    ],
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 2,
    comment: {
      lines: [ 2, 23 ],
      text: 'Renders a <Button /> component\n' +
        '@param  {object}  [props] - Button props\n' +
        '@param  {string}  [props.text] - My button\n' +
        '@param  {boolean} [props.isActive] - is button active\n' +
        '@param  {string}  [props.className] - CSS class name\n' +
        '@param  {React.ReactNode} [props.children] - component children;\n' +
        '@param  {React.CSSProperties} [props.style] - used to set the CSS of the button\n' +
        '@return {React.ReactElement} - React component\n' +
        '@example\n' +
        "  <Button className='cool'>\n" +
        '    Words\n' +
        '  </Button>\n' +
        '@example\n' +
        "  <Button className='other'>\n" +
        '    Words\n' +
        '  </Button>\n' +
        '@example\n' +
        "<Button className='third'>\n" +
        '  Words\n' +
        '</Button>',
      rawText: '/**\n' +
        '* Renders a <Button /> component\n' +
        '* @param  {object}  [props] - Button props\n' +
        '* @param  {string}  [props.text] - My button\n' +
        '* @param  {boolean} [props.isActive] - is button active\n' +
        '* @param  {string}  [props.className] - CSS class name\n' +
        '* @param  {React.ReactNode} [props.children] - component children;\n' +
        '* @param  {React.CSSProperties} [props.style] - used to set the CSS of the button\n' +
        '* @return {React.ReactElement} - React component\n' +
        '* @example\n' +
        "  <Button className='cool'>\n" +
        '    Words\n' +
        '  </Button>\n' +
        '* @example\n' +
        "  <Button className='other'>\n" +
        '    Words\n' +
        '  </Button>\n' +
        '* @example\n' +
        "* <Button className='third'>\n" +
        '*   Words\n' +
        '* </Button>\n' +
        '*/',
    },
    validationErrors: [],
    code: 'export default function Button(props = {}) {\n' +
      '  return (\n' +
      '    <button style={props.style}>\n' +
      '      {props.text}\n' +
      "      {props.children || 'my button'}\n" +
      '    </button>\n' +
      '  )\n' +
      '}',
    ctx: { type: 'function', name: 'Button', text: 'Button()' },
    codeStart: 24,
    codeEnd: 31,
    codeLines: [ 24, 31 ]
  }
], 'comments match')
})

test.run()
