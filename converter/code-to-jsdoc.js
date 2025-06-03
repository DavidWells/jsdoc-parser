const util = require('util')
const assert = require('assert')
const { parseValue } = require('oparser')
/* doesnt work
const jsx = require("acorn-jsx")
const acornParse = acorn.Parser.extend(jsx()).parse
*/
const { inspectParameters, getParametersNames } = require('inspect-parameters-declaration')
const { convertToJSDoc } = require('./json-to-jsdoc')
const { transform } = require('./utils/to-esm')
const { getDocs } = require('./parser')
const { extractOutermostCurlyBrackets } = require('./utils/extract-curlies')
const doxxx = require('../lib/dox')

const {Parser} = require("acorn")
const MyParser = Parser.extend(
  require("acorn-jsx")(),
)

const { UNKNOWN_VALUE, UNKNOWN_REFERENCE } = require('./_constants')

// https://regex101.com/r/AnDQda/6 based on https://regex101.com/r/WGqfm8/9/
const FN_REGEX = /^(?:[\s]+)?(?:const|let|var|export|export\s+default)?(?:[a-z0-9.]+(?:\.prototype)?)?(?:\s)?(?:[a-z0-9-_{}:\s]+\s?=)?\s?(?:[a-z0-9]+\s+\:\s+)?(?:async\s+)?(?:function\*?\s*)?(?:[a-z0-9_-]+)?\s?\(.*\)\s?(?:.+)?([=>]:)?\{(?:(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\}(?:\s?\(.*\)\s?\)\s?)?)?(?:\;)?$/gim

function deepLog(labelOrValue, value) {
  const labelIsString = typeof labelOrValue === 'string'
  const logValue = labelIsString ? value : labelOrValue
  if (labelIsString) {
    console.log(`>> ${labelOrValue} -------------------------------`)
  }
  if (logValue) {
    console.log(util.inspect(logValue, {showHidden: false, depth: null, colors: true}))
  }
}

const fnDecl = /^[ ]*function[ ]?.*\(.*\)[ ]?\{\n?/m
const trailingBrace = /[ ]*\}(?![\s\S]*\})$/m

function getBody(fn) {
  return fn.toString()
    .replace(fnDecl, '')
    .replace(trailingBrace, '')
    .trim();
};

const aFunctionWithWeirdParametersDefinition = (param1 = 'heyo', param2, { someProp: [[ param3 ]] = [[]] } = {}, ...args) => {
	let result = `param1: ${param1} \n`;
	result += `param2: ${param2} \n`;
	result += `param3: ${param3} \n`;
	result += `args: ${args.join(',')}`;

	return result;
}

function easy(one = 'foo', two, three) {

}

const refValue = 'foo'
/**
* This thing does xyz
* @param {object} [api]
* @param {string} [api.awesome="chill"]
* @param {object} [api.rad]
* @param {string} [api.rad.whatever="bar"]
* @param {object} [api.rad.lol]
* @param {boolean} [api.rad.lol.cool=true]
* @param {*} api.boss
*/
function cool(fin = 'cool', api, { funky, dope }, fun) {
// function cool(api) {
  const {
    awesome = 'chill',
    rad = { whatever: 'bar', lol: { cool: true }},
    boss,
    abc = false,
    arrayThing = ['nice', 'cool'],
    refThing = refValue
  } = api

  var {
    bunker,
    what = '',
    foo: asBar = ['lol'],
    ...rest
  } = fun

  if (true) {
    return false
  }
  const xyz = 'foo'
  console.log('yo')
  return true
  return ['fun']
  return 'foo'
  // return xyz
  return {
    cool: xyz
  }
}

/**
 * Strip out comment blocks
 * @param {string} str 
 * @returns {string} clean commentless string
 */
function stripJSComments(str) {
  // https://regex101.com/r/XKHU18/5
  return str.replace(/\s?[ \t]*\/\*[\s\S]*?\*\/|\s?[ \t]*\/\/.*$|\/\*{1,}[\n\*]*(\s?[\s\S]*?)?\*+\//gm, '')
}


function extractFunctionsFromFile(fileContents) {
  //const fileContents = fs.readFileSync(filePath, 'utf-8'); // Read file contents
  const fileContent = fileContents
  
  const functionMatches = fileContent.match(/function\s+(\w+)\s*\([\w\s,]*\)\s*{[^{}]*}/g);
  console.log('functionMatches', functionMatches)
  const extractedFunctions = functionMatches.map((funcDeclaration) => {
    const functionName = funcDeclaration.match(/function\s+(\w+)/)[1];
    const functionBody = extractOutermostCurlyBrackets(funcDeclaration)[0];
    return { name: functionName, body: functionBody };
  });
  return extractedFunctions
}

function parseByLine(fileContents) {
  const lines = fileContents.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    console.log('line', line)
  }
}

function parseByCharacter(fileContents) {
  for (let i = 0; i < fileContents.length; i++) {
    const char = fileContents[i];
    console.log('char', char)
  }
}

function walkAst(ast) {
  const functions = [];
  walk.simple(ast, {
    FunctionDeclaration(node) {
      functions.push(node.id.name);
    },
    FunctionExpression(node) {
      if (node.id) {
        functions.push(node.id.name);
      }
    },
    ArrowFunctionExpression(node) {
      if (node.id) {
        functions.push(node.id.name);
      }
    },
    AsyncFunctionDeclaration(node) {
      functions.push(node.id.name);
    },
    AsyncFunctionExpression(node) {
      if (node.id) {
        functions.push(node.id.name);
      }
    },
    VariableDeclaration(node) {
      node.declarations.forEach(declaration => {
        if (declaration.init && declaration.init.type === 'FunctionExpression') {
          functions.push(declaration.init.id.name);
        }
      });
    },
  });
  return functions
}

function isFunctionLike(node = {}) {
  return (
    // MethodDefinition
    node.type === 'FunctionExpression' || 
    node.type === 'FunctionDeclaration' || 
    node.type === 'ArrowFunctionExpression'
  )
}

