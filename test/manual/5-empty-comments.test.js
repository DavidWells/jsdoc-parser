const x = `

/**   
 * description text 
 * 
 * With a body of junk
 */

`

const variousComments = `
/** 
 * description text 
 */

/**
 * description
 * @module {Type.<Type,Type(Type,Type.<Type>)>} [name={}] - description text
 * @module {Type} name description text
 * @module [name] - description text
 * @module name - description text
 * @module name
 */

/** @extends {Type.<Type,Type(Type,Type.<Type>)>} [name={}] - description text */
/** @extends {Type} name description text */
/** @extends [name] - description text */
/** @extends namex - description text */
/** @extends namey */

/** @tag {Type.<Type,Type(Type,Type.<Type>)>} - description text */
/** @tag {Type} description text */
/** @tag - description text */
/** @tag description text */
/** @tag */

/*! ignore */
/*!
 * ignore
 */

/* ignore */
/*
 * ignore
 */
`

const { test } = require('uvu')
const assert = require('uvu/assert')
const doxxx = require('../../lib/dox')
const deepLog = require('../utils/log')

test('Varied comments', async () => {
  const comments = doxxx.parseComments(x)
  //*
  deepLog(comments)
 
  process.exit(1)
  /** */
  assert.is(comments.length, 12)


assert.equal(comments, [
  {
    tags: [],
    description: {
      summary: 'description text',
      body: '',
      text: 'description text',
      html: '<p>description text</p>',
      summaryHtml: '<p>description text</p>',
      bodyHtml: ''
    },
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    ignore: false,
    line: 2,
    codeStart: 3
  },
  {
    tags: [
      {
        tagType: 'module',
        tagValue: '{Type.<Type,Type(Type,Type.<Type>)>} [name={}] - description text',
        tagFull: '@module {Type.<Type,Type(Type,Type.<Type>)>} [name={}] - description text',
        name: '',
        nameRaw: '',
        description: '',
        html: '<p>{Type.&lt;Type,Type(Type,Type.<Type>)&gt;} [name={}] - description text</p>'
      },
      {
        tagType: 'module',
        tagValue: '{Type} name description text',
        tagFull: '@module {Type} name description text',
        name: '',
        nameRaw: '',
        description: '',
        html: '<p>{Type} name description text</p>'
      },
      {
        tagType: 'module',
        tagValue: '[name] - description text',
        tagFull: '@module [name] - description text',
        name: '',
        nameRaw: '',
        description: '',
        html: '<p>[name] - description text</p>'
      },
      {
        tagType: 'module',
        tagValue: 'name - description text',
        tagFull: '@module name - description text',
        name: '',
        nameRaw: '',
        description: '',
        html: '<p>name - description text</p>'
      },
      {
        tagType: 'module',
        tagValue: 'name',
        tagFull: '@module name',
        name: '',
        nameRaw: '',
        description: '',
        html: '<p>name</p>'
      }
    ],
    description: {
      summary: 'description',
      body: '',
      text: 'description',
      html: '<p>description</p>',
      summaryHtml: '<p>description</p>',
      bodyHtml: ''
    },
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    ignore: false,
    line: 4,
    codeStart: 12
  },
  {
    tags: [
      {
        tagType: 'extends',
        tagValue: '{Type.<Type,Type(Type,Type.<Type>)>} [name={}] - description text',
        tagFull: '@extends {Type.<Type,Type(Type,Type.<Type>)>} [name={}] - description text',
        name: '',
        nameRaw: '',
        description: '',
        otherClass: '{Type.<Type,Type(Type,Type.<Type>)>}',
        html: '<p>{Type.&lt;Type,Type(Type,Type.<Type>)&gt;} [name={}] - description text</p>'
      }
    ],
    description: {
      summary: '',
      body: '',
      text: '',
      html: '',
      summaryHtml: '',
      bodyHtml: ''
    },
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    ignore: false,
    line: 13,
    codeStart: 14
  },
  {
    tags: [
      {
        tagType: 'extends',
        tagValue: '{Type} name description text',
        tagFull: '@extends {Type} name description text',
        name: '',
        nameRaw: '',
        description: '',
        otherClass: '{Type}',
        html: '<p>{Type} name description text</p>'
      }
    ],
    description: {
      summary: '',
      body: '',
      text: '',
      html: '',
      summaryHtml: '',
      bodyHtml: ''
    },
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    ignore: false,
    line: 14,
    codeStart: 15
  },
  {
    tags: [
      {
        tagType: 'extends',
        tagValue: '[name] - description text',
        tagFull: '@extends [name] - description text',
        name: '',
        nameRaw: '',
        description: '',
        otherClass: '[name]',
        html: '<p>[name] - description text</p>'
      }
    ],
    description: {
      summary: '',
      body: '',
      text: '',
      html: '',
      summaryHtml: '',
      bodyHtml: ''
    },
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    ignore: false,
    line: 15,
    codeStart: 16
  },
  {
    tags: [
      {
        tagType: 'extends',
        tagValue: 'namex - description text',
        tagFull: '@extends namex - description text',
        name: '',
        nameRaw: '',
        description: '',
        otherClass: 'namex',
        html: '<p>namex - description text</p>'
      }
    ],
    description: {
      summary: '',
      body: '',
      text: '',
      html: '',
      summaryHtml: '',
      bodyHtml: ''
    },
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    ignore: false,
    line: 16,
    codeStart: 17
  },
  {
    tags: [
      {
        tagType: 'extends',
        tagValue: 'namey',
        tagFull: '@extends namey',
        name: '',
        nameRaw: '',
        description: '',
        otherClass: 'namey',
        html: '<p>namey</p>'
      }
    ],
    description: {
      summary: '',
      body: '',
      text: '',
      html: '',
      summaryHtml: '',
      bodyHtml: ''
    },
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    ignore: false,
    line: 17,
    codeStart: 18
  },
  {
    tags: [
      {
        tagType: 'tag',
        tagValue: '{Type.<Type,Type(Type,Type.<Type>)>} - description text',
        tagFull: '@tag {Type.<Type,Type(Type,Type.<Type>)>} - description text',
        name: '',
        nameRaw: '',
        description: '',
        html: '<p>{Type.&lt;Type,Type(Type,Type.<Type>)&gt;} - description text</p>'
      }
    ],
    description: {
      summary: '',
      body: '',
      text: '',
      html: '',
      summaryHtml: '',
      bodyHtml: ''
    },
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    ignore: false,
    line: 19,
    codeStart: 20
  },
  {
    tags: [
      {
        tagType: 'tag',
        tagValue: '{Type} description text',
        tagFull: '@tag {Type} description text',
        name: '',
        nameRaw: '',
        description: '',
        html: '<p>{Type} description text</p>'
      }
    ],
    description: {
      summary: '',
      body: '',
      text: '',
      html: '',
      summaryHtml: '',
      bodyHtml: ''
    },
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    ignore: false,
    line: 20,
    codeStart: 21
  },
  {
    tags: [
      {
        tagType: 'tag',
        tagValue: '- description text',
        tagFull: '@tag - description text',
        name: '',
        nameRaw: '',
        description: '',
        html: '<ul>\n<li>description text</li>\n</ul>'
      }
    ],
    description: {
      summary: '',
      body: '',
      text: '',
      html: '',
      summaryHtml: '',
      bodyHtml: ''
    },
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    ignore: false,
    line: 21,
    codeStart: 22
  },
  {
    tags: [
      {
        tagType: 'tag',
        tagValue: 'description text',
        tagFull: '@tag description text',
        name: '',
        nameRaw: '',
        description: '',
        html: '<p>description text</p>'
      }
    ],
    description: {
      summary: '',
      body: '',
      text: '',
      html: '',
      summaryHtml: '',
      bodyHtml: ''
    },
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    ignore: false,
    line: 22,
    codeStart: 23
  },
  {
    tags: [
      {
        tagType: 'tag',
        tagValue: '',
        tagFull: '@tag',
        name: '',
        nameRaw: '',
        description: '',
        html: ''
      }
    ],
    description: {
      summary: '',
      body: '',
      text: '',
      html: '',
      summaryHtml: '',
      bodyHtml: ''
    },
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    ignore: false,
    line: 23,
    codeStart: 24
  },
  {
    tags: [],
    description: {
      summary: 'ignore',
      body: '',
      text: 'ignore',
      html: '<p>ignore</p>',
      summaryHtml: '<p>ignore</p>',
      bodyHtml: ''
    },
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    ignore: true,
    line: 25,
    codeStart: 26
  },
  {
    tags: [],
    description: {
      summary: 'ignore',
      body: '',
      text: 'ignore',
      html: '<p>ignore</p>',
      summaryHtml: '<p>ignore</p>',
      bodyHtml: ''
    },
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    ignore: true,
    line: 26,
    codeStart: 29
  },
  {
    tags: [],
    description: {
      summary: 'ignore',
      body: '',
      text: 'ignore',
      html: '<p>ignore</p>',
      summaryHtml: '<p>ignore</p>',
      bodyHtml: ''
    },
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    ignore: false,
    line: 30,
    codeStart: 31
  },
  {
    tags: [],
    description: {
      summary: 'ignore',
      body: '',
      text: 'ignore',
      html: '<p>ignore</p>',
      summaryHtml: '<p>ignore</p>',
      bodyHtml: ''
    },
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    ignore: false,
    line: 31,
    codeStart: 34
  }
], 'comments match')
})

test.run()
