const { test } = require('uvu')
const assert = require('uvu/assert')
const doxxx = require('../lib/dox')
const deepLog = require('../test/utils/log')


test.only('Resolve default values', async () => {
  const block = `
/**
 * @typedef {object} MarkdownMagicOptions
 * @property {Array} [transforms] - Custom commands to transform block contents, see transforms & custom transforms sections below.
 * @property {boolean} [failOnMissingTransforms = false] - Fail if transform functions are missing. Default skip blocks.
 * @property {string} [outputDir='/path'] - Change output path of new content. Default behavior is replacing the original file
 * @property {boolean} [outputFlatten] - Flatten files that are output
 * @property {function} [handleOutputPath] - Custom function for altering output paths
 * @property {boolean} [useGitGlob] - Use git glob for LARGE file directories
 * @property {boolean} [dryRun = false] - See planned execution of matched blocks
 * @property {boolean} [debug = true] - See debug details
 * @property {SyntaxType} [syntax='md'] - Syntax to parse
 * @property {object} [testObj = { foo: 'bar' }] - default object value 
 * @property {array} [testArr = ['one, 'two', 'three']] - default object value 
 */
`
  const result = doxxx.parseComments(block)
  /*
  deepLog(result)
  process.exit(1)
  /** */

assert.equal(result, [
  {
    type: 'MarkdownMagicOptions',
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
        tagValue: '{object} MarkdownMagicOptions',
        tagFull: '@typedef {object} MarkdownMagicOptions',
        name: 'MarkdownMagicOptions',
        nameRaw: 'MarkdownMagicOptions',
        description: '',
        type: 'object',
        types: [ 'object' ],
        isOptional: false,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: { type: 'NAME', name: 'object' },
        html: '<p>{object} MarkdownMagicOptions</p>'
      },
      {
        tagType: 'property',
        tagValue: '{Array} [transforms] - Custom commands to transform block contents, see transforms & custom transforms sections below.',
        tagFull: '@property {Array} [transforms] - Custom commands to transform block contents, see transforms & custom transforms sections below.',
        name: 'transforms',
        nameRaw: '[transforms]',
        description: 'Custom commands to transform block contents, see transforms & custom transforms sections below.',
        type: 'Array',
        types: [ 'Array' ],
        isOptional: true,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: { type: 'NAME', name: 'Array' }
      },
      {
        tagType: 'property',
        tagValue: '{boolean} [failOnMissingTransforms = false] - Fail if transform functions are missing. Default skip blocks.',
        tagFull: '@property {boolean} [failOnMissingTransforms = false] - Fail if transform functions are missing. Default skip blocks.',
        name: 'failOnMissingTransforms',
        nameRaw: '[failOnMissingTransforms = false]',
        description: 'Fail if transform functions are missing. Default skip blocks.',
        defaultValue: false,
        type: 'boolean',
        types: [ 'boolean' ],
        isOptional: true,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: { type: 'NAME', name: 'boolean' }
      },
      {
        tagType: 'property',
        tagValue: "{string} [outputDir='/path'] - Change output path of new content. Default behavior is replacing the original file",
        tagFull: "@property {string} [outputDir='/path'] - Change output path of new content. Default behavior is replacing the original file",
        name: 'outputDir',
        nameRaw: "[outputDir='/path']",
        description: 'Change output path of new content. Default behavior is replacing the original file',
        defaultValue: '/path',
        type: 'string',
        types: [ 'string' ],
        isOptional: true,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: { type: 'NAME', name: 'string' }
      },
      {
        tagType: 'property',
        tagValue: '{boolean} [outputFlatten] - Flatten files that are output',
        tagFull: '@property {boolean} [outputFlatten] - Flatten files that are output',
        name: 'outputFlatten',
        nameRaw: '[outputFlatten]',
        description: 'Flatten files that are output',
        type: 'boolean',
        types: [ 'boolean' ],
        isOptional: true,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: { type: 'NAME', name: 'boolean' }
      },
      {
        tagType: 'property',
        tagValue: '{function} [handleOutputPath] - Custom function for altering output paths',
        tagFull: '@property {function} [handleOutputPath] - Custom function for altering output paths',
        name: 'handleOutputPath',
        nameRaw: '[handleOutputPath]',
        description: 'Custom function for altering output paths',
        type: 'function',
        types: [ 'function' ],
        isOptional: true,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: { type: 'NAME', name: 'function' }
      },
      {
        tagType: 'property',
        tagValue: '{boolean} [useGitGlob] - Use git glob for LARGE file directories',
        tagFull: '@property {boolean} [useGitGlob] - Use git glob for LARGE file directories',
        name: 'useGitGlob',
        nameRaw: '[useGitGlob]',
        description: 'Use git glob for LARGE file directories',
        type: 'boolean',
        types: [ 'boolean' ],
        isOptional: true,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: { type: 'NAME', name: 'boolean' }
      },
      {
        tagType: 'property',
        tagValue: '{boolean} [dryRun = false] - See planned execution of matched blocks',
        tagFull: '@property {boolean} [dryRun = false] - See planned execution of matched blocks',
        name: 'dryRun',
        nameRaw: '[dryRun = false]',
        description: 'See planned execution of matched blocks',
        defaultValue: false,
        type: 'boolean',
        types: [ 'boolean' ],
        isOptional: true,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: { type: 'NAME', name: 'boolean' }
      },
      {
        tagType: 'property',
        tagValue: '{boolean} [debug = true] - See debug details',
        tagFull: '@property {boolean} [debug = true] - See debug details',
        name: 'debug',
        nameRaw: '[debug = true]',
        description: 'See debug details',
        defaultValue: true,
        type: 'boolean',
        types: [ 'boolean' ],
        isOptional: true,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: { type: 'NAME', name: 'boolean' }
      },
      {
        tagType: 'property',
        tagValue: "{SyntaxType} [syntax='md'] - Syntax to parse",
        tagFull: "@property {SyntaxType} [syntax='md'] - Syntax to parse",
        name: 'syntax',
        nameRaw: "[syntax='md']",
        description: 'Syntax to parse',
        defaultValue: 'md',
        type: 'SyntaxType',
        types: [ 'SyntaxType' ],
        isOptional: true,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: { type: 'NAME', name: 'SyntaxType' }
      },
      {
        tagType: 'property',
        tagValue: "{object} [testObj = { foo: 'bar' }] - default object value ",
        tagFull: "@property {object} [testObj = { foo: 'bar' }] - default object value ",
        name: 'testObj',
        nameRaw: "[testObj = { foo: 'bar' }]",
        description: 'default object value',
        defaultValue: { foo: 'bar' },
        type: 'object',
        types: [ 'object' ],
        isOptional: true,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: { type: 'NAME', name: 'object' }
      },
      {
        tagType: 'property',
        tagValue: "{array} [testArr = ['one, 'two', 'three']] - default object value",
        tagFull: "@property {array} [testArr = ['one, 'two', 'three']] - default object value",
        name: 'testArr',
        nameRaw: "[testArr = ['one, 'two', 'three']]",
        description: 'default object value',
        defaultValue: [ 'one', 'two', 'three' ],
        type: 'array',
        types: [ 'array' ],
        isOptional: true,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: { type: 'NAME', name: 'array' }
      }
    ],
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 2,
    comment: {
      lines: [ 2, 16 ],
      text: '@typedef {object} MarkdownMagicOptions\n' +
        '@property {Array} [transforms] - Custom commands to transform block contents, see transforms & custom transforms sections below.\n' +
        '@property {boolean} [failOnMissingTransforms = false] - Fail if transform functions are missing. Default skip blocks.\n' +
        "@property {string} [outputDir='/path'] - Change output path of new content. Default behavior is replacing the original file\n" +
        '@property {boolean} [outputFlatten] - Flatten files that are output\n' +
        '@property {function} [handleOutputPath] - Custom function for altering output paths\n' +
        '@property {boolean} [useGitGlob] - Use git glob for LARGE file directories\n' +
        '@property {boolean} [dryRun = false] - See planned execution of matched blocks\n' +
        '@property {boolean} [debug = true] - See debug details\n' +
        "@property {SyntaxType} [syntax='md'] - Syntax to parse\n" +
        "@property {object} [testObj = { foo: 'bar' }] - default object value \n" +
        "@property {array} [testArr = ['one, 'two', 'three']] - default object value",
      rawText: '/**\n' +
        ' * @typedef {object} MarkdownMagicOptions\n' +
        ' * @property {Array} [transforms] - Custom commands to transform block contents, see transforms & custom transforms sections below.\n' +
        ' * @property {boolean} [failOnMissingTransforms = false] - Fail if transform functions are missing. Default skip blocks.\n' +
        " * @property {string} [outputDir='/path'] - Change output path of new content. Default behavior is replacing the original file\n" +
        ' * @property {boolean} [outputFlatten] - Flatten files that are output\n' +
        ' * @property {function} [handleOutputPath] - Custom function for altering output paths\n' +
        ' * @property {boolean} [useGitGlob] - Use git glob for LARGE file directories\n' +
        ' * @property {boolean} [dryRun = false] - See planned execution of matched blocks\n' +
        ' * @property {boolean} [debug = true] - See debug details\n' +
        " * @property {SyntaxType} [syntax='md'] - Syntax to parse\n" +
        " * @property {object} [testObj = { foo: 'bar' }] - default object value \n" +
        " * @property {array} [testArr = ['one, 'two', 'three']] - default object value \n" +
        ' */',
    },
    validationErrors: []
  }
])
})

test.run()