/**
 * Iterate over code AST and pluck out defined functions
 * @param {*} ast 
 * @returns 
 */
function functionFinder(ast) {
  const nodes = (ast.body || [])
  const functions = []
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index]
    console.log('node', node)

    /* Match Var declared functions. var, const, let */
    if (node.type === 'VariableDeclaration' && node.declarations) {
      const foundFns = getFnsFromVars(node)
      if (foundFns && foundFns.length) {
        foundFns.forEach((x) => {
          functions.push(x)
        })
        continue;
      }
    }

    /* Fns defined in { } blocks */
    if (node.type === 'BlockStatement' && node.body) {
      const nestedFns = functionFinder(node)
      if (nestedFns && nestedFns.length) {
        nestedFns.forEach((x) => {
          functions.push(x)
        })
        continue;
      }
    }

    /* Match functions defined module.exports */
    if (node.type === 'ExpressionStatement' && node.expression && node.expression.right) {
      if (isFunctionLike(node.expression.right)) {
        functions.push(node.expression.right)
      }
    }

    /* Match functions es6 exports */
    if ((
      node.type === 'ExportDefaultDeclaration' ||
      node.type === 'ExportNamedDeclaration'
      ) &&
      (node.declaration && isFunctionLike(node.declaration))
    ) {
      functions.push(node.declaration)
      continue;
    }

    /* Simple function declarations */
    if (node.type === 'FunctionDeclaration') {
      functions.push(node)
      continue;
    }

    /* Iife declarations */
    if (node.type === 'ExpressionStatement' && node.expression && node.expression.callee && node.expression.callee.type === 'FunctionExpression') {
      functions.push(node.expression.callee)
      continue;
    }

  }
  return functions
}

/**
 * Find all functions in a block of code
 * @param {*} ast 
 * @param {*} codeText 
 * @returns 
 */
function findFunctions(ast, codeText) {
  const functions = functionFinder(ast)
  /*
  console.log('functions.length', functions.length)
  console.log('functions', functions)
  process.exit(1)
  /** */

  /* Return function details */
  const fnDetails = getFnInfo(functions, codeText)
  /*
  delete fnDetails[0].params.ast
  deepLog('fnDetails', fnDetails)
  console.log(Object.keys(fnDetails[0]))
  process.exit(1)
  /** */
  return fnDetails

  if (ast && ast.body) {
    // deepLog(ast.body)
    // process.exit(1)
    const functions = []
    const funcs = (ast.body || [])
      .filter((node) => {
        // console.log('node', node)
        /* Match functions defined as variables/const/let */
        if (node.type === 'VariableDeclaration' && node.declarations) {
          const foundFns = getFnsFromVars(node)
          if (foundFns && foundFns.length) {
            foundFns.forEach((x) => {
              functions.push(x)
            })
            return false
          }
        }
        if (node.type === 'BlockStatement' && node.body) {
          console.log('BlockStatement')
          deepLog(node.body)
        }

        /* Match functions defined module.exports */
        if (node.type === 'ExpressionStatement' && node.expression && node.expression.right) {
          if (isFunctionLike(node.expression.right)) {
            functions.push(node.expression.right)
          }
        }
        /* Match functions es6 exports */
        if ((
            node.type === 'ExportDefaultDeclaration' ||
            node.type === 'ExportNamedDeclaration'
            ) &&
            (node.declaration && isFunctionLike(node.declaration))
          ) {
            functions.push(node.declaration)
          return true
        }

        if (node.type === 'FunctionDeclaration') {
          functions.push(node)
          return true
        }

        return false
    })
    // console.log('funcs', funcs)
    // console.log('functions', functions)
    console.log('functions.length', functions.length)

    // deepLog(functions)
    const fnDeetsTwo = getFnInfo(functions, codeText)
    deepLog('fnDeetsTwo', fnDeetsTwo)
    console.log('functions', functions)
    // process.exit(1)
    const fnData = getDataFromFnAst(functions, codeText)
    //*
    deepLog('fnData', fnData)
    process.exit(1)
    /** */
  }
  // const y = go(codeText)
  // console.log('y', y)
  // const x = extractFunctionsFromFile(codeText)
  // console.log('extractFunctionsFromFile', x)
  // const comments = doxxx.parseComments(codeText)
  // console.log('comments')
  // deepLog(comments)
  process.exit(1)
  // https://regex101.com/r/AnDQda/6 based on https://regex101.com/r/WGqfm8/9/
  const pattern = /^(?:[\s]+)?(?:const|let|var|export|export\s+default)?(?:[a-z0-9.]+(?:\.prototype)?)?(?:\s)?(?:[a-z0-9-_{}:\s]+\s?=)?\s?(?:[a-z0-9]+\s+\:\s+)?(?:async\s+)?(?:function\*?\s*)?(?:[a-z0-9_-]+)?\s?\(.*\)\s?(?:.+)?([=>]:)?\{(?:(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\}(?:\s?\(.*\)\s?\)\s?)?)?(?:\;)?$/gim
  const fns = []
  let matches
  while ((matches = pattern.exec(codeText)) !== null) {
    if (matches.index === pattern.lastIndex) {
      pattern.lastIndex++  // avoid infinite loops with zero-width matches
    }
    const code = matches[0]
    //*
    console.log('FN match', code)
    /**/
    const argString = getFuncArgs(code)
    const argKeys = getParametersNames(argString)
    const ast = parseAst(code)
    let x 
    if (Object.keys(ast).length) {
      const funcs = collectFunctionDefs(ast)
      console.log('funcs', funcs)
      const functionAsts = getDataFromFnAst(funcs)

      const paramsFoundInFunction = functionAsts.map((fn) => {
        // console.log('fn', fn)
        return findParamsFromInsideFn(argKeys, fn)
      })
      console.log('functionAsts', functionAsts)
      console.log('foundParams', paramsFoundInFunction)
      const inlineDestructuredVars = getDestructuredValues(paramsFoundInFunction)
      //*
      console.log('inlineDestructuredVars')
      deepLog(inlineDestructuredVars)
      // x = findParamsFromInsideFn(argKeys, functionAsts)
    }
    fns.push({
      name: getNameFromSourceCode(code),
      code,
      args: inspectParams(argString),
      argKeys,
      argString,
      // ast,
      // x,
      location: matches.index,
    })
  }
  return fns
}

