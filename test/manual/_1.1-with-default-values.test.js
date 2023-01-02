const { test } = require('uvu')
const assert = require('uvu/assert')
const doxxx = require('../../lib/dox')
const deepLog = require('../utils/log')

test('API is exposed', async () => {
  assert.is(typeof doxxx.parseComments, 'function')
})

test('Basic block with default values', async () => {
const basicDocBlock = `
/**
* Checks if person is cool
*
* This is a great function
*
* @param  {string}  [name='bob'] - persons name
* @param  {object}  [opts] - Cool checker options
* @param  {string}  [opts.age] - Persons age
* @param  {string}  [opts.height=100] - Persons height
* @param  {boolean} [opts.isRad] - Rad checker
* @settings foo=bar baz=yippe
* @return {boolean} - React component
*/
export default function isCool(name, opts = {}) {
  if(opts.isRad) return true
  return false
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
          tagValue: "{string}  [name='bob'] - persons name",
          tagFull: "@param  {string}  [name='bob'] - persons name",
          name: 'name',
          nameRaw: "[name='bob']",
          description: 'persons name',
          defaultValue: 'bob',
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
          tagValue: '{object}  [opts] - Cool checker options',
          tagFull: '@param  {object}  [opts] - Cool checker options',
          name: 'opts',
          nameRaw: '[opts]',
          description: 'Cool checker options',
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
          tagValue: '{string}  [opts.age] - Persons age',
          tagFull: '@param  {string}  [opts.age] - Persons age',
          name: 'opts.age',
          nameRaw: '[opts.age]',
          description: 'Persons age',
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
          tagValue: '{string}  [opts.height=100] - Persons height',
          tagFull: '@param  {string}  [opts.height=100] - Persons height',
          name: 'opts.height',
          nameRaw: '[opts.height=100]',
          description: 'Persons height',
          defaultValue: '100',
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
          tagValue: '{boolean} [opts.isRad] - Rad checker',
          tagFull: '@param  {boolean} [opts.isRad] - Rad checker',
          name: 'opts.isRad',
          nameRaw: '[opts.isRad]',
          description: 'Rad checker',
          type: 'boolean',
          types: [ 'boolean' ],
          optional: true,
          nullable: false,
          nonNullable: false,
          variable: false,
          jsDocAst: { type: 'NAME', name: 'boolean' }
        },
        {
          tagType: 'settings',
          tagValue: 'foo=bar baz=yippe',
          tagFull: '@settings foo=bar baz=yippe',
          name: '',
          nameRaw: '',
          description: '',
          html: '<p>foo=bar baz=yippe</p>'
        },
        {
          tagType: 'return',
          tagValue: '{boolean} - React component',
          tagFull: '@return {boolean} - React component',
          description: 'React component',
          type: 'boolean',
          types: [ 'boolean' ],
          optional: false,
          nullable: false,
          nonNullable: false,
          variable: false,
          jsDocAst: { type: 'NAME', name: 'boolean' }
        }
      ],
      description: {
        summary: 'Checks if person is cool',
        body: 'This is a great function',
        text: 'Checks if person is cool\n\nThis is a great function',
        html: '<p>Checks if person is cool</p>\n<p>This is a great function</p>',
        summaryHtml: '<p>Checks if person is cool</p>',
        bodyHtml: '<p>This is a great function</p>'
      },
      isPrivate: false,
      isConstructor: false,
      isClass: false,
      isEvent: false,
      ignore: false,
      line: 2,
      codeStart: 15,
      code: 'export default function isCool(name, opts = {}) {\n' +
        '  if(opts.isRad) return true\n' +
        '  return false\n' +
        '}',
      ctx: { type: 'function', name: 'isCool', text: 'isCool()' }
    }
  ], 'comments match')
})

test.run()
