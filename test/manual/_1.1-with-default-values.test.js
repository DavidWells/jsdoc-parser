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
* @param  {string}  [opts.height] - Persons height
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
  //*
  deepLog(comments)
  process.exit(1)
  /** */

  assert.equal(comments, [
    {
      tags: [
        {
          type: 'param',
          name: "[name='bob']",
          description: 'persons name',
          types: [ 'string' ],
          typesDescription: 'string',
          optional: true,
          nullable: false,
          nonNullable: false,
          variable: false,
          jsDocAst: { type: 'NAME', name: 'string' },
          string: "{string}  [name='bob'] - persons name",
          descriptionHtml: '<p>persons name</p>'
        },
        {
          type: 'param',
          name: '[opts]',
          description: 'Cool checker options',
          types: [ 'object' ],
          typesDescription: 'object',
          optional: true,
          nullable: false,
          nonNullable: false,
          variable: false,
          jsDocAst: { type: 'NAME', name: 'object' },
          string: '{object}  [opts] - Cool checker options',
          descriptionHtml: '<p>Cool checker options</p>'
        },
        {
          type: 'param',
          name: '[opts.age]',
          description: 'Persons age',
          types: [ 'string' ],
          typesDescription: 'string',
          optional: true,
          nullable: false,
          nonNullable: false,
          variable: false,
          jsDocAst: { type: 'NAME', name: 'string' },
          string: '{string}  [opts.age] - Persons age',
          descriptionHtml: '<p>Persons age</p>'
        },
        {
          type: 'param',
          name: '[opts.height]',
          description: 'Persons height',
          types: [ 'string' ],
          typesDescription: 'string',
          optional: true,
          nullable: false,
          nonNullable: false,
          variable: false,
          jsDocAst: { type: 'NAME', name: 'string' },
          string: '{string}  [opts.height] - Persons height',
          descriptionHtml: '<p>Persons height</p>'
        },
        {
          type: 'param',
          name: '[opts.isRad]',
          description: 'Rad checker',
          types: [ 'boolean' ],
          typesDescription: 'boolean',
          optional: true,
          nullable: false,
          nonNullable: false,
          variable: false,
          jsDocAst: { type: 'NAME', name: 'boolean' },
          string: '{boolean} [opts.isRad] - Rad checker',
          descriptionHtml: '<p>Rad checker</p>'
        },
        {
          type: 'return',
          types: [ 'boolean' ],
          typesDescription: 'boolean',
          optional: false,
          nullable: false,
          nonNullable: false,
          variable: false,
          jsDocAst: { type: 'NAME', name: 'boolean' },
          description: 'React component',
          string: '{boolean} - React component',
          descriptionHtml: '<p>React component</p>'
        }
      ],
      description: {
        raw: 'Checks if person is cool',
        full: '<p>Checks if person is cool</p>',
        summary: '<p>Checks if person is cool</p>',
        body: ''
      },
      isPrivate: false,
      isConstructor: false,
      isClass: false,
      isEvent: false,
      ignore: false,
      line: 2,
      codeStart: 11,
      code: 'export default function isCool(name, opts = {}) {\n' +
        '  if(opts.isRad) return true\n' +
        '  return false\n' +
        '}',
      ctx: { type: 'function', name: 'isCool', string: 'isCool()' }
    }
  ], 'comments match')
})

test.run()