function getFnsFromVars(node) {
  var fnsFromVars = []
  if (node && node.declarations) {
    node.declarations.forEach((declaration) => {
      if (declaration.init && isFunctionLike(declaration.init)) {
        fnsFromVars.push(declaration.init)
      }
    })
  }
  return fnsFromVars
}

function inspectParams(argString = '') {
  const params = inspectParameters(argString) || []
  for (let i = 0; i < params.length; i++) {
    params[i].position = i
    params[i].paramKey = `param${i + 1}`
  }
  return params
}

function processParams(fnParams) {
  return fnParams.reduce((acc, curr, i) => {
    if (curr.expectsDestructuring) {
      // console.log('curr.destructuredParameters', curr.destructuredParameters)
      acc[`param${i}`] = curr.destructuredParameters.reduce((a, c) => {
        a[c.parameter] = resolveValue(c, foundThings)
        return a
      }, {})
    } else {
      acc[curr.parameter] = resolveValue(curr, foundThings)
    }
    return acc
  }, {})
}

function getFuncArgs(code) {
  if (typeof code !== 'string') {
    return code
  }
  const cleanCode = stripJSComments(code)
  // TODO harden with function/const etc
  // Matches first found params
  const foundParams = /\(\s*([^)]+?)\s*\)/.exec(cleanCode)
  // args = args[1].split(/\s*,\s*/);
  return foundParams ? foundParams[1] : ''
}

function isConstFn(node) {
  // if (node.type === 'VariableDeclaration') {
  //   console.log('VAR ', node)
  //   console.log(node.declarations[0])
  // }
  if (node.type === 'VariableDeclaration' && 
      node.declarations && 
      node.declarations[0] &&
      node.declarations[0].init && node.declarations[0].init.type === 'ArrowFunctionExpression'
  ) {

    return true
  }
  return false
}

/**
 * Retrieves a string representation of a code block from fn or string
 * @param {string|function} code 
 * @returns {string} code block string
 */
function getCodeString(code) {
  if (typeof code === 'function') {
    return code.toString()
  }
  return code
}


function parseAst(codeToParse) {
  const codeString = getCodeString(codeToParse)
  const setAsModule = codeString.match(/export|import/) ? true : false
  let ast = {}
  try {
    ast = MyParser.parse(codeToParse, {
      ecmaVersion: 2022,
      ...(setAsModule) ? { sourceType: 'module' } : {}
    })
  } catch(err) {
    console.log(`AST parsing error`)
    console.log(err)
  }
  return ast
}


function resolveRight(node, left) {
  if (node.type === 'Literal') {
    return {
      name: node.raw,
      node
    }
  }
  if (node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') {
    return {
      name: getName(node, left),
      node
    }
  }
  return node.name
}

function resolveLeft(node) {
  if (node.type === 'MemberExpression') {
    let objectName = getName(node.object)
    if (!objectName) {
      objectName = resolveLeft(node.object)
    }
    const propertyName = getName(node.property)
    return `${objectName}.${propertyName}`
  }
  return getName(node)
}


function collectFunctionDefs(ast) {
  const funcs = (ast.body || []).filter((node) => {
    // @TODO handle const function declarations
    if (isConstFn(node)) {
      return true
    }
    return node.type === 'FunctionDeclaration' 
  })
  return funcs
}

/**
 * Convert function code to JSDocs
 * @param {*} codeToParse 
 * @param {*} opts 
 * @returns 
 */
