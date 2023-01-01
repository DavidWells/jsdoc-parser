/*!
 * Module dependencies.
 */
const fs = require('fs')
const path = require('path')
const typeConverter = require('./utils/convert')
const { parse, publish } = require('jsdoctypeparser')
const { getRequires, getTypeImports, getImports } = require('./utils/get-imports')
const { isBrowser } = require('./utils')

const markdown = require('markdown-it')({
  html: true,
  xhtmlOut: true,
  breaks: true,
  langPrefix: 'lang-'
})

const tagShape = {
  tagType: 'param',
  name: '[opts]',
  type: 'object',
  description: 'Cool checker options',
  text: '{object} [opts] - Cool checker options',
  // nameRaw: '[opts]',
  optional: true,
  nullable: false,
  nonNullable: false,
  variable: false,
  jsDocAst: { type: 'NAME', name: 'object' },
  typeDetails: [ 'object' ],
  descriptionHtml: '<p>Cool checker options</p>'
}

/**
 * Expose api.
 */
exports.api = require('./api');

const STAR_REGEX = /\*/gm
const TILDE_REGEX = /\~/gm
const REPLACEMENT_CHAR = '~'
// const EMPTY_OPEN = /(\/{2,})(\~)([^/\n\r]*)/gm
// const EMPTY_COMMENT_REGEX = /(\/\*{2,})(\s*)(\*+\/)/gm
const EMPTY_OPEN_COMMENT_REGEX = emptyOpenPattern('*')
const EMPTY_CLOSE_COMMENT_REGEX = emptyClosePattern('*')
const FIX_OPEN_COMMENT_REGEX = emptyOpenPattern(REPLACEMENT_CHAR)
const FIX_CLOSE_COMMENT_REGEX = emptyClosePattern(REPLACEMENT_CHAR)

/**
 * Parse comments in the given string of `js`.
 *
 * @param {String} js
 * @param {Object} options
 * @return {Array}
 * @see exports.parseComment
 * @api public
 */

