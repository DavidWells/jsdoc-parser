const { test } = require('uvu')
const assert = require('uvu/assert')
const doxxx = require('../../lib/dox')
const deepLog = require('../utils/log')


test('Match comment ignore', async () => {
  const one = `
  /*! ignore */
  `

  const oneComments = doxxx.parseComments(one)

  assert.is(oneComments.length, 1)
  assert.is(oneComments[0].tags.length, 0)

  /*
  deepLog(oneComments)
  process.exit(1)
  /** */

  assert.equal(oneComments, [
    {
      description: {
        summary: 'ignore',
        body: '',
        text: 'ignore',
        html: '<p>ignore</p>',
        summaryHtml: '<p>ignore</p>',
        bodyHtml: ''
      },
      tags: [],
      isIgnored: true,
      isPrivate: false,
      isConstructor: false,
      isClass: false,
      isEvent: false,
      line: 2,
      comment: {
        lines: [ 2, 2 ],
        text: 'ignore',
        rawText: '/*! ignore */',
      }
    }
  ], 'ignore')

  const two = `
  /*!
  * ignore
  */
  `
  const twoComments = doxxx.parseComments(two)

  assert.is(twoComments.length, 1)
  assert.is(twoComments[0].tags.length, 0)
  /*
  deepLog(twoComments)
  process.exit(1)
  /** */
assert.equal(twoComments, [
  {
    description: {
      summary: 'ignore',
      body: '',
      text: 'ignore',
      html: '<p>ignore</p>',
      summaryHtml: '<p>ignore</p>',
      bodyHtml: ''
    },
    tags: [],
    isIgnored: true,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 2,
    comment: {
      lines: [ 2, 4 ],
      text: 'ignore',
      rawText: '/*!\n  * ignore\n  */',
    }
  }
], 'ignore two')

})

test('Match comment with no tags', async () => {
  const comments = doxxx.parseComments(`

  /**   
   * description text 
   * 
   * With a body of junk
   */
  
  `)
  /*
  deepLog(comments)
  process.exit(1)
  /** */

  assert.is(comments.length, 1)
  assert.is(comments[0].tags.length, 0)
assert.equal(comments, [
  {
    description: {
      summary: 'description text ',
      body: 'With a body of junk',
      text: 'description text \n\nWith a body of junk',
      html: '<p>description text</p>\n<p>With a body of junk</p>',
      summaryHtml: '<p>description text</p>',
      bodyHtml: '<p>With a body of junk</p>'
    },
    tags: [],
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 3,
    comment: {
      lines: [ 3, 8 ],
      text: 'description text \n\nWith a body of junk',
      rawText: '/**   \n   * description text \n   * \n   * With a body of junk\n   */',
    }
  }
])

})

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

/* ignorex */

/*
 * xignore
 */
`

test.only('Varied xxx', async () => {
  const comments = doxxx.parseComments(`
/*
 * ignore
 */