function parseCode(codeToParse, opts = {}) {
  const { filePath } = opts
  console.log('filePath', filePath)
  // console.log(getBody(codeToParse))
  // const ast = parse(getBody(cool), { ecmaVersion: 2022 })
  const codeString = getCodeString(codeToParse)
  let setAsModule = false
  if (codeString.match(/export|import/)) {
    setAsModule = true
  }

  // TODO test with relative paths. not working with absolutes? 
  const allDocs = getDocs(filePath)
  console.log('allDocs', allDocs)
  // process.exit(1)

  const es6 = transform(codeString)
  console.log('es6', es6)
  // process.exit(1)
  // deepLog(doxxx.parseComments(codeString))
  // process.exit(1)
  const ast = parseAst(codeToParse)
  //*
  deepLog('ast', ast)
  /** */
  const comments = doxxx.parseComments(codeToParse)
  console.log('comments', comments)

  const fns = findFunctions(ast, codeToParse).map((result) => {
    if (!result.name) {
      return result
    }
    if (comments.length) {
      const matchingComment = comments.find((cmt) => {
        return cmt.ctx && cmt.ctx.type === 'function' && cmt.ctx.name === result.name
      })
      if (matchingComment) {
        return {
          ...result,
          comment: matchingComment,
        }
      }
    }
    return result
  })
  deepLog('foundFunctions', fns)

  /* Return function details */
  return fns

  process.exit(1)
  // console.log('ast')
  // console.log(ast.body)
  /* Get function params */
  const codeForParams = getFuncArgs(codeToParse)
  console.log('codeForParams', codeForParams)
  // process.exit(1)
  const fnParams = inspectParameters(codeForParams)
    .map((x, i) => {
      return {
        ...x,
        position: i,
        paramPlaceholder: `param${i}`
      }
    })
  const fnParamNames = getParametersNames(codeForParams)
  console.log('fnParamNames', fnParamNames)
  console.log('fnParams')
  deepLog(fnParams)
  // process.exit(1)

  /* Collect all functions */
  const funcs = (ast.body || []).filter((node) => {
    // @TODO handle const function declarations
    if (isConstFn(node)) {
      return true
    }
    return node.type === 'FunctionDeclaration' 
  })
  /*
  console.log('Found funcs')
  deepLog(funcs)
  /** */

  // deepLog(ast.body)
  // process.exit(1)

  /* Collect all functions */
  const functionAsts = getDataFromFnAst(funcs)
  //*
  console.log('functionAsts')
  deepLog(functionAsts)
  // process.exit(1)
  /** */

  const fnNames = functionAsts.map((fn) => {
    // console.log('fn', fn)
    return fn.functionName.name
  })
  console.log('fnNames', fnNames)
  // process.exit(1)

  const foundParams = functionAsts.map((fn) => {
    // console.log('fn', fn)
    return findParamsFromInsideFn(fnParamNames, fn)
  })
  //*
  console.log('foundParams')
  deepLog(foundParams)
  // process.exit(1)
  /** */

  const inlineDestructuredVars = getDestructuredValues(foundParams)
  //*
  console.log('inlineDestructuredVars')
  deepLog(inlineDestructuredVars)
  // process.exit(1)
  /** */

  const cleanedObjs = varsToValues(inlineDestructuredVars)
  //*
  console.log('cleanedObjs')
  deepLog(cleanedObjs)
  // process.exit(1)
  /** */

  const foundThings = cleanedObjs[0]
  const realParams = fnParams.reduce((acc, curr, i) => {
    if (curr.expectsDestructuring) {
      // console.log('curr.destructuredParameters', curr.destructuredParameters)
      acc[`param${i}`] = curr.destructuredParameters.reduce((a, c) => {
        a[c.parameter] = resolveValue(c, foundThings)
        return a
      }, {})
    } else {
      acc[curr.parameter] = resolveValue(curr, foundThings)
    }
    return acc
  }, {})
  console.log('realParams')
  deepLog(realParams)
  // process.exit(1)

  const returnStatements = functionAsts.map((xyz) => xyz.returnStatements).flat()
  console.log('returnStatements')
  deepLog(returnStatements)
  // process.exit(1)

  const formattedReturn = returnStatements.map((node) => {
    const value = getNodeValue(node)
    if (value) return value
    const indentifier = getIdentifier(node)
    if (indentifier) {
      return `VARIABLE {${indentifier}}`
    }
    return
  })
  console.log('formattedReturn')
  deepLog(formattedReturn)

  const fnName = getNameFromSourceCode(codeString)
  console.log('fnName')
  deepLog(fnName)
  // process.exit(1)

  const jsDocs = outputJsDoc(realParams, {
    // fn: codeToParse,
    formattedReturn,
    fnNames,
    fnParamNames,
    fnParams,
  })
  // const jsDocs = outputJsDoc(cleanedObjs)
  jsDocs.forEach((doc) => {
    console.log('doc.data', doc.data)
  })

  return jsDocs
}

function outputJsDoc(objs, {
  fn,
  formattedReturn,
  fnNames,
  fnParamNames,
  fnParams,
}) {
  const ensureArray = (Array.isArray(objs)) ? objs : [objs]
  return ensureArray.map((cleaned, i) => {
    const opts = {
      // typeName: 'fooBar',
      name: fnNames[i], // || getNameFromSourceCode(fn),
      description: 'This thing does xyz',
      fnParamNames,
      fnParams,
      returnStatements: formattedReturn,
      isFunction: true,
    }
    const jsDoc = convertToJSDoc(JSON.stringify(cleaned), opts)
    return Object.assign({}, opts, jsDoc)
  })
}

function outputJSDocSingle({
  obj,
  nameWithKind,
  description,
  formattedReturn,
  fnName,
  fnParamNames,
  fnParams,
}) {
  const opts = {
    // typeName: 'fooBar',
    name: fnName, // || getNameFromSourceCode(fn),
    description: description || nameWithKind,
    fnParamNames,
    fnParams,
    returnStatements: formattedReturn,
    isFunction: true,
  }
  console.log(`jsdoc opts`, opts)
  // console.log(`jsdoc inferredTypes`, obj)
  // process.exit(1)
  const jsDoc = convertToJSDoc(JSON.stringify(obj), opts)
  return Object.assign({}, opts, jsDoc)
}

function varsToValues(destructuredVariables) {
  return destructuredVariables.reduce((acc, destructured) => {
    // console.log('destructured', destructured)
    const keyValue = Object.keys(destructured).reduce((acc, key) => {
      // console.log('destructured[key]', destructured[key])
      const objectStructure = destructured[key].reduce((a, c) => {
        if (Array.isArray(c)) {
          // console.log(`KEY ${key} is array`, c)
          a = c.map((x) => {
            return valueOrUnknown(x.defaultValue)
          })
          return a
        }

        /* Exclude ...rest spread values from jsdoc */
        if (c.isRestSpread) {
          return a
        }
        a[c.name] = valueOrUnknown(c.defaultValue)
        return a
      }, {})
      
      acc[key] = objectStructure
      return acc
    }, {})

    acc = {
      ...acc,
      ...keyValue
    }
    return acc
  }, {})
}

function getFnInfo(funcs = [], codeText) {
  /*
  console.log(funcs[2])
  process.exit(1)
  /** */
  return funcs.map((fn) => {
    let functionName
    let fnParams 
    let fnBody 
    //console.log('fn', fn)
    /*
    console.log('getFunctionNameWithKind', getFunctionNameWithKind(fn))
    console.log('getDataFromFnAst', getDataFromFnAst([fn], codeText))
    /** */
    return getFnDetails(fn, codeText)
  })
}

