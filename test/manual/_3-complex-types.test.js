const { test } = require('uvu')
const assert = require('uvu/assert')
const doxxx = require('../../lib/dox')
const deepLog = require('../utils/log')

const code = `
/**
 *
 * @param {number|string|{name:string,age:number}} a
 * @param {number|{name:string,age:number}|Array} a
 * @returns {{name:string,age:number}}
 */
function complexTypeParamAndReturn(a, b) {
  return {
    name: 'Test',
    age: 30
  }
}

/**
 *
 * @param {number | string | {length: number, type: {name: {first: string, last: string}, id: number | string}}} a Description of param
 */
function nestedComplexTypeParam(a) {

}

/**
 *
 * @param {number=} a
 */
function optionalParam(a) {

}

/**
 *
 * @param {?number} a
 */
function nullableParam(a) {

}

/**
 *
 * @param {!number} a
 */
function nonNullableParam(a) {

}

/**
 *
 * @param {...number} a
 */
function variableParam(a) {

}

/*
 *
 * @param {?...number=} a - foobar
 */
function optionalVariableNullableParam(a) {

}
`

test('Complex JSdoc types {number=}, {!number}, {...number}', async () => {
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
        tagType: 'param',
        tagValue: '{number|string|{name:string,age:number}} a',
        tagFull: '@param {number|string|{name:string,age:number}} a',
        name: 'a',
        nameRaw: 'a',
        description: '',
        type: 'number | string | {name: string, age: number}',
        types: [
          'number',
          'string',
          { name: [ 'string' ], age: [ 'number' ] }
        ],
        isOptional: false,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: {
          type: 'UNION',
          left: { type: 'NAME', name: 'number' },
          right: {
            type: 'UNION',
            left: { type: 'NAME', name: 'string' },
            right: {
              type: 'RECORD',
              entries: [
                {
                  type: 'RECORD_ENTRY',
                  key: 'name',
                  quoteStyle: 'none',
                  value: { type: 'NAME', name: 'string' },
                  readonly: false
                },
                {
                  type: 'RECORD_ENTRY',
                  key: 'age',
                  quoteStyle: 'none',
                  value: { type: 'NAME', name: 'number' },
                  readonly: false
                }
              ]
            }
          }
        },
        html: '<p>{number|string|{name:string,age:number}} a</p>'
      },
      {
        tagType: 'param',
        tagValue: '{number|{name:string,age:number}|Array} a',
        tagFull: '@param {number|{name:string,age:number}|Array} a',
        name: 'a',
        nameRaw: 'a',
        description: '',
        type: 'number | {name: string, age: number} | Array',
        types: [
          'number',
          { name: [ 'string' ], age: [ 'number' ] },
          'Array'
        ],
        isOptional: false,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: {
          type: 'UNION',
          left: { type: 'NAME', name: 'number' },
          right: {
            type: 'UNION',
            left: {
              type: 'RECORD',
              entries: [
                {
                  type: 'RECORD_ENTRY',
                  key: 'name',
                  quoteStyle: 'none',
                  value: { type: 'NAME', name: 'string' },
                  readonly: false
                },
                {
                  type: 'RECORD_ENTRY',
                  key: 'age',
                  quoteStyle: 'none',
                  value: { type: 'NAME', name: 'number' },
                  readonly: false
                }
              ]
            },
            right: { type: 'NAME', name: 'Array' }
          }
        },
        html: '<p>{number|{name:string,age:number}|Array} a</p>'
      },
      {
        tagType: 'returns',
        tagValue: '{{name:string,age:number}}',
        tagFull: '@returns {{name:string,age:number}}',
        type: '{name: string, age: number}',
        types: [ { name: [ 'string' ], age: [ 'number' ] } ],
        isOptional: false,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: {
          type: 'RECORD',
          entries: [
            {
              type: 'RECORD_ENTRY',
              key: 'name',
              quoteStyle: 'none',
              value: { type: 'NAME', name: 'string' },
              readonly: false
            },
            {
              type: 'RECORD_ENTRY',
              key: 'age',
              quoteStyle: 'none',
              value: { type: 'NAME', name: 'number' },
              readonly: false
            }
          ]
        },
        html: '<p>{{name:string,age:number}}</p>'
      }
    ],
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 2,
    comment: {
      lines: [ 2, 7 ],
      text: '@param {number|string|{name:string,age:number}} a\n' +
        '@param {number|{name:string,age:number}|Array} a\n' +
        '@returns {{name:string,age:number}}',
      rawText: '/**\n' +
        ' *\n' +
        ' * @param {number|string|{name:string,age:number}} a\n' +
        ' * @param {number|{name:string,age:number}|Array} a\n' +
        ' * @returns {{name:string,age:number}}\n' +
        ' */',
    },
    validationErrors: [{
      type: 'DUPLICATE_PARAM',
      message: 'Duplicate parameter name: a (used 2 times)'
    }],
    codeStart: 8,
    code: 'function complexTypeParamAndReturn(a, b) {\n' +
      '  return {\n' +
      "    name: 'Test',\n" +
      '    age: 30\n' +
      '  }\n' +
      '}',
    ctx: {
      type: 'function',
      name: 'complexTypeParamAndReturn',
      text: 'complexTypeParamAndReturn()'
    },
    codeEnd: 13,
    codeLines: [ 8, 13 ]
  },
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
        tagType: 'param',
        tagValue: '{number | string | {length: number, type: {name: {first: string, last: string}, id: number | string}}} a Description of param',
        tagFull: '@param {number | string | {length: number, type: {name: {first: string, last: string}, id: number | string}}} a Description of param',
        name: 'a',
        nameRaw: 'a',
        description: 'Description of param',
        type: 'number | string | {length: number, type: {name: {first: string, last: string}, id: number | string}}',
        types: [
          'number',
          'string',
          {
            length: [ 'number' ],
            type: [
              {
                name: [ { first: [ 'string' ], last: [ 'string' ] } ],
                id: [ 'number', 'string' ]
              }
            ]
          }
        ],
        isOptional: false,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: {
          type: 'UNION',
          left: { type: 'NAME', name: 'number' },
          right: {
            type: 'UNION',
            left: { type: 'NAME', name: 'string' },
            right: {
              type: 'RECORD',
              entries: [
                {
                  type: 'RECORD_ENTRY',
                  key: 'length',
                  quoteStyle: 'none',
                  value: { type: 'NAME', name: 'number' },
                  readonly: false
                },
                {
                  type: 'RECORD_ENTRY',
                  key: 'type',
                  quoteStyle: 'none',
                  value: {
                    type: 'RECORD',
                    entries: [
                      {
                        type: 'RECORD_ENTRY',
                        key: 'name',
                        quoteStyle: 'none',
                        value: {
                          type: 'RECORD',
                          entries: [
                            {
                              type: 'RECORD_ENTRY',
                              key: 'first',
                              quoteStyle: 'none',
                              value: { type: 'NAME', name: 'string' },
                              readonly: false
                            },
                            {
                              type: 'RECORD_ENTRY',
                              key: 'last',
                              quoteStyle: 'none',
                              value: { type: 'NAME', name: 'string' },
                              readonly: false
                            }
                          ]
                        },
                        readonly: false
                      },
                      {
                        type: 'RECORD_ENTRY',
                        key: 'id',
                        quoteStyle: 'none',
                        value: {
                          type: 'UNION',
                          left: { type: 'NAME', name: 'number' },
                          right: { type: 'NAME', name: 'string' }
                        },
                        readonly: false
                      }
                    ]
                  },
                  readonly: false
                }
              ]
            }
          }
        }
      }
    ],
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 15,
    comment: {
      lines: [ 15, 18 ],
      text: '@param {number | string | {length: number, type: {name: {first: string, last: string}, id: number | string}}} a Description of param',
      rawText: '/**\n' +
        ' *\n' +
        ' * @param {number | string | {length: number, type: {name: {first: string, last: string}, id: number | string}}} a Description of param\n' +
        ' */',
    },
    validationErrors: [],
    codeStart: 19,
    code: 'function nestedComplexTypeParam(a) {\n\n}',
    ctx: {
      type: 'function',
      name: 'nestedComplexTypeParam',
      text: 'nestedComplexTypeParam()'
    },
    codeEnd: 21,
    codeLines: [ 19, 21 ]
  },
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
        tagType: 'param',
        tagValue: '{number=} a',
        tagFull: '@param {number=} a',
        name: 'a',
        nameRaw: 'a',
        description: '',
        type: 'number=',
        types: [ 'number' ],
        isOptional: true,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: {
          type: 'OPTIONAL',
          value: { type: 'NAME', name: 'number' },
          meta: { syntax: 'SUFFIX_EQUALS_SIGN' }
        },
        html: '<p>{number=} a</p>'
      }
    ],
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 23,
    comment: {
      lines: [ 23, 26 ],
      text: '@param {number=} a',
      rawText: '/**\n *\n * @param {number=} a\n */',
    },
    validationErrors: [],
    codeStart: 27,
    code: 'function optionalParam(a) {\n\n}',
    ctx: {
      type: 'function',
      name: 'optionalParam',
      text: 'optionalParam()'
    },
    codeEnd: 29,
    codeLines: [ 27, 29 ]
  },
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
        tagType: 'param',
        tagValue: '{?number} a',
        tagFull: '@param {?number} a',
        name: 'a',
        nameRaw: 'a',
        description: '',
        type: '?number',
        types: [ 'number' ],
        isOptional: false,
        isNullable: true,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: {
          type: 'NULLABLE',
          value: { type: 'NAME', name: 'number' },
          meta: { syntax: 'PREFIX_QUESTION_MARK' }
        },
        html: '<p>{?number} a</p>'
      }
    ],
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 31,
    comment: {
      lines: [ 31, 34 ],
      text: '@param {?number} a',
      rawText: '/**\n *\n * @param {?number} a\n */',
    },
    validationErrors: [],
    codeStart: 35,
    code: 'function nullableParam(a) {\n\n}',
    ctx: {
      type: 'function',
      name: 'nullableParam',
      text: 'nullableParam()'
    },
    codeEnd: 37,
    codeLines: [ 35, 37 ]
  },
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
        tagType: 'param',
        tagValue: '{!number} a',
        tagFull: '@param {!number} a',
        name: 'a',
        nameRaw: 'a',
        description: '',
        type: '!number',
        types: [ 'number' ],
        isOptional: false,
        isNullable: false,
        isNonNullable: true,
        isVariadic: false,
        jsDocAst: {
          type: 'NOT_NULLABLE',
          value: { type: 'NAME', name: 'number' },
          meta: { syntax: 'PREFIX_BANG' }
        },
        html: '<p>{!number} a</p>'
      }
    ],
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 39,
    comment: {
      lines: [ 39, 42 ],
      text: '@param {!number} a',
      rawText: '/**\n *\n * @param {!number} a\n */',
    },
    validationErrors: [],
    codeStart: 43,
    code: 'function nonNullableParam(a) {\n\n}',
    ctx: {
      type: 'function',
      name: 'nonNullableParam',
      text: 'nonNullableParam()'
    },
    codeEnd: 45,
    codeLines: [ 43, 45 ]
  },
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
        tagType: 'param',
        tagValue: '{...number} a',
        tagFull: '@param {...number} a',
        name: 'a',
        nameRaw: 'a',
        description: '',
        type: '...number',
        types: [ 'number' ],
        isOptional: false,
        isNullable: false,
        isNonNullable: false,
        isVariadic: true,
        jsDocAst: {
          type: 'VARIADIC',
          value: { type: 'NAME', name: 'number' },
          meta: { syntax: 'PREFIX_DOTS' }
        },
        html: '<p>{...number} a</p>'
      }
    ],
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 47,
    comment: {
      lines: [ 47, 50 ],
      text: '@param {...number} a',
      rawText: '/**\n *\n * @param {...number} a\n */',
    },
    validationErrors: [],
    codeStart: 51,
    code: 'function variableParam(a) {\n\n}',
    ctx: {
      type: 'function',
      name: 'variableParam',
      text: 'variableParam()'
    },
    codeEnd: 53,
    codeLines: [ 51, 53 ]
  },
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
        tagType: 'param',
        tagValue: '{?...number=} a - foobar',
        tagFull: '@param {?...number=} a - foobar',
        name: 'a',
        nameRaw: 'a',
        description: 'foobar',
        type: '...number=',
        types: [ 'number' ],
        isOptional: true,
        isNullable: true,
        isNonNullable: false,
        isVariadic: true,
        jsDocAst: {
          type: 'VARIADIC',
          value: {
            type: 'OPTIONAL',
            value: { type: 'NAME', name: 'number' },
            meta: { syntax: 'SUFFIX_EQUALS_SIGN' }
          },
          meta: { syntax: 'PREFIX_DOTS' }
        }
      }
    ],
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 55,
    comment: {
      lines: [ 55, 57 ],
      text: '@param {?...number=} a - foobar',
      rawText: '/*\n *\n * @param {?...number=} a - foobar\n */',
    },
    validationErrors: [],
    code: 'function optionalVariableNullableParam(a) {\n\n}',
    ctx: {
      type: 'function',
      name: 'optionalVariableNullableParam',
      text: 'optionalVariableNullableParam()'
    },
    codeStart: 59,
    codeEnd: 61,
    codeLines: [ 59, 61 ]
  }
], 'comments match')
})

test.run()