`, {
  // skipSingleStar: true
})
  /*
  deepLog(comments)
  console.log('comments.length', comments.length)
  process.exit(1)
  /** */
assert.equal(comments, [
  {
    description: {
      summary: 'ignore',
      body: '',
      text: 'ignore',
      html: '<p>ignore</p>',
      summaryHtml: '<p>ignore</p>',
      bodyHtml: ''
    },
    tags: [],
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 2,
    comment: {
      lines: [ 2, 3 ],
      text: 'ignore',
      rawText: '/*\n * ignore\n */',
    },
    validationErrors: []
  }
])

})

test('Varied comments', async () => {
  const comments = doxxx.parseComments(variousComments, {
    excludeIgnored: true,
    //skipSingleStar: true
  })
  //*
  deepLog(comments)
  console.log('comments.length', comments.length)
  process.exit(1)
  /** */
  assert.is(comments.length, 12)


assert.equal(comments, [
  {
    description: {
      summary: 'description text',
      body: '',
      text: 'description text',
      html: '<p>description text</p>',
      summaryHtml: '<p>description text</p>',
      bodyHtml: ''
    },
    tags: [],
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 2,
    comment: {
      lines: [ 2, 4 ],
      text: 'description text',
      rawText: '/** \n * description text \n */',
    }
  },
  {
    description: {
      summary: 'description',
      body: '',
      text: 'description',
      html: '<p>description</p>',
      summaryHtml: '<p>description</p>',
      bodyHtml: ''
    },
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
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 6,
    comment: {
      lines: [ 6, 13 ],
      text: 'description\n' +
        '@module {Type.<Type,Type(Type,Type.<Type>)>} [name={}] - description text\n' +
        '@module {Type} name description text\n' +
        '@module [name] - description text\n' +
        '@module name - description text\n' +
        '@module name',
      rawText: '/**\n' +
        ' * description\n' +
        ' * @module {Type.<Type,Type(Type,Type.<Type>)>} [name={}] - description text\n' +
        ' * @module {Type} name description text\n' +
        ' * @module [name] - description text\n' +
        ' * @module name - description text\n' +
        ' * @module name\n' +
        ' */',
    }
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
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 15,
    comment: {
      lines: [ 15, 16 ],
      text: '@extends {Type.<Type,Type(Type,Type.<Type>)>} [name={}] - description text',
      rawText: '/** @extends {Type.<Type,Type(Type,Type.<Type>)>} [name={}] - description text */',
    }
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
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 16,
    comment: {
      lines: [ 16, 16 ],
      text: '@extends {Type} name description text',
      rawText: '/** @extends {Type} name description text */',
    }
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
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 17,
    comment: {
      lines: [ 17, 17 ],
      text: '@extends [name] - description text',
      rawText: '/** @extends [name] - description text */',
    }
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
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 18,
    comment: {
      lines: [ 18, 18 ],
      text: '@extends namex - description text',
      rawText: '/** @extends namex - description text */',
    }
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
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 19,
    comment: {
      lines: [ 19, 19 ],
      text: '@extends namey',
      rawText: '/** @extends namey */',
    }
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
        tagType: 'tag',
        tagValue: '{Type.<Type,Type(Type,Type.<Type>)>} - description text',
        tagFull: '@tag {Type.<Type,Type(Type,Type.<Type>)>} - description text',
        name: '',
        nameRaw: '',
        description: '',
        html: '<p>{Type.&lt;Type,Type(Type,Type.<Type>)&gt;} - description text</p>'
      }
    ],
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 21,
    comment: {
      lines: [ 21, 22 ],
      text: '@tag {Type.<Type,Type(Type,Type.<Type>)>} - description text',
      rawText: '/** @tag {Type.<Type,Type(Type,Type.<Type>)>} - description text */',
    }
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
        tagType: 'tag',
        tagValue: '{Type} description text',
        tagFull: '@tag {Type} description text',
        name: '',
        nameRaw: '',
        description: '',
        html: '<p>{Type} description text</p>'
      }
    ],
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 22,
    comment: {
      lines: [ 22, 22 ],
      text: '@tag {Type} description text',
      rawText: '/** @tag {Type} description text */',
    }
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
        tagType: 'tag',
        tagValue: '- description text',
        tagFull: '@tag - description text',
        name: '',
        nameRaw: '',
        description: '',
        html: '<ul>\n<li>description text</li>\n</ul>'
      }
    ],
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 23,
    comment: {
      lines: [ 23, 23 ],
      text: '@tag - description text',
      rawText: '/** @tag - description text */',
    }
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
        tagType: 'tag',
        tagValue: 'description text',
        tagFull: '@tag description text',
        name: '',
        nameRaw: '',
        description: '',
        html: '<p>description text</p>'
      }
    ],
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 24,
    comment: {
      lines: [ 24, 24 ],
      text: '@tag description text',
      rawText: '/** @tag description text */',
    }
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
        tagType: 'tag',
        tagValue: '',
        tagFull: '@tag',
        name: '',
        nameRaw: '',
        description: '',
        html: ''
      }
    ],
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 25,
    comment: {
      lines: [ 25, 25 ],
      text: '@tag',
      rawText: '/** @tag */',
    }
  },
  {
    description: {
      summary: 'ignore',
      body: '',
      text: 'ignore',
      html: '<p>ignore</p>',
      summaryHtml: '<p>ignore</p>',
      bodyHtml: ''
    },
    tags: [],
    isIgnored: true,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 27,
    comment: {
      lines: [ 27, 27 ],
      text: 'ignore',
      rawText: '/! ignore */',
    }
  },
  {
    description: {
      summary: 'ignore',
      body: '',
      text: 'ignore',
      html: '<p>ignore</p>',
      summaryHtml: '<p>ignore</p>',
      bodyHtml: ''
    },
    tags: [],
    isIgnored: true,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 28,
    comment: {
      lines: [ 28, 29 ],
      text: 'ignore',
      rawText: '/!\n * ignore\n */',
    }
  },
  {
    description: {
      summary: 'ignore',
      body: '',
      text: 'ignore',
      html: '<p>ignore</p>',
      summaryHtml: '<p>ignore</p>',
      bodyHtml: ''
    },
    tags: [],
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 32,
    comment: {
      lines: [ 32, 32 ],
      text: 'ignore',
      rawText: '/ ignore */',
    }
  },
  {
    description: {
      summary: 'ignore',
      body: '',
      text: 'ignore',
      html: '<p>ignore</p>',
      summaryHtml: '<p>ignore</p>',
      bodyHtml: ''
    },
    tags: [],
    isIgnored: false,
    isPrivate: false,
    isConstructor: false,
    isClass: false,
    isEvent: false,
    line: 33,
    comment: {
      lines: [ 33, 34 ],
      text: 'ignore',
      rawText: '/\n * ignore\n */',
    }
  }
], 'comments match')
})

test.run()