function getFnDetails(fn, codeText) {
  // console.log('fn', fn)
  const returnStatements = []
  let functionName
  let fnParams 
  let fnBody 
  if (isConstFn(fn)) {
    /* Shape of const xyz = () => {} arrow function */
    functionName = fn.declarations[0].id.name
    fnParams = fn.declarations[0].init.params
    // fnBody = [fn.declarations[0].init.body]
    fnBody = [fn.declarations[0].init.body.body]
  } else {
    /* Shape of normal function xyz */
    functionName = getName(fn)// fn.id
    fnParams = fn.params
    fnBody = fn.body.body
  }

  /* Extract Params as string */
  let paramStr = ''
  if (fnParams.length) {
    let paramPos = {}
    for (let index = 0; index < fnParams.length; index++) {
      const node = fnParams[index]
      if (!paramPos.start) {
        paramPos = {
          start: node.start,
          end: node.end
        }
      }
      if (node.end > paramPos.end) {
        paramPos.end = node.end 
      }
    }
    console.log('codeText', codeText)
    paramStr = getTextBetweenChars(codeText, paramPos.start, paramPos.end)
  }

  // console.log('fnBody')
  // deepLog(fnBody)

  /* Find internal variable declarations of functions to infer arg types */
  const varDeclarations = fnBody.reduce((acc, node) => {
    // console.log(node.type)
    // @TODO Ensure that we recursively check body
    if (node.type === 'VariableDeclaration') {
      acc = acc.concat(node)
    }
    if (node.type === 'IfStatement') {
      console.log('IFFFFFFF. TODO check for other return statements')
    }
    if (node.type === 'ReturnStatement') {
      returnStatements.push(node)
    }
    return acc
  }, [])

  const rawSrc = (codeText) ? getTextBetweenChars(codeText, fn.start, fn.end) : null

  const paramNames= getParametersNames(paramStr)
  const paramData = inspectParams(paramStr)
  // console.log('paramNames', paramNames)

  let inside = []
  let innerDestructValue = {}
  let formattedVariables
  /* If internal variable declarations, check for any destructuring */
  if (varDeclarations.length) {
    varDeclarations.forEach((theVar) => {
      // console.log('xvar', xvar)
      const found = findParamsFromInsideDec(paramNames, theVar.declarations)
      /*
      console.log('findParamsFromInsideDec', found)
      // process.exit(1)
      /** */
      if (found.length) {
        inside.push(found)
      }
    })
    /* Check found function body variables for destructures */
    const inlineDestructuredVars = getDestructuredValues(inside)
    /*
    console.log('inlineDestructuredVars')
    deepLog(inlineDestructuredVars)
    process.exit(1)
    /** */

    /* Convert destructured Vars to values */
    innerDestructValue = varsToValues(inlineDestructuredVars)
    /*
    console.log('innerDestructValue')
    deepLog(innerDestructValue)
    /** */
    // process.exit(1)
    formattedVariables = varDeclarations.map((node) => {
      console.log('node', node)
      const value = getNodeValue(node)
      console.log('value', value)
      if (value) return value
      const indentifier = getIdentifier(node)
      if (indentifier) {
        return `VARIABLE {${indentifier}}`
      }
      return
    })
    /*
    console.log('formattedVariables')
    deepLog(formattedVariables)
    /** */
    // process.exit(1)
  }

  console.log('innerDestructValue', innerDestructValue)
  console.log('paramData', paramData)
  // process.exit(1)

  // if (innerDestructValue && Object.keys(innerDestructValue).length) {
  const inferredTypes = paramData.reduce((acc, curr, i) => {
    if (curr.expectsDestructuring) {
      // console.log('curr.destructuredParameters', curr.destructuredParameters)
      acc[`param${i + 1}`] = curr.destructuredParameters.reduce((a, c) => {
        a[c.parameter] = resolveValue(c, innerDestructValue)
        return a
      }, {})
    } else {
      acc[curr.parameter] = resolveValue(curr, innerDestructValue)
    }
    return acc
  }, {})
  console.log('inferredTypes')
  deepLog(inferredTypes)
  // process.exit(1)
  // }

  let formattedReturn = []
  if (returnStatements.length) {
    formattedReturn = returnStatements.map((node) => {
      const value = getNodeValue(node)
      if (value) return value
      const indentifier = getIdentifier(node)
      if (indentifier) {
        return `VARIABLE {${indentifier}}`
      }
      return
    })
    console.log('formattedReturn')
    deepLog(formattedReturn)
    // process.exit(1)
  }
  
  const nameWithKind = getFunctionNameWithKind(fn)

  const jsDocs = outputJSDocSingle({
    // fn: codeToParse,
    nameWithKind,
    // description: functionName,
    obj: inferredTypes,
    formattedReturn,
    fnName: functionName,
    fnParamNames: paramNames,
    fnParams: paramData,
  })

  if (functionName === 'anonymous') {
    // TODO lookup export value?
    // console.log('codeText', codeText)
    // const leadingText = getLeadingTextAndPreviousLine(codeText, fn.start, fn.end)
    // console.log('leadingText', leadingText)
    // process.exit(1)
  }

  /*
  console.log('jsDocs')
  deepLog(jsDocs)
  process.exit(1)
  /** */

  return {
    name: functionName,
    nameWithKind,
    code: rawSrc,
    isAsync: fn.async,
    params: {
      paramStr,
      paramNames,
      inferredTypes,
      paramData,
      ast: fnParams,
    },
    varDeclarations: {
      asts: varDeclarations
    },
    returnStatements: {
      asts: returnStatements,
      inferredTypes: formattedReturn
    },
    leading: getLeadingTextAndPreviousLine(codeText, fn.start, fn.end),
    position: {
      start: fn.start,
      end: fn.end
    },
    jsDocs
  }
}

function isStartOfLine(text, startPos, endPos) {
  if (startPos > endPos || startPos < 0 || endPos > text.length) {
    throw new Error('Invalid start or end position')
  }

  // Check if the character before startPos is a newline or if startPos is 0
  return startPos === 0 || text[startPos - 1] === '\n'
}

