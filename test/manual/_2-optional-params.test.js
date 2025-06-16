const { test } = require('uvu')
const assert = require('uvu/assert')
const doxxx = require('../../lib/dox')
const deepLog = require('../utils/log')
const assertNoDiffs = require('../utils/object-diff')

const optionalParamCode = `
/**
 * An optional parameter (using JSDoc syntax)
 * @param {string} [somebody] - Somebody's name.
 */
function sayHello(somebody) {
  if (!somebody) {
    somebody = 'John Doe';
  }
  alert('Hello ' + somebody);
}

/**
 * An optional parameter (using Google Closure Compiler syntax)
 * @param {string=} somebody - Somebody's name.
 */
function sayBye(somebody) {
  if (!somebody) {
    somebody = 'John Doe';
  }
  alert('Hello ' + somebody);
}

/**
 * An optional parameter and default value
 * @param {string} [somebody=John Doe] - Somebody's name.
 */
function sayYo(somebody) {
  if (!somebody) {
    somebody = 'John Doe';
  }
  alert('Hello ' + somebody);
}
`



const codeTwox = `
/**
 * An optional parameter (using Google Closure Compiler syntax)
 * @param {string=} somebody - Somebody's name.
 */
function sayBye(somebody) {
  if (!somebody) {
    somebody = 'John Doe';
  }
  alert('Hello ' + somebody);
}
`

const codeNoQuotes = `
/**
 * An optional parameter and default value
 * @param {string} [somebody=John Doe] - Somebody's name.
 */
function sayYo(somebody) {
  if (!somebody) {
    somebody = 'John Doe';
  }
  alert('Hello ' + somebody);
}
`

const codeSingleQuotes = `
/**
 * An optional parameter and default value
 * @param {string} [somebody='John Doe'] - Somebody's name.
 */
function sayYo(somebody) {
  if (!somebody) {
    somebody = 'John Doe';
  }
  alert('Hello ' + somebody);
}
`

const codeDoubleQuotes = `
/**
 * An optional parameter and default value
 * @param {string} [somebody="John Doe hehehe"] - Somebody's name.
 */
function sayYo(somebody) {
  if (!somebody) {
    somebody = 'John Doe';
  }
  alert('Hello ' + somebody);
}
`

