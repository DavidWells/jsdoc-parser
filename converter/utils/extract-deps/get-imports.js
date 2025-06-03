const { isRelativeImport, isRelativeImportWithQuotes, getNames } = require('./utils')

// https://regex101.com/r/cfEmlm/1
const IMPORT_REGEX = /import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s](.*[@\w_-]+)["'\s]+;?$/gm
// https://regex101.com/r/UDmXlb/1
const IMPORT_TYPE_REGEX = /import\(['"](.*)['"]\)\.?([A-Za-z_0-9.]*)?/gm
// https://regex101.com/r/UDjMoV/1
const DYNAMIC_IMPORT_REGEX = /(?:(const|var|let)\s+([\w*{}\n\r\t,:= ]+)\s*=\s*)?await\s+import\(([^()]+(?:\([^()]*\)[^()]*)*)\)/gm

function getImports(code) {
  const staticImports = getStaticImports(code)
  const dynamicImports = getDynamicImports(code)
  return staticImports.concat(dynamicImports).sort((a, b) => a.index - b.index)
}

// https://regex101.com/r/cfEmlm/1
function getStaticImports(targetText = '') {
  let importStatements = []
  var result;
  while((result = IMPORT_REGEX.exec(targetText)) !== null) {
    const [ line, names, from ] = result
    const namesValues = (names || '').trim()
    importStatements.push({ 
      line,
      varType: 'const',
      varName: namesValues,
      definitions: getNames(namesValues),
      from,
      index: result.index,
      isImport: true,
      isRelative: isRelativeImport(from)
    })
  }
  return importStatements
}

function getTypeImports(targetText = '') {
  let importStatements = []
  var result;
  while((result = IMPORT_TYPE_REGEX.exec(targetText)) !== null) {
    const [ importStatement, importPath, importName ] = result
    // console.log('result', result)
    importStatements.push({
      importStatement,
      importPath,
      importName: (importName || '').trim(),
      index: result.index,
      isImport: true,
      isRelative: isRelativeImport(importPath)
    })
  }
  return importStatements
}

function getDynamicImports(targetText = '') {
  let importStatements = []
  var result;
  while((result = DYNAMIC_IMPORT_REGEX.exec(targetText)) !== null) {
    const [ line, varType, names, from ] = result
    let namesValues = (names || '').trim()
    
    importStatements.push({
      line,
      varType: varType || '',
      varName: namesValues,
      definitions: names ? getNames(namesValues) : [],
      from: from.trim(),
      index: result.index,
      isImport: true,
      isRelative: isRelativeImport(from) || isRelativeImportWithQuotes(from),
      isDynamic: true
    })
  }
  return importStatements
}

if(require.main === module) {
  const code = `
import {
  Component
} from '@angular2/core';
import defaultMember from "module-name";
import   *    as name from "module-name  ";
import   React from react"
import   {  member }   from "  module-name";
import { member as alias } from "module-name";
import { member1 , 
member2 } from "module-name";
import { member1 , member2 as alias2 , member3 as alias3 } from "module-name";
import defaultMember, { member, member } from "module-name";
import defaultMember, * as name from "module-name";
import "module-name";
import * from './smdn';
  `

const dynamicCode = `
// Basic dynamic import
const module = await import('./module.js')

// With variable
const moduleName = './utils.js'
const utils = await import(moduleName)

// With template literals
const folder = 'components'
const component = await import(\`./src/$\{folder}/Button.js\`)

// With path building
const modulePath = path.join('./src', 'helpers', 'api.js')
const api = await import(modulePath)

// Destructuring
const { default: Component, helper } = await import('./Component.js')

// Variable assignment
const dynamicModule = await import(getModulePath())
`
  const dynamicImports = getDynamicImports(dynamicCode)
  dynamicImports.forEach(item => console.log(item))

  /*
  const imports = getStaticImports(code)
  imports.forEach(item => console.log(item))
  /** */
}

module.exports = {
  getImports,
  getStaticImports,
  getTypeImports,
  getDynamicImports
}