function getLeadingText(text = '', startPos, endPos) {
  // Check if startPos is at the beginning of the line
  if (isStartOfLine(text, startPos, endPos)) {
    return ''
  }

  // Find the last newline before startPos
  const lastNewlineIndex = text.lastIndexOf('\n', startPos - 1)
  
  // Extract and return the leading text of the line
  return text.slice(lastNewlineIndex + 1, startPos)
}

/**
 * Finds the leading text of a line and the text of the previous line if startPos is not at the beginning of the line
 *
 * @param {string} text - The full text
 * @param {number} startPos - The start position within the text
 * @param {number} endPos - The end position within the text
 * @returns {{leadingText: string, previousLine: string}} - An object containing the leading text and the previous line
 */
function getLeadingTextAndPreviousLine(text, startPos, endPos) {
  if (startPos > endPos || startPos < 0 || endPos > text.length) {
    throw new Error('Invalid start or end position')
  }

  let leadingText = ''
  let previousLine = ''

  // Find the last newline before startPos
  const lastNewlineIndex = text.lastIndexOf('\n', startPos - 1)

  if (lastNewlineIndex !== -1) {
    // Extract the leading text of the current line
    leadingText = text.slice(lastNewlineIndex + 1, startPos)

    // Find the newline before the last newline to get the previous line
    const secondLastNewlineIndex = text.lastIndexOf('\n', lastNewlineIndex - 1)

    if (secondLastNewlineIndex !== -1) {
      previousLine = text.slice(secondLastNewlineIndex + 1, lastNewlineIndex)
    } else {
      // If there's no previous newline, the previous line is from the start of the text to the last newline
      previousLine = text.slice(0, lastNewlineIndex)
    }
  } else {
    // If there's no newline before startPos, it means startPos is on the first line
    leadingText = text.slice(0, startPos)
    previousLine = '' // No previous line in this case
  }

  return {
    leadingText,
    previousLine
  }
}

function getDataFromFnAst(funcs = [], codeText) {
  return funcs.map((fn) => {
    return getFnDetails(fn, codeText)
  })
}

function getTextBetweenChars(text, start, end) {
  
  return text.slice(start, end)
}

