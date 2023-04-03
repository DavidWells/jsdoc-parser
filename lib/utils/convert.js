/**
 * Convert Typescript types to jsdoc
 */
const path = require('path')
const ts = require('typescript')

const appendComment = (commentBlock, toAppend) => {
  const newText = toAppend.split('\n').map(line => `\n * ${line}`)
  // console.log('newText', newText)
  return commentBlock.replace(/[\n,\s]*\*\//, newText + '\n */')
}

/**
 * Get type from a node
 * @param {ts.TypeNode} type which should be parsed to string
 * @param {string} src      source for an entire parsed file
 * @returns {string}    node type
 */
const getTypeName = (type, src) => {
  // console.log('type', type)
  // console.log('src', src)
  if (type.typeName && type.typeName.escapedText) {
    const typeName = type.typeName.escapedText
    if(type.typeArguments && type.typeArguments.length) {
      const args = type.typeArguments.map(subType => getTypeName(subType, src)).join(', ')
      return `${typeName}<${args}>`
    } else {
      return typeName
    }
  }
  if (ts.isFunctionTypeNode(type) || ts.isFunctionLike(type)) {
    // it replaces ():void => {} (and other) to simple function
    return 'function'
  }
  if (ts.isArrayTypeNode(type)) {
    return 'Array'
  }
  if (type.types) {
    return type.types.map(subType => getTypeName(subType, src)).join(' | ')
  }
  if (type.members && type.members.length) {
    return 'object'
  }
  return src.substring(type.pos, type.end).trim()
}

/**
 * Fetches name from a node.
 */
const getName = (node, src) => {
  let name = node.name && node.name.escapedText
  || node.parameters && src.substring(node.parameters.pos, node.parameters.end)
  
  // changing type [key: string] to {...} - otherwise it wont be parsed by @jsdoc
  if (name === 'key: string') { return '{...}' }
  return name
}

/**
 * converts function parameters to @params
 *
 * @param {string} [jsDoc]  existing jsdoc text where all @param comments should be appended
 * @param {ts.FunctionDeclaration} wrapper ts node which has to be parsed
 * @param {string} src      source for an entire parsed file (we are fetching substrings from it)
 * @param {string} parentName     name of a parent element - NOT IMPLEMENTED YET
 * @returns {string} modified jsDoc comment with appended @param tags
 * 
 */
const convertParams = (jsDoc = '', node, src, parentName = null) => {
  node.type.parameters.forEach(parameter => {
    let name = getName(parameter, src)
    let comment = parameter.jsDoc && parameter.jsDoc[0] && parameter.jsDoc[0].comment || ''
    if (parameter.questionToken) {
      name = ['[', name, ']'].join('')
    }
    let type = getTypeName(parameter.type, src)
    jsDoc = appendComment(jsDoc, `@param {${type}} ${name}   ${comment}`)
  })
  return jsDoc
}

/**
 * Convert type properties to @property
 * @param {string} [jsDoc]  existing jsdoc text where all @param comments should be appended
 * @param {ts.TypeNode} wrapper ts node which has to be parsed
 * @param {string} src      source for an entire parsed file (we are fetching substrings from it)
 * @param {string} parentName     name of a parent element
 * @returns {string} modified jsDoc comment with appended @param tags
 */
let convertMembers = (jsDoc = '', type, src, parentName = null) => {
  // type could be an array of types like: `{sth: 1} | string` - so we parse
  // each type separately
  const typesToCheck = [type]
  if (type.types && type.types.length) {
    typesToCheck.push(...type.types)
  }
  typesToCheck.forEach(type => {
    // Handling array defined like this: {alement1: 'something'}[]
    if(ts.isArrayTypeNode(type) && type.elementType) {
      jsDoc = convertMembers(jsDoc, type.elementType, src, parentName ? parentName + '[]' : '[]')
    }

    // Handling Array<{element1: 'somethin'}>
    if (type.typeName && type.typeName.escapedText === 'Array') {
      if(type.typeArguments && type.typeArguments.length) {
        type.typeArguments.forEach(subType => {

          jsDoc = convertMembers(jsDoc, subType, src, parentName
            ? parentName + '[]'
            : '' // when there is no parent - jsdoc cannot parse [].name
          )
        })
      }
    }
    // Handling {property1: "value"}
    (type.members || []).filter(m => ts.isTypeElement(m)).forEach(member => {
      let name = getName(member, src)
      let comment = member.jsDoc && member.jsDoc[0] && member.jsDoc[0].comment || ''
      const members = member.type.members || []
      let typeName = members.length ? 'object' : getTypeName(member.type, src)
      if (parentName) {
        name = [parentName, name].join('.')
      }
      // optional
      const nameToPlace = member.questionToken ? `[${name}]` : name
      jsDoc = appendComment(jsDoc, `@property {${typeName}} ${nameToPlace}   ${comment}`)
      jsDoc = convertMembers(jsDoc, member.type, src, name)
    })
  })
  return jsDoc
}


function isPrimative(kindOfType) {
  return kindOfType === 'string' || kindOfType === 'number' || kindOfType === 'boolean'
}


/**
 * Prints out particular nodes from a source file
 * 
 * @param file a path to a file
 * @param identifiers top level identifiers available
 */
 function extractTypeSource(sourceFile, identifiers, src) {
  // Create a Program to represent the project, then pull out the
  // source file to parse its AST.
  // let program = ts.createProgram([file], { allowJs: true });
  // const sourceFile = program.getSourceFile(file);
  
  // To print the AST, we'll use TypeScript's printer
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  // To give constructive error messages, keep track of found and un-found identifiers
  const unfoundNodes = [], foundNodes = [];

  // Loop through the root AST nodes of the file
  ts.forEachChild(sourceFile, (node) => {
    // let name = "";
    // console.log('node', node)
    let name = getName(node, src)
    // This is an incomplete set of AST nodes which could have a top level identifier
    // it's left to you to expand this list, which you can do by using
    // https://ts-ast-viewer.com/ to see the AST of a file then use the same patterns
    // as below
    if (ts.isFunctionDeclaration(node)) {
      name = node.name.text;
      // Hide the method body when printing
      node.body = undefined;
    } else if (ts.isVariableStatement(node)) {
      name = node.declarationList.declarations[0].name.getText(sourceFile);
    } else if (ts.isInterfaceDeclaration(node)){
      name = node.name.text
    }
    const container = identifiers.includes(name) ? foundNodes : unfoundNodes;
    container.push([name, node]);
  });

  // Either print the found nodes, or offer a list of what identifiers were found
  if (!foundNodes.length) {
    console.log(`Could not find any of ${identifiers.join(", ")}, found: ${unfoundNodes.filter(f => f[0]).map(f => f[0]).join(", ")}.`);
  }

  return foundNodes.map(f => {
    const [name, node] = f;
    // console.log('node', node)
    // console.log("### " + name + "\n");
    const print = printer.printNode(ts.EmitHint.Unspecified, node, sourceFile)
    // console.log(print) + "\n";
    let start = node.pos
    let end = node.end
    if (node.jsDoc && node.jsDoc[0]) {
      start = node.jsDoc[0].pos
    }

    return {
      start,
      end,
      code: print
    }
  });
}

/**
 * Main function which converts types
 * 
 * @param {string} src           typescript code to convert to jsdoc comments
 * @param {string} [filename]    filename which is required by typescript parser
 * @return {string}              @jsdoc comments generated from given typescript code
 */
module.exports = function typeConverter(src, opts = {}) {
  const {
    filename = 'test.ts',
    onlyTypesWithComments = false
  } = opts
  let ast = ts.createSourceFile(
    path.basename(filename),
    src,
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS
  )

  // console.log('ast', ast)
  // console.log('extract', extractTypeSource(ast, ['Chill'], src))
  // process.exit(1)
  // console.log('ast.statements', ast.statements)

  // iterate through all the statements in global scope
  // we are looking for `interface xxxx` and `type zzz`
  let typeMap = {}
  const typeDetails = ast.statements.map((statement) => {
    // console.log('statement', statement.type)
    const name = getName(statement, src)
  
    const srcCode = extractTypeSource(ast, [name], src)
    // console.log('srcCode', srcCode)

    /* output source ts */
    if (srcCode && srcCode[0]) {
      typeMap[name] = srcCode[0]
    }

    let typeName
    if (statement.type){
      typeName = getTypeName(statement.type, src)
    }
    /*
    console.log('typeName', typeName)
    console.log('name', name)
    /** */

    /* Default comment text */
    let comment = '/**\n*/'

    /*
    if (name === 'TinyProps') {
      console.log('statement.type', statement.type)

      if (ts.isTypeAliasDeclaration(statement)) {
        console.log('isTypeAliasDeclaration')
      }
      if (ts.isTypeAliasDeclaration(statement)) {
        console.log('YOOOOO')
        if (ts.isFunctionTypeNode(statement.type)) {
          const line = `@typedef {function} ${name}`
          comment = appendComment(comment, line)
          return convertParams(comment, statement, src)
        }
        if (ts.isTypeLiteralNode(statement.type)) {
          console.log('YOOOOOO isTypeLiteralNode')
          comment = appendComment(comment, `@typedef {object} ${name}`)
          console.log('comment', comment)

          return convertMembers(comment, statement.type, src)
        }
        if (ts.isIntersectionTypeNode(statement.type)) {
          comment = appendComment(comment, `@typedef {object} ${name}`)
          return convertMembers(comment, statement.type, src)
        }
        
        const kindOfType = getTypeName(statement.type, src)

        if (ts.isArrayTypeNode(statement.type)) {
          if (statement.type.elementType) {
            const childType = getTypeName(statement.type.elementType, src)
            if (isPrimative(childType)) {
              comment = appendComment(comment, `@typedef {${childType}[]} ${name}`)
              return convertMembers(comment, statement.type, src)
            }
          }
        }

        if (isPrimative(kindOfType)) {
          comment = appendComment(comment, `@typedef {${kindOfType}} ${name}`)
          return convertMembers(comment, statement.type, src)
        }
      }
      if (ts.isNumericLiteral(statement.type)) {
        console.log('isNumericLiteral')
      }
      if (ts.isBigIntLiteral(statement.type)) {
        console.log('isBigIntLiteral')
      }
      
      if (ts.isTypeLiteralNode(statement.type)) {
        console.log('isTypeLiteralNode')
      }
      if (ts.isArrayTypeNode(statement.type)) {
        console.log('Array type')
      }
      // const { inspect } = require('util')
      // console.log(inspect(statement, {showHidden: false, depth: null}))
      // console.log('statement', statement)
      if (ts.isVariableDeclaration(statement.type)) {
        console.log('YESSSSS')
      }

      if (ts.isIdentifier(statement.type)) {
        console.log('YESSSSS')
      }

      if (ts.isExportDeclaration(statement.type)) {
        console.log('YESSSSS')
      }
      if (ts.isStringLiteral(statement.type)) {
        console.log('YESSSSS')
      }
      if (ts.isTypeParameterDeclaration(statement.type)) {
        console.log('YESSSSS')
      }

      // process.exit(1)
    }
    /** */

    // if (true || jsDocNode) {
    // Parse only statements with jsdoc comments.
    let jsDocNode = statement.jsDoc && statement.jsDoc[0]
    // console.log('statement.jsDoc', statement.jsDoc)
    if (!onlyTypesWithComments) { 
      comment = '/**\n*/'
      if (typeof jsDocNode === 'object') {
        comment = src.substring(jsDocNode.pos, jsDocNode.end)
        // console.log('comment', comment)
      }

      if (ts.isTypeAliasDeclaration(statement)) {
        if (ts.isFunctionTypeNode(statement.type)) {
          comment = appendComment(comment, `@typedef {function} ${name}`)
          return convertParams(comment, statement, src)
        }
        if (ts.isTypeLiteralNode(statement.type)) {
          comment = appendComment(comment, `@typedef {object} ${name}`)
          return convertMembers(comment, statement.type, src)
        }
        if (ts.isIntersectionTypeNode(statement.type)) {
          comment = appendComment(comment, `@typedef {object} ${name}`)
          return convertMembers(comment, statement.type, src)
        }
        
        const kindOfType = getTypeName(statement.type, src)

        if (ts.isArrayTypeNode(statement.type)) {
          if (statement.type.elementType) {
            const childType = getTypeName(statement.type.elementType, src)
            if (isPrimative(childType)) {
              comment = appendComment(comment, `@typedef {${childType}[]} ${name}`)
              return convertMembers(comment, statement.type, src)
            }
          }
        }

        if (isPrimative(kindOfType)) {
          comment = appendComment(comment, `@typedef {${kindOfType}} ${name}`)
          return convertMembers(comment, statement.type, src)
        }
      }
      if (ts.isInterfaceDeclaration(statement)) {
        comment = appendComment(comment, `@interface ${name}`)

        statement.members.forEach(member => {
          if (!member.jsDoc) { return }
          // console.log('src', src)
          let memberComment = src.substring(member.jsDoc[0].pos, member.jsDoc[0].end)
            // Fix indentation
            .replace(/\n   \*/g, '\n *')
          let memberName = getName(member, src)
          console.log('>>>memberComment')
          console.log(memberComment)
          memberComment = appendComment(memberComment, [
            `@name ${name}#${memberName}`
          ].join('\n'))
          if (member.questionToken) {
            memberComment = appendComment(memberComment, '@optional')
          }
          if (!member.type && ts.isFunctionLike(member)) {
            let type = getTypeName(member, src)
            memberComment = appendComment(memberComment, `@type {${type}}`)
            memberComment = appendComment(memberComment, `@method`)
          } else {
            memberComment = convertMembers(memberComment, member.type, src, parentName = null)
            let type = getTypeName(member.type, src)
            memberComment = appendComment(memberComment, `@type {${type}}`)
          }
          comment += '\n' + memberComment
        })
        return comment
      }
      if (ts.isClassDeclaration(statement)) {
        comment = ''
        const className = getName(statement, src)
        statement.members.forEach(member => {
          if (!member.jsDoc) { return }
          if (!ts.isPropertyDeclaration(member)) { return }
          let memberComment = src.substring(member.jsDoc[0].pos, member.jsDoc[0].end)
          const modifiers = (member.modifiers || []).map(m => m.getText({text: src}))
          modifiers.forEach(m => {
            if (['private', 'public', 'protected'].includes(m)) {
              memberComment = appendComment(memberComment, `@${m}`)
            }
          })
          if (member.type) {
            memberComment = appendComment(memberComment, `@type {${getTypeName(member.type, src)}}`)
          }
          getTypeName(member, src)
          if (modifiers.find((m => m === 'static'))) {
            memberComment += '\n' + `${className}.${getName(member, src)}`
          } else {
            memberComment += '\n' + `${className}.prototype.${getName(member, src)}`
          }
          comment += '\n' + memberComment
        })
        return comment
      }
    }
    return comment
  })
  // console.log('typeMap', typeMap)
  // process.exit(1)
  return {
    jsdoc: typeDetails.join('\n'),
    typeMap: typeMap
  }
}