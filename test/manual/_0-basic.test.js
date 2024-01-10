const { test } = require('uvu')
const assert = require('uvu/assert')
const doxxx = require('../../lib/dox')
const deepLog = require('../utils/log')

test('basicDocBlock', async () => {
const basicDocBlock = `
/**
 * Configuration for markdown magic
 * 
 * Below is the main config for \`markdown-magic\`
 * 
 * @typedef {object} MarkdownMagicOptions
 * @property {Array} [transforms = defaultTransforms] - Custom commands to transform block contents, see transforms & custom transforms sections below.
 * @property {string} [outputDir] - Change output path of new content. Default behavior is replacing the original file
 * @property {SyntaxType} [syntax = 'md'] - Syntax to parse
 * @property {string} [open] - Opening match word
 * @property {string} [close] - Closing match word. If not defined will be same as opening word.
 * @property {string} [cwd] - Current working directory. Default process.cwd()
 * @property {boolean} [outputFlatten] - Flatten files that are output
 * @property {function} [handleOutputPath] - Custom function for altering output paths
 * @property {boolean} [useGitGlob] - Use git glob for LARGE file directories
 * @property {boolean} [dryRun = false] - See planned execution of matched blocks
 * @property {boolean} [debug = false] - See debug details
 * @property {boolean} [failOnMissingTransforms = false] - Fail if transform functions are missing. Default skip blocks.
 */
`
  const comments = doxxx.parseComments(basicDocBlock, {
    // raw: true
  })
  /*
  deepLog(comments)
  process.exit(1)
  /** */

assert.equal(comments, 
[
  {
    type: 'MarkdownMagicOptions',
    description: {
      summary: 'Configuration for markdown magic',
      body: 'Below is the main config for `markdown-magic`',
      text: 'Configuration for markdown magic\n' +
        '\n' +
        'Below is the main config for `markdown-magic`',
      html: '<p>Configuration for markdown magic</p>\n' +
        '<p>Below is the main config for <code>markdown-magic</code></p>',
      summaryHtml: '<p>Configuration for markdown magic</p>',
      bodyHtml: '<p>Below is the main config for <code>markdown-magic</code></p>'
    },
    tags: [
      {
        tagType: 'typedef',
        name: 'MarkdownMagicOptions',
        nameRaw: 'MarkdownMagicOptions',
        description: 'Configuration for markdown magic',
        tagValue: '{object} MarkdownMagicOptions',
        tagFull: '@typedef {object} MarkdownMagicOptions',
        type: 'object',
        types: [ 'object' ],
        isOptional: false,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: { type: 'NAME', name: 'object' }
      },
      {
        tagType: 'property',
        name: 'transforms',
        nameRaw: '[transforms = defaultTransforms]',
        description: 'Custom commands to transform block contents, see transforms & custom transforms sections below.',
        tagValue: '{Array} [transforms = defaultTransforms] - Custom commands to transform block contents, see transforms & custom transforms sections below.',
        tagFull: '@property {Array} [transforms = defaultTransforms] - Custom commands to transform block contents, see transforms & custom transforms sections below.',
        defaultValue: 'defaultTransforms',
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
        name: 'outputDir',
        nameRaw: '[outputDir]',
        description: 'Change output path of new content. Default behavior is replacing the original file',
        tagValue: '{string} [outputDir] - Change output path of new content. Default behavior is replacing the original file',
        tagFull: '@property {string} [outputDir] - Change output path of new content. Default behavior is replacing the original file',
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
        name: 'syntax',
        nameRaw: "[syntax = 'md']",
        description: 'Syntax to parse',
        tagValue: "{SyntaxType} [syntax = 'md'] - Syntax to parse",
        tagFull: "@property {SyntaxType} [syntax = 'md'] - Syntax to parse",
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
        name: 'open',
        nameRaw: '[open]',
        description: 'Opening match word',
        tagValue: '{string} [open] - Opening match word',
        tagFull: '@property {string} [open] - Opening match word',
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
        name: 'close',
        nameRaw: '[close]',
        description: 'Closing match word. If not defined will be same as opening word.',
        tagValue: '{string} [close] - Closing match word. If not defined will be same as opening word.',
        tagFull: '@property {string} [close] - Closing match word. If not defined will be same as opening word.',
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
        name: 'cwd',
        nameRaw: '[cwd]',
        description: 'Current working directory. Default process.cwd()',
        tagValue: '{string} [cwd] - Current working directory. Default process.cwd()',
        tagFull: '@property {string} [cwd] - Current working directory. Default process.cwd()',
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
        name: 'outputFlatten',
        nameRaw: '[outputFlatten]',
        description: 'Flatten files that are output',
        tagValue: '{boolean} [outputFlatten] - Flatten files that are output',
        tagFull: '@property {boolean} [outputFlatten] - Flatten files that are output',
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
        name: 'handleOutputPath',
        nameRaw: '[handleOutputPath]',
        description: 'Custom function for altering output paths',
        tagValue: '{function} [handleOutputPath] - Custom function for altering output paths',
        tagFull: '@property {function} [handleOutputPath] - Custom function for altering output paths',
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
        name: 'useGitGlob',
        nameRaw: '[useGitGlob]',
        description: 'Use git glob for LARGE file directories',
        tagValue: '{boolean} [useGitGlob] - Use git glob for LARGE file directories',
        tagFull: '@property {boolean} [useGitGlob] - Use git glob for LARGE file directories',
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
        name: 'dryRun',
        nameRaw: '[dryRun = false]',
        description: 'See planned execution of matched blocks',
        tagValue: '{boolean} [dryRun = false] - See planned execution of matched blocks',
        tagFull: '@property {boolean} [dryRun = false] - See planned execution of matched blocks',
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
        name: 'debug',
        nameRaw: '[debug = false]',
        description: 'See debug details',
        tagValue: '{boolean} [debug = false] - See debug details',
        tagFull: '@property {boolean} [debug = false] - See debug details',
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
        name: 'failOnMissingTransforms',
        nameRaw: '[failOnMissingTransforms = false]',
        description: 'Fail if transform functions are missing. Default skip blocks.',
        tagValue: '{boolean} [failOnMissingTransforms = false] - Fail if transform functions are missing. Default skip blocks.',
        tagFull: '@property {boolean} [failOnMissingTransforms = false] - Fail if transform functions are missing. Default skip blocks.',
        defaultValue: false,
        type: 'boolean',
        types: [ 'boolean' ],
        isOptional: true,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: { type: 'NAME', name: 'boolean' }
      }
    ],
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 2,
    comment: {
      lines: [ 2, 20 ],
      text: 'Configuration for markdown magic\n' +
        '\n' +
        'Below is the main config for `markdown-magic`\n' +
        '\n' +
        '@typedef {object} MarkdownMagicOptions\n' +
        '@property {Array} [transforms = defaultTransforms] - Custom commands to transform block contents, see transforms & custom transforms sections below.\n' +
        '@property {string} [outputDir] - Change output path of new content. Default behavior is replacing the original file\n' +
        "@property {SyntaxType} [syntax = 'md'] - Syntax to parse\n" +
        '@property {string} [open] - Opening match word\n' +
        '@property {string} [close] - Closing match word. If not defined will be same as opening word.\n' +
        '@property {string} [cwd] - Current working directory. Default process.cwd()\n' +
        '@property {boolean} [outputFlatten] - Flatten files that are output\n' +
        '@property {function} [handleOutputPath] - Custom function for altering output paths\n' +
        '@property {boolean} [useGitGlob] - Use git glob for LARGE file directories\n' +
        '@property {boolean} [dryRun = false] - See planned execution of matched blocks\n' +
        '@property {boolean} [debug = false] - See debug details\n' +
        '@property {boolean} [failOnMissingTransforms = false] - Fail if transform functions are missing. Default skip blocks.',
      rawText: '/**\n' +
        ' * Configuration for markdown magic\n' +
        ' * \n' +
        ' * Below is the main config for `markdown-magic`\n' +
        ' * \n' +
        ' * @typedef {object} MarkdownMagicOptions\n' +
        ' * @property {Array} [transforms = defaultTransforms] - Custom commands to transform block contents, see transforms & custom transforms sections below.\n' +
        ' * @property {string} [outputDir] - Change output path of new content. Default behavior is replacing the original file\n' +
        " * @property {SyntaxType} [syntax = 'md'] - Syntax to parse\n" +
        ' * @property {string} [open] - Opening match word\n' +
        ' * @property {string} [close] - Closing match word. If not defined will be same as opening word.\n' +
        ' * @property {string} [cwd] - Current working directory. Default process.cwd()\n' +
        ' * @property {boolean} [outputFlatten] - Flatten files that are output\n' +
        ' * @property {function} [handleOutputPath] - Custom function for altering output paths\n' +
        ' * @property {boolean} [useGitGlob] - Use git glob for LARGE file directories\n' +
        ' * @property {boolean} [dryRun = false] - See planned execution of matched blocks\n' +
        ' * @property {boolean} [debug = false] - See debug details\n' +
        ' * @property {boolean} [failOnMissingTransforms = false] - Fail if transform functions are missing. Default skip blocks.\n' +
        ' */'
    }
  }
]
, 'comments match')
})

test.run()