test('Code with optional params', async () => {
  const comments = doxxx.parseComments(optionalParamCode)
  /*
  deepLog(comments)
  process.exit(1)
  /** */
  const result = [
  {
    description: {
      summary: 'An optional parameter (using JSDoc syntax)',
      body: '',
      text: 'An optional parameter (using JSDoc syntax)',
      html: '<p>An optional parameter (using JSDoc syntax)</p>',
      summaryHtml: '<p>An optional parameter (using JSDoc syntax)</p>',
      bodyHtml: ''
    },
    tags: [
      {
        tagType: 'param',
        tagValue: "{string} [somebody] - Somebody's name.",
        tagFull: "@param {string} [somebody] - Somebody's name.",
        name: 'somebody',
        nameRaw: '[somebody]',
        description: "Somebody's name.",
        type: 'string',
        types: [ 'string' ],
        isOptional: true,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: { type: 'NAME', name: 'string' }
      }
    ],
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 2,
    comment: {
      lines: [ 2, 5 ],
      text: 'An optional parameter (using JSDoc syntax)\n' +
        "@param {string} [somebody] - Somebody's name.",
      rawText: '/**\n' +
        ' * An optional parameter (using JSDoc syntax)\n' +
        " * @param {string} [somebody] - Somebody's name.\n" +
        ' */',
    },
    codeStart: 6,
    code: 'function sayHello(somebody) {\n' +
      '  if (!somebody) {\n' +
      "    somebody = 'John Doe';\n" +
      '  }\n' +
      "  alert('Hello ' + somebody);\n" +
      '}',
    ctx: { type: 'function', name: 'sayHello', text: 'sayHello()' },
    codeEnd: 11,
    codeLines: [ 6, 11 ],
    validationErrors: []
  },
  {
    description: {
      summary: 'An optional parameter (using Google Closure Compiler syntax)',
      body: '',
      text: 'An optional parameter (using Google Closure Compiler syntax)',
      html: '<p>An optional parameter (using Google Closure Compiler syntax)</p>',
      summaryHtml: '<p>An optional parameter (using Google Closure Compiler syntax)</p>',
      bodyHtml: ''
    },
    tags: [
      {
        tagType: 'param',
        tagValue: "{string=} somebody - Somebody's name.",
        tagFull: "@param {string=} somebody - Somebody's name.",
        name: 'somebody',
        nameRaw: 'somebody',
        description: "Somebody's name.",
        type: 'string=',
        types: [ 'string' ],
        isOptional: true,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: {
          type: 'OPTIONAL',
          value: { type: 'NAME', name: 'string' },
          meta: { syntax: 'SUFFIX_EQUALS_SIGN' }
        }
      }
    ],
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 13,
    comment: {
      lines: [ 13, 16 ],
      text: 'An optional parameter (using Google Closure Compiler syntax)\n' +
        "@param {string=} somebody - Somebody's name.",
      rawText: '/**\n' +
        ' * An optional parameter (using Google Closure Compiler syntax)\n' +
        " * @param {string=} somebody - Somebody's name.\n" +
        ' */',
    },
    codeStart: 17,
    code: 'function sayBye(somebody) {\n' +
      '  if (!somebody) {\n' +
      "    somebody = 'John Doe';\n" +
      '  }\n' +
      "  alert('Hello ' + somebody);\n" +
      '}',
    ctx: { type: 'function', name: 'sayBye', text: 'sayBye()' },
    codeEnd: 22,
    codeLines: [ 17, 22 ],
    validationErrors: []
  },
  {
    description: {
      summary: 'An optional parameter and default value',
      body: '',
      text: 'An optional parameter and default value',
      html: '<p>An optional parameter and default value</p>',
      summaryHtml: '<p>An optional parameter and default value</p>',
      bodyHtml: ''
    },
    tags: [
      {
        tagType: 'param',
        tagValue: "{string} [somebody=John Doe] - Somebody's name.",
        tagFull: "@param {string} [somebody=John Doe] - Somebody's name.",
        name: 'somebody',
        nameRaw: '[somebody=John Doe]',
        description: "Somebody's name.",
        defaultValue: 'John Doe',
        type: 'string',
        types: [ 'string' ],
        isOptional: true,
        isNullable: false,
        isNonNullable: false,
        isVariadic: false,
        jsDocAst: { type: 'NAME', name: 'string' }
      }
    ],
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 24,
    comment: {
      lines: [ 24, 27 ],
      text: 'An optional parameter and default value\n' +
        "@param {string} [somebody=John Doe] - Somebody's name.",
      rawText: '/**\n' +
        ' * An optional parameter and default value\n' +
        " * @param {string} [somebody=John Doe] - Somebody's name.\n" +
        ' */',
    },
    code: 'function sayYo(somebody) {\n' +
      '  if (!somebody) {\n' +
      "    somebody = 'John Doe';\n" +
      '  }\n' +
      "  alert('Hello ' + somebody);\n" +
      '}',
    ctx: { type: 'function', name: 'sayYo', text: 'sayYo()' },
    codeStart: 28,
    codeEnd: 33,
    codeLines: [ 28, 33 ],
    validationErrors: []
  }
]

assertNoDiffs(result, comments)

assert.equal(comments, result, 'comments match')
})


test('Code default value as object', async () => {
  const codeWithDefaultValueAsObject = `
/**
 * An optional parameter and default value
 * @param {string} [somebody={ name: John Doe }] - Somebody's name.
 */
function sayCool(somebody) {
  if (!somebody) {
    somebody = 'John Doe';
  }
  alert('Hello ' + somebody);
}
`
  const comments = doxxx.parseComments(codeWithDefaultValueAsObject)
  /*
  deepLog(comments)
  process.exit(1)
  /** */
  assert.equal(comments[0].tags[0].defaultValue, { name: 'John Doe' }, 'comments match')
})

test('Code default value as array', async () => {
  const codeWithDefaultValueAsArray = `
  /**
   * An optional parameter and default value
   * @param {string} [somebody=['one', 'two', 'three']] - Somebody's name.
   */
  function sayCool(somebody) {
    if (!somebody) {
      somebody = 'John Doe';
    }
    alert('Hello ' + somebody);
  }
  `
  const comments = doxxx.parseComments(codeWithDefaultValueAsArray)
  /*
  deepLog(comments)
  process.exit(1)
  /** */
  assert.equal(comments[0].tags[0].defaultValue, ['one', 'two', 'three'], 'comments match')
})

test.run()