function parseComments(js, options) {
  options = options || {};
  js = js.replace(/\r\n/gm, '\n')
  // Remove trick comment blocks
  // https://regex101.com/r/umfleB/1
  // .replace(EMPTY_OPEN_COMMENT_REGEX, `$1${REPLACEMENT_CHAR}$3`)
  // .replace(/\/\*\*(\s*)\*\//g, 'XX$1XX');
  
  const fixed = findAndFix({
    text: js,
    openPattern: EMPTY_OPEN_COMMENT_REGEX,
    closePattern: EMPTY_CLOSE_COMMENT_REGEX, 
    replacePattern: STAR_REGEX, 
    replacementChar: REPLACEMENT_CHAR
  })
  // console.log('fixed', fixed)
  js = fixed

  let ref = {
    text: js,
    addTags: []
  }

  var comments = [],
    skipSingleStar = options.skipSingleStar,
    comment,
    buf = '',
    ignore,
    withinMultiline = false,
    withinSingle = false,
    withinString = false,
    code,
    linterPrefixes = options.skipPrefixes || ['jslint', 'jshint', 'eshint'],
    // skipPattern = new RegExp('^' + (options.raw ? '' : '<p>') + '('+ linterPrefixes.join('|') + ')'),
    skipPattern = new RegExp('^' + '('+ linterPrefixes.join('|') + ')'),
    lineNum = 1,
    lineNumStarting = 1,
    parentContext,
    withinEscapeChar,
    currentStringQuoteChar;


  for (var i = 0, len = js.length; i < len; ++i) {
    withinEscapeChar = withinString && !withinEscapeChar && js[i - 1] == '\\';

    // start comment
    if (!withinMultiline && !withinSingle && !withinString &&
        '/' == js[i] && '*' == js[i+1] && (!skipSingleStar || js[i+2] == '*')) {
      lineNumStarting = lineNum;
      // code following the last comment
      if (buf.trim().length) {
        comment = comments[comments.length - 1];
        if (comment) {
          // Adjust codeStart for any vertical space between comment and code
          comment.codeStart += buf.match(/^(\s*)/)[0].split('\n').length - 1;
          comment.code = code = exports.trimIndentation(buf).trim();
          comment.ctx = exports.parseCodeContext(code, parentContext);

          if (comment.isConstructor && comment.ctx){
            comment.ctx.type = "constructor"
          }

          // starting a new namespace
          if (comment.ctx && (comment.ctx.type === 'prototype' || comment.ctx.type === 'class')){
            parentContext = comment.ctx;
          }
          // reasons to clear the namespace
          // new property/method in a different constructor
          else if (!parentContext || !comment.ctx || !comment.ctx.constructor || !parentContext.constructor || parentContext.constructor !== comment.ctx.constructor){
            parentContext = null;
          }
        }
        buf = '';
      }
      i += 2;
      withinMultiline = true;
      ignore = '!' == js[i];
      // console.log('ignore', ignore)

      // if the current character isn't whitespace and isn't an ignored comment,
      // back up one character so we don't clip the contents
      if (' ' !== js[i] && '\n' !== js[i] && '\t' !== js[i] && '!' !== js[i]) i--;

    // end comment
    } else if (withinMultiline && !withinSingle && '*' == js[i] && '/' == js[i+1]) {
      i += 2;
      buf = buf.replace(/^[ \t]*\* ?/gm, '');
      comment = exports.parseComment(buf, options, js, ref);
      comment.ignore = ignore;
      comment.line = lineNumStarting;
      comment.codeStart = lineNum + 1;
      if (!comment.description.text.match(skipPattern)) {
        comments.push(comment);
      }
      withinMultiline = ignore = false;
      buf = '';
    } else if (!withinSingle && !withinMultiline && !withinString && '/' == js[i] && '/' == js[i+1]) {
      withinSingle = true;
      buf += js[i];
    } else if (withinSingle && !withinMultiline && '\n' == js[i]) {
      withinSingle = false;
      buf += js[i];
    } else if (!withinSingle && !withinMultiline && !withinEscapeChar && ('\'' == js[i] || '"' == js[i] || '`' == js[i])) {
      if(withinString) {
        if(js[i] == currentStringQuoteChar) {
          withinString = false;
        }
      } else {
        withinString = true;
        currentStringQuoteChar = js[i];
      }

      buf += js[i];
    } else {
      buf += js[i];
    }

    if('\n' == js[i]) {
      lineNum++;
    }

  }

  if (comments.length === 0) {
    comments.push({
      tags: [],
      description: {text: '', summary: '', body: ''},
      isPrivate: false,
      isConstructor: false,
      line: lineNumStarting
    });
  }

  // trailing code
  if (buf.trim().length) {
    comment = comments[comments.length - 1]
    // Adjust codeStart for any vertical space between comment and code
    comment.codeStart += buf.match(/^(\s*)/)[0].split('\n').length - 1
    comment.code = code = exports.trimIndentation(buf).trim()
    comment.ctx = exports.parseCodeContext(code, parentContext)
  }

  // Fix removed comment blocks
  if (comment.code) {
    const fixedCode = findAndFix({
      text: comment.code,
      openPattern: FIX_OPEN_COMMENT_REGEX,
      closePattern: FIX_CLOSE_COMMENT_REGEX, 
      replacePattern: TILDE_REGEX,
      replacementChar: '*'
    })
    comment.code = fixedCode
    // console.log('fixedCode', fixedCode)
  }

  if (ref.nested) {
    return ref.nested
  }

  // Has imported types, replace them.
  // if (ref.addTags && ref.addTags.length) {
  //   console.log('ref.addTags', ref.addTags)
  //   return comments.map((comment) => {
  //     return comment.tags.map((tag) => {
  //       if (tag.isImportedType) {
  //         // tag.typesDescription
  //         return { 
  //           ...tag, 
  //           LOLOLO: true 
  //         }
  //       }
  //       return tag
  //     })
  //   })
  // }

  let allComments = comments
    /* Remove empty comments */
    .filter((comment) => {
      return comment.tags.length || comment.description.text
    })

  if (options.excludeIgnored) {
    /* Remove empty comments */
    allComments = allComments.filter((comment) => {
      return !comment.ignore
    })
  }

  // console.log('ref', ref.addTags)
  return allComments
}

exports.parseComments = parseComments

/**
 * Removes excess indentation from string of code.
 *
 * @param {String} str
 * @return {String}
 * @api public
 */
exports.trimIndentation = function (str) {
  // Find indentation from first line of code.
  var indent = str.match(/(?:^|\n)([ \t]*)[^\s]/);
  if (indent) {
    // Replace indentation on all lines.
    str = str.replace(new RegExp('(^|\n)' + indent[1], 'g'), '$1');
  }
  return str;
};

/**
 * Parse the given comment `str`.
 *
 * The comment object returned contains the following
 *
 *  - `tags`  array of tag objects
 *  - `description` the first line of the comment
 *  - `body` lines following the description
 *  - `content` both the description and the body
 *  - `isPrivate` true when "@api private" is used
 *
 * @param {String} str
 * @param {Object} options
 * @return {Object}
 * @see exports.parseTag
 * @api public
 */