function resolveValue(paramData, foundThings) {
  // console.log('foundThings', foundThings)
  // console.log('paramData', paramData)
  if (foundThings && foundThings[paramData.parameter]) {
    return foundThings[paramData.parameter]
  }
  // if default value set
  if (paramData.declaration && paramData.declaration.indexOf('=') > -1) {
    const pieces = paramData.declaration.split('=')
    if (pieces[1]) {
      const value = pieces[1].trim()
      // If looks like array or object or string
      if (value.match(/^\[([\s\S]*)]$/) || value.match(/^{([\s\S]*)}$/) || value.match(/^("|')(.*)(\1)$/)) {
        return valueOrUnknown(parseValue(value))
      }
      // If value doesn't look like a string, array or object. Its a variable reference we dont know
      if (!value.match(/^("|')(.*)(\1)$/)) {
        return UNKNOWN_REFERENCE + value
      }
    }
  }

  return valueOrUnknown(paramData.defaultValue)
}

function valueOrUnknown(value) {
  if (typeof value === 'undefined') {
    return UNKNOWN_VALUE
  }
  return value
}

function findParamsFromInsideDec(paramNames, dec) {
  return paramNames.reduce((acc, paramName) => {
    console.log('CHECK FOR', paramName)
    console.log('dec', dec)
    const node = findDeclaration(paramName, dec)
    // console.log('node', node)
    if (node) {
      acc = acc.concat({ name: paramName, node })
    }
    return acc
  }, [])
}

function findParamsFromInsideFn(paramNames, fn) {
  console.log('fn', fn)
  return paramNames.reduce((acc, paramName) => {
    console.log('CHECK FOR', paramName)
    const node = findDeclaration(paramName, fn.body.varDeclarations)
    // console.log('node', node)
    if (node) {
      acc = acc.concat({ name: paramName, node })
    }
    return acc
  }, [])
}

function findDeclaration(paramName, declarations) {
  console.log('declarations', declarations)
  return (declarations || []).find((node) => {
    const foundIt = findVarName(paramName, node)
    return foundIt
  })
}

function findVarName(nameOfVar, node) {
  console.log(`FIND ${nameOfVar} in`, node)

  if (node.type === 'VariableDeclarator' && node.init.type === 'Identifier' && node.init.name === nameOfVar) {
    return node
  }

  if (!node.declarations) {
    return
  }
  console.log('node.declarations', node.declarations)
  return node.declarations.find((dec) => {
    return dec.init && dec.init.type === 'Identifier' && dec.init.name === nameOfVar
  })
}

function getDestructuredValues(foundParamVars) {
  return foundParamVars.map((found) => {
    return found.reduce((acc, curr) => {
      console.log('curr')
      deepLog(curr)
      const { name, node } = curr
      var identifiers = (node.declarations && node.declarations[0]) ? node.declarations[0].id : node.id
      // console.log('identifiers', identifiers)
      // console.log(node.declarations[0])
      const destructuredValues = getAssignedIdentifiers(identifiers)
      // console.log('destructuredValues', destructuredValues)
      if (destructuredValues && destructuredValues.length) {
        const isArray = identifiers && identifiers.type === 'ArrayPattern'
        acc[name] = (isArray) ? [destructuredValues] : destructuredValues
      }
      // console.log('node')
      // deepLog(node)
      return acc
    }, {})
  })
}

function getIdentifier(node) {
  if (node.argument && node.argument.type === 'Identifier') {
    return node.argument.name
  }
  return node.name
}

function getFnNameFromExport(str = '') {
  if (str === 'module.exports') {
    return 'default'
  }
  const match = str.match(/^module\.exports\.(.*)/)
  if (match) {
    return match[1]
  }
  return 
}

function getName(node, left) {
  // Throwing on export { EVENTS } ¯\_(ツ)_/¯
  if (!node) return 
  if (node.type === 'ExportDefaultDeclaration') {
    return node.declaration.name || node.declaration.id.name
  }
  if (node.type === 'Identifier') {
    return node.name
  }
  if (node.type === 'ArrowFunctionExpression') {
    return resolveId(node) || getFnNameFromExport(left) || 'anonymous'
  }
  if (node.type === 'FunctionExpression') {
    return resolveId(node) || getFnNameFromExport(left) || 'anonymous'
  }
  return resolveId(node)
}

function resolveId(node) {
  if (node && node.id && node.id.name) {
    return node.id.name
  }
  return node.id
}

function getNodeValue(node) {
  if (node.type === 'Literal' && node.name) {
    return `${UNKNOWN_REFERENCE}${node.name}`
  }
  if (node.type === 'Identifier') {
    // const { refThing = refValue } = api
    return `${UNKNOWN_REFERENCE}${node.name}`
  }
  if (node.type === 'ArrayExpression') {
    return node.elements.map((el) => el.value)
  }
  if (node.type === 'ReturnStatement') {
    return getNodeValue(node.argument)
  }
  if (node.type === 'ObjectExpression') {
    // console.log('ObjectExpression', node)
    // return node.properties
    return node.properties.reduce((acc, kv) => {
      acc[kv.key.name] = getNodeValue(kv.value)
      return acc
    }, {})
  }
  if (node.type === 'VariableDeclarator') {
    const name = getName(node)
    return {
      name,
      value: getNodeValue(node.init)
    }
  }
  if (node.type === 'VariableDeclaration') {
    return getNodeValue(node.declarations[0])
  }
  if (typeof node.value === 'string' && node.value === '') {
    return node.value
  }

  if (typeof node.value !== 'undefined') {
    return node.value
  }

  return (
    /* { foo: unknownVarRef } */
    // __unknown__ref_
    `${UNKNOWN_VALUE}ref_:${node.name}`
  )
}
/**
 * // const getAssignedIdentifiers = require('get-assigned-identifiers')
 * Get a list of all identifiers that are initialised by this (possibly destructuring)
 * node.
 *
 * eg with input:
 *
 * var { a: [b, ...c], d } = xyz
 *
 * this returns the nodes for 'b', 'c', and 'd'
 */
function getAssignedIdentifiers(node, identifiers, parentNode) {
  assert.equal(typeof node, 'object', 'get-assigned-identifiers: node must be object')
  assert.equal(typeof node.type, 'string', 'get-assigned-identifiers: node must have a type')

  identifiers = identifiers || []

  if (node.type === 'ImportDeclaration') {
    node.specifiers.forEach(function (el) {
      getAssignedIdentifiers(el, identifiers)
    })
  }

  if (node.type === 'ImportDefaultSpecifier' || node.type === 'ImportNamespaceSpecifier' || node.type === 'ImportSpecifier') {
    node = node.local
  }

  if (node.type === 'RestElement') {
    node = node.argument
    node.isRestSpread = true
  }

  if (node.type === 'ArrayPattern') {
    node.elements.forEach(function (el) {
      // `el` might be `null` in case of `[x,,y] = whatever`
      if (el) {
        getAssignedIdentifiers(el, identifiers)
      }
    })
  }

  if (node.type === 'ObjectPattern') {
    node.properties.forEach(function (prop) {
      // console.log('node.properties xxxxxx', prop)
      if (prop.type === 'Property') {
        // If object value assigned use original { b: a } = foo
        if (prop.value.name !== prop.key.name && prop.value.type !== 'AssignmentPattern') {
          getAssignedIdentifiers(prop.key, identifiers)
          // TODO handle foo: asBar = 'what', it sets asBar and should be foo
        } else {
          getAssignedIdentifiers(prop.value, identifiers, prop)
        }
      } else if (prop.type === 'RestElement') {
        getAssignedIdentifiers(prop, identifiers)
      }
    })
  }

  if (node.type === 'Identifier') {
    identifiers.push(node)
  }

  if (node.type === 'AssignmentPattern' && (node.left && node.left.type === 'Identifier')) {
    const newNode = getAssignment(node, parentNode)
    // const newNode = node.left
    // newNode.defaultValue = getNodeValue(node.right)
    identifiers.push(newNode)
  }

  return identifiers
}

function getAssignment(node, parentNode) {
  if (node.type === 'AssignmentPattern' && (node.left && node.left.type === 'Identifier')) {
    let newNode = node.left
    if (parentNode && parentNode.key && parentNode.type === 'Property') {
      newNode = parentNode.key
    }
    console.log('node.right', node.right)
    newNode.defaultValue = getNodeValue(node.right)
    return newNode
  }
  return node
}

// Function call parser https://github.com/hisco/function-parser

/**
 * Inspects a function and returns information about it
 * @param  {Function|String} 	fn - Function to be inspected
 * @return {String}        		Returns the function's name
 */
function getNameFromSourceCode(fn) {
  // alt https://github.com/3rd-Eden/fn.name/blob/master/index.js
	let fnString = fn.constructor === String ? fn.replace(/(\r\n|\r|\n)/g, '') : fn.toString().replace(/(\r\n|\r|\n)/g, '')
  // const debugFn = fn.constructor === String ? fn : fn.toString()
  // console.log('debugFn', debugFn)
	fnString = fnString.replace(/function\(/g, '')
	fnString = fnString.replace(/^const|let|var/, '')

	let pattern = /([^ (]*)\(/
	let match = fnString.match(pattern)
	if (!match) {
    match = fnString.match(/([^ (]*)\s?=/)
	}
	if (match) {
    return match[1].trim()
	}
}


/**
 * Gets the name and kind of the given function node.
 * via https://github.com/jasnell/http2-1/blob/734ad72e3939e62bcff0f686b8ec426b8aaa22e3/tools/eslint/lib/ast-utils.js#L973
 * - `function foo() {}`  .................... `function 'foo'`
 * - `(function foo() {})`  .................. `function 'foo'`
 * - `(function() {})`  ...................... `function`
 * - `function* foo() {}`  ................... `generator function 'foo'`
 * - `(function* foo() {})`  ................. `generator function 'foo'`
 * - `(function*() {})`  ..................... `generator function`
 * - `() => {}`  ............................. `arrow function`
 * - `async () => {}`  ....................... `async arrow function`
 * - `({ foo: function foo() {} })`  ......... `method 'foo'`
 * - `({ foo: function() {} })`  ............. `method 'foo'`
 * - `({ ['foo']: function() {} })`  ......... `method 'foo'`
 * - `({ [foo]: function() {} })`  ........... `method`
 * - `({ foo() {} })`  ....................... `method 'foo'`
 * - `({ foo: function* foo() {} })`  ........ `generator method 'foo'`
 * - `({ foo: function*() {} })`  ............ `generator method 'foo'`
 * - `({ ['foo']: function*() {} })`  ........ `generator method 'foo'`
 * - `({ [foo]: function*() {} })`  .......... `generator method`
 * - `({ *foo() {} })`  ...................... `generator method 'foo'`
 * - `({ foo: async function foo() {} })`  ... `async method 'foo'`
 * - `({ foo: async function() {} })`  ....... `async method 'foo'`
 * - `({ ['foo']: async function() {} })`  ... `async method 'foo'`
 * - `({ [foo]: async function() {} })`  ..... `async method`
 * - `({ async foo() {} })`  ................. `async method 'foo'`
 * - `({ get foo() {} })`  ................... `getter 'foo'`
 * - `({ set foo(a) {} })`  .................. `setter 'foo'`
 * - `class A { constructor() {} }`  ......... `constructor`
 * - `class A { foo() {} }`  ................. `method 'foo'`
 * - `class A { *foo() {} }`  ................ `generator method 'foo'`
 * - `class A { async foo() {} }`  ........... `async method 'foo'`
 * - `class A { ['foo']() {} }`  ............. `method 'foo'`
 * - `class A { *['foo']() {} }`  ............ `generator method 'foo'`
 * - `class A { async ['foo']() {} }`  ....... `async method 'foo'`
 * - `class A { [foo]() {} }`  ............... `method`
 * - `class A { *[foo]() {} }`  .............. `generator method`
 * - `class A { async [foo]() {} }`  ......... `async method`
 * - `class A { get foo() {} }`  ............. `getter 'foo'`
 * - `class A { set foo(a) {} }`  ............ `setter 'foo'`
 * - `class A { static foo() {} }`  .......... `static method 'foo'`
 * - `class A { static *foo() {} }`  ......... `static generator method 'foo'`
 * - `class A { static async foo() {} }`  .... `static async method 'foo'`
 * - `class A { static get foo() {} }`  ...... `static getter 'foo'`
 * - `class A { static set foo(a) {} }`  ..... `static setter 'foo'`
 *
 * @param {ASTNode} node - The function node to get.
 * @returns {string} The name and kind of the function node.
 */
function getFunctionNameWithKind(node) {
  const parent = node.parent || {}
  const tokens = [];

  if (parent.type === "MethodDefinition" && parent.static) {
    tokens.push("static")
  }
  if (node.async) {
    tokens.push("async")
  }
  if (node.generator) {
    tokens.push("generator")
  }

  if (node.type === "ArrowFunctionExpression") {
    tokens.push("arrow", "function")
  } else if (parent.type === "Property" || parent.type === "MethodDefinition") {
    if (parent.kind === "constructor") {
      return "constructor"
    } else if (parent.kind === "get") {
      tokens.push("getter")
    } else if (parent.kind === "set") {
      tokens.push("setter")
    } else {
      tokens.push("method")
    }
  } else {
    tokens.push("function")
  }

  if (node.id) {
    tokens.push(`${node.id.name}`)
  } else {
    const name = getStaticPropertyName(parent)

    if (name) {
      tokens.push(`'${name}'`)
    }
  }
  return tokens.join(" ")
}

/**
 * Gets the property name of a given node.
 * The node can be a MemberExpression, a Property, or a MethodDefinition.
 *
 * If the name is dynamic, this returns `null`.
 *
 * For examples:
 *
 *     a.b           // => "b"
 *     a["b"]        // => "b"
 *     a['b']        // => "b"
 *     a[`b`]        // => "b"
 *     a[100]        // => "100"
 *     a[b]          // => null
 *     a["a" + "b"]  // => null
 *     a[tag`b`]     // => null
 *     a[`${b}`]     // => null
 *
 *     let a = {b: 1}            // => "b"
 *     let a = {["b"]: 1}        // => "b"
 *     let a = {['b']: 1}        // => "b"
 *     let a = {[`b`]: 1}        // => "b"
 *     let a = {[100]: 1}        // => "100"
 *     let a = {[b]: 1}          // => null
 *     let a = {["a" + "b"]: 1}  // => null
 *     let a = {[tag`b`]: 1}     // => null
 *     let a = {[`${b}`]: 1}     // => null
 *
 * @param {ASTNode} node - The node to get.
 * @returns {string|null} The property name if static. Otherwise, null.
 */
function getStaticPropertyName(node) {
  let prop;

  switch (node && node.type) {
      case "Property":
      case "MethodDefinition":
          prop = node.key;
          break;

      case "MemberExpression":
          prop = node.property;
          break;

      // no default
  }

  switch (prop && prop.type) {
      case "Literal":
          return String(prop.value);

      case "TemplateLiteral":
          if (prop.expressions.length === 0 && prop.quasis.length === 1) {
              return prop.quasis[0].value.cooked;
          }
          break;

      case "Identifier":
          if (!node.computed) {
              return prop.name;
          }
          break;

      // no default
  }

  return null;
}

/*
//const val = parseCode(cool)
const val = parseCode(easy)
console.log('val')
deepLog(val)
/** */

module.exports = {
  parseCode
}