exports.parseComment = function(str, options, allText, ref) {
  str = str.trim();
  // console.log('parseComment string', str)
  // console.log('ref', ref)
  options = options || {};

  var comment = { tags: [] },
    raw = options.raw,
    description = {},
    tags = str.split(/\n\s*@/)

  // console.log('tags', tags)
  // A comment has no description
  if (tags[0].charAt(0) === '@') {
    tags.unshift('')
  }

  // parse comment body
  const tagText = tags[0]
  description.summary = tagText.split('\n\n')[0];
  description.body = tagText.split('\n\n').slice(1).join('\n\n');
  description.text = tagText
  // description.full = tagText;

  // console.log('description', description)

  comment.description = description;

  // parse tags
  if (tags.length) {
    comment.tags = tags.slice(1).map((t) => {
      return exports.parseTag(t, allText, comment.description, ref)
    });
    comment.isPrivate = comment.tags.some(function(tag){
      return 'private' == tag.visibility;
    });
    comment.isConstructor = comment.tags.some(function(tag){
      return 'constructor' == tag.type || 'augments' == tag.type;
    });
    comment.isClass = comment.tags.some(function(tag){
      return 'class' == tag.type;
    });
    comment.isEvent = comment.tags.some(function(tag){
      return 'event' == tag.type;
    });

    if (!description.text || !description.text.trim()) {
      comment.tags.some(function(tag){
        if ('description' == tag.type) {
          description.text = tag.text;
          description.summary = tag.summary;
          description.body = tag.body;
          return true;
        }
      });
    }
  }

  // markdown
  if (!raw) {
    description.html = markdown.render(description.text).trim();
    description.summaryHtml = markdown.render(description.summary).trim();
    description.bodyHtml = markdown.render(description.body).trim();
  
    comment.tags.forEach(function (tag) {
      if (tag.description) {
        const desc = tag.description.replace(/^\s*-\s*/, '').trim()
        // tag.descriptionRaw = desc;
        tag.description = desc;
        tag.descriptionHtml = markdown.render(desc).trim();
      } else {
        /* Wrap examples in pre tags */
        if (tag.type === 'example') {
          const hasNewLines = tag.text.match(/\n|\r/)
          if (hasNewLines) {
            tag.html = `<pre><code>\n${tag.text}\n</code></pre>`
          } else {
            tag.html = `<pre><code>${tag.text}</code></pre>`
          }
        } else {
          tag.html = markdown.render(tag.text).trim();
        }
      }
    });
  }

  return comment;
};

/**
 * Extracts different parts of a tag by splitting string into pieces separated by whitespace. If the white spaces are
 * somewhere between curly braces (which is used to indicate param/return type in JSDoc) they will not be used to split
 * the string. This allows to specify jsdoc tags without the need to eliminate all white spaces i.e. {number | string}
 *
 * @param str The tag line as a string that needs to be split into parts
 * @returns {Array.<string>} An array of strings containing the parts
 */
exports.extractTagParts = function(str) {
  var level = 0,
    extract = '',
    split = [];

  str.split('').forEach(function(c) {
    if(c.match(/\s/) && level === 0) {
      split.push(extract);
      extract = '';
    } else {
      if(c === '{') {
        level++;
      } else if (c === '}') {
        level--;
      }

      extract += c;
    }
  });

  split.push(extract);
  return split.filter(function(str) {
    return str.length > 0;
  });
};


/**
 * Parse tag string "@param {Array} name description" etc.
 *
 * @param {String}
 * @return {Object}
 * @api public
 */
exports.parseTag = function(str, allText, desc, ref) {
  var tag = {}
    lines = str.split('\n'),
    parts = exports.extractTagParts(lines[0]),
    type = tag.type = parts.shift().replace('@', ''),
    matchType = new RegExp('^@?' + type + ' *'),
    matchTypeStr = /^\{.+\}$/;


  // Set description for typedef
  if (desc && desc.summary && !tag.description && tag.type === 'typedef') {
    tag.description = desc.summary
  }

  if (lines.length > 1) {
    parts.push(lines.slice(1).join('\n'));
  }


  tag.name = ''
  tag.description = ''
  tag.text = ''

  switch (type) {
    case 'property':
    case 'prop':
    case 'template':
    case 'param':
      var typeString = matchTypeStr.test(parts[0]) ? parts.shift() : "";
      const name = parts.shift() || ''
      tag.name = name;
      tag.description = parts.join(' ');
      
      const nameParts = name.match(/\[([a-zA-Z0-9_]*)=(.*)\]/)
      /* Set default values */
      if (nameParts) {
        tag.nameKey = nameParts[1]
        tag.defaultValue = nameParts[2].replace(/^['"]|['"]$/g, '')
      }
      tag.nameRaw = name;
      // console.log('typeString', str)
      exports.parseTagTypes(typeString, tag, allText, ref);
      break;
    case 'define':
    case 'return':
    case 'returns':
      var typeString = matchTypeStr.test(parts[0]) ? parts.shift() : "";
      exports.parseTagTypes(typeString, tag, allText, ref);
      tag.description = parts.join(' ');
      if (!tag.name) {
        delete tag.name
      }
      break;
    case 'see':
      if (~str.indexOf('http')) {
        tag.title = parts.length > 1
          ? parts.shift()
          : '';
        tag.url = parts.join(' ');
      } else {
        tag.local = parts.join(' ');
      }
      break;
    case 'api':
      tag.visibility = parts.shift();
      break;
    case 'public':
    case 'private':
    case 'protected':
      tag.visibility = type;
      break;
    case 'enum':
    case 'typedef':
    case 'type':
      if (type === 'typedef' && parts && parts[1]) {
        tag.name = parts[1]
        if (desc) {
          tag.description = desc.summary || desc.text || '';
        }
      }
      exports.parseTagTypes(parts.shift(), tag, allText, ref);
      break;
    case 'lends':
    case 'memberOf':
      tag.parent = parts.shift();
      break;
    case 'extends':
    case 'implements':
    case 'augments':
      tag.otherClass = parts.shift();
      break;
    case 'borrows':
      tag.otherMemberName = parts.join(' ').split(' as ')[0];
      tag.thisMemberName = parts.join(' ').split(' as ')[1];
      break;
    case 'throws':
      var typeString = matchTypeStr.test(parts[0]) ? parts.shift() : "";
      tag.types = exports.parseTagTypes(typeString, null, allText, ref);
      tag.description = parts.join(' ');
      break;
    case 'description':
      tag.text = parts.join(' ').trim()
      tag.summary = tag.text.split('\n\n')[0]
      tag.body = tag.text.split('\n\n').slice(1).join('\n\n')
      break;
    default:
      const stringDetails = parts.join(' ').replace(/\s+$/, '')
      const indent = findMinIndent(stringDetails)
      tag.text = stripIndent(stringDetails, indent)
      break;
  }

  if (!tag.text) {
    tag.text = str.replace(matchType, '') 
  }

  // if (!tag.description) {
  //   delete tag.description
  // }

  return tag;
}

function findMinIndent(string) {
	const match = string.match(/^[ \t]*(?=\S)/gm)
	if (!match) return 0
	return match.reduce((r, a) => Math.min(r, a.length), Infinity)
}

function stripIndent(string, indentation) {
  const indent = typeof indentation !== 'undefined' ? indentation : findMinIndent(string);
	if (indent === 0) {
		return string
	}
	const regex = new RegExp(`^[ \\t]{${indent}}`, 'gm')
	return string.replace(regex, '')
}

function getTypeImportData(tImport, tag) {
  const paths = getPossiblePaths(tImport.importPath)
  /*
  console.log('tImport', tImport)
  console.log('paths', paths)
  /** */
  let filePath
  let importContents
  let typeMap
  let extraTypes
  let parsedTypes
  const exists = paths.some((p) => {
    if (fs.existsSync(p)) {
      filePath = p
      return true
    }
    return false
  })

  if (!exists && tImport.isModule) {
    // TODO resolve (module:path/to/file.js).foo defs
    return []
  }

  if (!exists) {
    // console.log(`Unable to find ${tImport.importPath}`)
    throw new Error(`Unable to find ${tImport.importPath} in ${tag.text}. Please double check this import` )
  }
  
  // console.log('paths', paths)
  // console.log('exists', exists)

  if (exists) {
    importContents = fs.readFileSync(filePath, 'utf-8')
    if (importContents) {
      // console.log('importContents', importContents)
      const typeData = typeConverter(importContents)
      extraTypes = typeData.jsdoc
      typeMap = typeData.typeMap
      /*
      console.log('typeConverter result: ')
      console.log(extraTypes)
      console.log('─────────────')
      /** */

      const parsedNested = parseComments(extraTypes)
      parsedTypes = (parsedNested.find((data) => {
        // console.log('deeper types data', data)
        return data.tags.find((t) => {
          return t.name === tImport.importName
        })
      }) || {}).tags.filter((tag) => {
        return tag.type !== 'example'
      })
    }
  }

  let typer 
  if (parsedTypes && parsedTypes.length && parsedTypes[0] && parsedTypes[0].type === 'typedef') {
    typer = parsedTypes[0].typesDescription
  }

  const typeName = tImport.importName
  const typeCodeDetails = typeMap[typeName]
  const location = getCodeLocation(filePath, getLineFromPos(importContents, typeCodeDetails.start))

  const typeDetails = {
    name: typeName,
    type: typer,
    filePath,
    location,
    ...typeCodeDetails,
    // extraTypes,
    tags: parsedTypes || [],
    // importContents
  }


  return [typeDetails, typeMap, location]
}

/**
 * Parse tag type string "{Array|Object}" etc.
 * This function also supports complex type descriptors like in jsDoc or even the enhanced syntax used by the
 * [google closure compiler](https://developers.google.com/closure/compiler/docs/js-for-compiler#types)
 *
 * The resulting array from the type descriptor `{number|string|{name:string,age:number|date}}` would look like this:
 *
 *     [
 *       'number',
 *       'string',
 *       {
 *         age: ['number', 'date'],
 *         name: ['string']
 *       }
 *     ]
 *
 * @param {String} str
 * @return {Array}
 * @api public
 */
exports.parseTagTypes = function(str, tag, allText, ref) {
  if (!str) {
    if (tag) {
      tag.optional = false
      tag.types = [];
      tag.typesDescription = "";
      tag.nullable = tag.nonNullable = tag.variable = false;
    }
    return [];
  }
  var strToParse = str
  if (str.startsWith('{')) {
    strToParse = str.substr(1, str.length - 2)
  }
  var result = parse(strToParse)
  let optional = false
  let isImportedType = false
  var types = (function transform(item) {
    // console.log('tag', tag)
    // console.log('refzzzz', ref)
    if (item.type === 'NULLABLE') {
      return [item.value.name];
    }

    // if (item.type instanceof Builder.TypeUnion) {
    if (item.type === 'UNION') {
      const leftValue = item.left
      let rightValue = item.right
      if (item.right.type === 'OPTIONAL') {
        optional = true
        rightValue = item.right.value
      }

      return [leftValue].concat(rightValue).map(transform).flat();
    } else if (item.type === 'NAME') {
    // } else if (item instanceof Builder.TypeName) {
      return [item.name];
    // } else if (item instanceof Builder.RecordType) {
    } else if (item.type === 'RECORD') {
      return [item.entries.reduce(function(obj, entry) {
        // console.log('entry', entry)
        obj[entry.key] = transform(entry);
        return obj;
      }, {})];
    } else {
      // return item.toString();
      // console.log('typez', item)
      if (item.type === 'GENERIC') {
        if (item.subject && item.subject.name === 'Array' && item.objects && item.objects.length === 1) {
          // console.log(item)
          return [ `Array<${item.objects[0].name}>` ]
        }
      }

      if (!item.value) {
        // Typescript or module import
        if (item.owner) {
          if (item.owner.type === 'IMPORT' || (item.owner.value && item.owner.value.type === 'MODULE')) {
            isImportedType = true
          }
          // if (item.owner.type === 'IMPORT') {
          //   console.log('Import file', item.owner.path.text)
          // }
        }
        if (item.name) {
          let xyz = item.name
          try {
            xyz = publish(item)
          } catch (e) {

          }
          // console.log('XYZ', xyz)
          const newFeature = false
          if (newFeature) {
            // Attempt to resolve imported types
            if (!isBrowser) {
              const reqs = getRequires(ref.text)
              const imports = getImports(ref.text)
              const typeImports = getTypeImports(ref.text)

              //*
              console.log('reqs', reqs)
              console.log('imports', imports)
              console.log('typeImports', typeImports)
              /** */

              // const hasImportedTypes = xyz.match(IMPORT_TYPE_REGEX)
              // console.log('hasImportedTypes', hasImportedTypes)
              if (typeImports && typeImports.length) {
                const importFiles = typeImports.map((tImport) => {
                  const importInfo = getTypeImportData(tImport, tag)
                  // console.log('tImport', tImport)
                  // console.log('importInfo', importInfo)
                  return {
                    ...tImport,
                    ...importInfo,
                  }
                })

                console.log('imported data', importFiles)

                const addTags = importFiles.map((x) => x.tags)

                const things = ref.addTags.concat(addTags)

                const filteredArr = things.reduce((thing, current) => {
                  const x = thing.find(item => item.codeStart === current.codeStart)
                  if (!x) {
                    return thing.concat([current]);
                  } else {
                    return thing
                  }
                }, [])

                ref.addTags = filteredArr.map((t, i) => {
                  return {
                    ...t,
                    importStatement: importFiles[i].importStatement
                  }
                })

                // const lol = parseComments(zzz).reduce((acc, curr) => {
                //   if (curr.tags && curr.tags.length) {
                //     console.log('curr.tags', curr.tags)
                //     const matching = curr.tags.find((tag) => {
                //       return tag.name === tImport.importName
                //     })
                //     if(matching) {
                //       return matching
                //     }
                //   }
                //   return acc
                // }, {})
                // console.log('lol', lol)

                // const basePath = path.resolve(process.cwd(), typeImports[0].importPath)
                /*
                const possiblePaths = getPossiblePaths(typeImports[0].importPath)
                console.log('read this file', possiblePaths)
                const contents = fs.readFileSync(possiblePaths[1], 'utf-8')
                const extraTypes = typeConverter(contents)
                console.log('extraTypes', extraTypes)
                console.log('allText', ref.text)
                // const cleanType = xyz.replace(/^import\(['"](.*)['"]\)\.?/, '')
                const cleanType = xyz.replace(typeImports[0].importStatement, typeImports[0].importName)

                const replaceType = ref.text.replace(xyz, cleanType)
                console.log('replaceType', replaceType)
                const newContents = `${extraTypes}\n${replaceType}`
                console.log('newContents', newContents)

                ref.text = newContents
                
                const allData = parseComments(newContents)

                // Update top level output data. TODO refactor to recursive
                ref.nested = allData
            
                console.log('allData', allData)
                //console.log('qqq', parseComments(newContents)[0].tags[0])
                */
              }
            }
          }
      
          return [ xyz ]
        }
        // console.log('import item', item.type)
        return [ item.type ]
      }

      if (!item.value.name) {
        return transform(item.value);
      }
      // if (item.value.type === 'RECORD') {
      //   return transform(item.value);
      // }
      // if (item.value.type === 'RECORD') {
      //   return transform(item.value);
      // }

      return [item.value.name.toString()]
    }
  }(result));
  // console.log('result', result)
  if (tag) {
    const description = publish(result)
    if (tag.type === 'typedef') {

    }

    if (types && types.includes('GENERIC')) {

    }

    tag.optional = (tag.name && tag.name.slice(0,1) === '[') || result.optional || optional
    tag.types = types;
    // tag.typesDescription = (result && result.toHtml) ? result.toHtml() : result;
    // tag.typesDescriptionHtml = `<code>${description}</code>`
    tag.typesDescription = description
    tag.nullable = result.nullable || result.type === 'NULLABLE'
    tag.nonNullable = result.nonNullable || result.type === 'NOT_NULLABLE'
    tag.variable = result.variable || result.type === 'VARIADIC'
    // tag.isImportedType = isImportedType
    if (isImportedType) {
      // console.log('description', description)
      const typeImports = getTypeImports(description)[0]
      // console.log('typeImports', typeImports)
      const [ typeData ] = getTypeImportData(typeImports, tag)
      if (typeData) {
        tag.importedType = typeData
      }
    }
    if (description.match(/\[\]$/)) {
      tag.isArray = true
    }
    tag.jsDocAst = (result && result.toHtml) ? result.toHtml() : result
  }

  return types
}

function getLineFromPos(str, pos) {
  if (pos === 0) {
      return 1;
  }
  //adjust for negative pos
  if (pos < 0) {
      pos = str.length + pos;
  }
  var lines = str.substr(0, pos).match(/[\n\r]/g);
  return lines ? lines.length + 1 : 1;
};

function getCodeLocation(srcPath, line, column = '0') {
  return `${srcPath}:${line}:${column}`
}

function getLineNumberFromMatch(text = '', index) {
  return getLineCount(text.substr(0, index))
}

function getLines(str = '') {
  return str.split(/\r\n|\r|\n/)
}

function getLineCount(str = '') {
  return getLines(str).length
}

/**
 * Determine if a parameter is optional.
 *
 * Examples:
 * JSDoc: {Type} [name]
 * Google: {Type=} name
 * TypeScript: {Type?} name
 *
 * @param {Object} tag
 * @return {Boolean}
 * @api public
 */

exports.parseParamOptional = function(tag) {
  var lastTypeChar = tag.types.slice(-1)[0].slice(-1);
  return tag.name.slice(0,1) === '[' || lastTypeChar === '=' || lastTypeChar === '?';
};

/**
 * Parse the context from the given `str` of js.
 *
 * This method attempts to discover the context
 * for the comment based on it's code. Currently
 * supports:
 *
 *   - classes
 *   - class constructors
 *   - class methods
 *   - function statements
 *   - function expressions
 *   - prototype methods
 *   - prototype properties
 *   - methods
 *   - properties
 *   - declarations
 *
 * @param {String} str
 * @param {Object=} parentContext An indication if we are already in something. Like a namespace or an inline declaration.
 * @return {Object}
 * @api public
 */

exports.parseCodeContext = function(str, parentContext) {
  parentContext = parentContext || {};

  var ctx;

  // loop through all context matchers, returning the first successful match
  return exports.contextPatternMatchers.some(function (matcher) {
    return ctx = matcher(str, parentContext);
  }) && ctx;
};

exports.contextPatternMatchers = [

  function (str) {
    // class, possibly exported by name or as a default
    if (/^\s*(export(\s+default)?\s+)?class\s+([\w$]+)(\s+extends\s+([\w$.]+(?:\(.*\))?))?\s*{/.exec(str)) {
      return {
        type: 'class',
        constructor: RegExp.$3,
        cons: RegExp.$3,
        name: RegExp.$3,
        extends: RegExp.$5,
        text: 'new ' + RegExp.$3 + '()',
      };
    }
  },

  function (str, parentContext) {
    // class constructor
    if (/^\s*constructor\s*\(/.exec(str)) {
      return {
        type: 'constructor'
        , constructor: parentContext.name
        , cons: parentContext.name
        , name: 'constructor'
        , text: (parentContext && parentContext.name && parentContext.name + '.prototype.' || '') + 'constructor()'
      };
    // class method
    }
  },

  function (str, parentContext) {
    if (/^\s*(static)?\s*(\*)?\s*([\w$]+|\[.*\])\s*\(/.exec(str)) {
      return {
        type: 'method'
        , constructor: parentContext.name
        , cons: parentContext.name
        , name: RegExp.$2 + RegExp.$3
        , text: (parentContext && parentContext.name && parentContext.name + (RegExp.$1 ? '.' : '.prototype.') || '') + RegExp.$2 + RegExp.$3 + '()'
      };
    // named function statement, possibly exported by name or as a default
    }
  },

  function (str) {
    if (/^\s*(export(\s+default)?\s+)?function\s+([\w$]+)\s*\(/.exec(str)) {
      return {
          type: 'function'
        , name: RegExp.$3
        , text: RegExp.$3 + '()'
      };
    }
  },

  function (str) {
    // anonymous function expression exported as a default
    if (/^\s*export\s+default\s+function\s*\(/.exec(str)) {
      return {
          type: 'function'
        , name: RegExp.$1 // undefined
        , text: RegExp.$1 + '()'
      };
    }
  },

  function (str) {
    // function expression
    if (/^return\s+function(?:\s+([\w$]+))?\s*\(/.exec(str)) {
      return {
          type: 'function'
        , name: RegExp.$1
        , text: RegExp.$1 + '()'
      };
    }
  },

  function (str) {
    // function expression
    if (/^\s*(?:const|let|var)\s+([\w$]+)\s*=\s*function/.exec(str)) {
      return {
          type: 'function'
        , name: RegExp.$1
        , text: RegExp.$1 + '()'
      };
    }
  },

  function (str, parentContext) {
    // prototype method
    if (/^\s*([\w$.]+)\s*\.\s*prototype\s*\.\s*([\w$]+)\s*=\s*function/.exec(str)) {
      return {
          type: 'method'
        , constructor: RegExp.$1
        , cons: RegExp.$1
        , name: RegExp.$2
        , text: RegExp.$1 + '.prototype.' + RegExp.$2 + '()'
      };
    }
  },

  function (str) {
    // prototype property
    if (/^\s*([\w$.]+)\s*\.\s*prototype\s*\.\s*([\w$]+)\s*=\s*([^\n;]+)/.exec(str)) {
      return {
          type: 'property'
        , constructor: RegExp.$1
        , cons: RegExp.$1
        , name: RegExp.$2
        , value: RegExp.$3.trim()
        , text: RegExp.$1 + '.prototype.' + RegExp.$2
      };
    }
  },

  function (str) {
    // prototype property without assignment
    if (/^\s*([\w$]+)\s*\.\s*prototype\s*\.\s*([\w$]+)\s*/.exec(str)) {
      return {
          type: 'property'
        , constructor: RegExp.$1
        , cons: RegExp.$1
        , name: RegExp.$2
        , text: RegExp.$1 + '.prototype.' + RegExp.$2
      };
    }
  },

  function (str) {
    // inline prototype
    if (/^\s*([\w$.]+)\s*\.\s*prototype\s*=\s*{/.exec(str)) {
      return {
        type: 'prototype'
        , constructor: RegExp.$1
        , cons: RegExp.$1
        , name: RegExp.$1
        , text: RegExp.$1 + '.prototype'
      };
    }
  },

  function (str, parentContext) {
    // inline method
    if (/^\s*([\w$.]+)\s*:\s*function/.exec(str)) {
      return {
        type: 'method'
        , constructor: parentContext.name
        , cons: parentContext.name
        , name: RegExp.$1
        , text: (parentContext && parentContext.name && parentContext.name + '.prototype.' || '') + RegExp.$1 + '()'
      };
    }
  },

  function (str, parentContext) {
    // inline property
    if (/^\s*([\w$.]+)\s*:\s*([^\n;]+)/.exec(str)) {
      return {
        type: 'property'
        , constructor: parentContext.name
        , cons: parentContext.name
        , name: RegExp.$1
        , value: RegExp.$2.trim()
        , text: (parentContext && parentContext.name && parentContext.name + '.' || '') + RegExp.$1
      };
    }
  },

  function (str, parentContext) {
    // inline getter/setter
    if (/^\s*(get|set)\s*([\w$.]+)\s*\(/.exec(str)) {
      return {
        type: 'property'
        , constructor: parentContext.name
        , cons: parentContext.name
        , name: RegExp.$2
        , text: (parentContext && parentContext.name && parentContext.name + '.prototype.' || '') + RegExp.$2
      };
    }
  },

  function (str) {
    // method
    if (/^\s*([\w$.]+)\s*\.\s*([\w$]+)\s*=\s*function/.exec(str)) {
      return {
          type: 'method'
        , receiver: RegExp.$1
        , name: RegExp.$2
        , text: RegExp.$1 + '.' + RegExp.$2 + '()'
      };
    }
  },

  function (str) {
    // property
    if (/^\s*([\w$.]+)\s*\.\s*([\w$]+)\s*=\s*([^\n;]+)/.exec(str)) {
      return {
          type: 'property'
        , receiver: RegExp.$1
        , name: RegExp.$2
        , value: RegExp.$3.trim()
        , text: RegExp.$1 + '.' + RegExp.$2
      };
    }
  },

  function (str) {
    // declaration
    if (/^\s*(?:const|let|var)\s+([\w$]+)\s*=\s*([^\n;]+)/.exec(str)) {
      return {
          type: 'declaration'
        , name: RegExp.$1
        , value: RegExp.$2.trim()
        , text: RegExp.$1
      };
    }
  }
];

function emptyOpenPattern(char) {
  return new RegExp(`(\/{2,})(\\${char})([^/\n\r]*)`, 'gm')
}

function emptyClosePattern(char) {
  return new RegExp(`(\/\\${char}{2,})(\\s*)(\\${char}+\/)`, 'gm')
}

function findComments(str, pattern) {
  let matches
  let foundItems = []
  while ((matches = pattern.exec(str)) !== null) {
    if (matches.index === pattern.lastIndex) {
      pattern.lastIndex++ // avoid infinite loops with zero-width matches
    }
    const [ comment, start, content, end ] = matches
    foundItems.push({
      comment,
      start,
      content,
      end
    })
  }
  return foundItems
}

function findAndFix({ text, openPattern, closePattern, replacePattern, replacementChar }) {
  const hasEmptyComments = findComments(text, closePattern)
  const newText = text.replace(openPattern, `$1${replacementChar}$3`)
  if (!hasEmptyComments || !hasEmptyComments.length) {
    return newText
  }
  const fixedEmptyComments = hasEmptyComments.reduce((acc, curr) => {
    const { comment, start, content, end } = curr
    acc = acc.replace(comment, `${start.replace(replacePattern, replacementChar) + content + end.replace(replacePattern, replacementChar)}`)
    return acc
  }, newText)
  return fixedEmptyComments
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function getPossiblePaths(importPath, cwd) {
  const parentDir = path.dirname(importPath)
  const baseName = path.basename(importPath).replace(/\.[^/.]+$/, "")
  const basePath = path.resolve(cwd || process.cwd(), path.join(parentDir, baseName))
  const pathProvided = path.resolve(cwd || process.cwd(), importPath)
  return [
    pathProvided,
    `${basePath}.ts`,
    `${basePath}.d.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
  ].filter(onlyUnique)
}