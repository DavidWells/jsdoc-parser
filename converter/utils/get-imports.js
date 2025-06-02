// Alt approach import parseImports from 'parse-imports'
// https://github.com/ganeshkbhat/get-imports/blob/main/index.js
// Alt get imports https://github.com/beenotung/fix-esm-import-path/blob/master/fix-esm-import-path.js#L186
const { inspectParameters, getParametersNames } = require('inspect-parameters-declaration')

const IMPORT_REGEX = /import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s](.*[@\w_-]+)["'\s]+;?$/gm
const REQUIRE_REGEX = /(?:const|var|let)(?:["'\s]*([\w*{}:=\n\r\t, ]+)\s*=\s*require\(\s*)?["'\s](.*[@\w_-]+)["'\s]+\);?$|require\(["'\s](.*[@\w_-]+)["'\s]\)/gm
const IMPORT_TYPE_REGEX = /import\(['"](.*)['"]\)\.?([A-Za-z_0-9.]*)?/gm


function isRelativeImport(importLocation) {
  return !!importLocation.match(/^\./)
}

// https://regex101.com/r/sR1TIP/1
function getRequires(targetText = '') {
  let importStatements = []
  var result;
  while((result = REQUIRE_REGEX.exec(targetText)) !== null) {
    const [ line, names, from, fromTwo ] = result
    const importLocation = from || fromTwo
    let importItems = (names || '').trim()
    const opensWithBracket = importItems.indexOf('{') === -1
    if (importItems.indexOf('\n') > -1 && opensWithBracket) {
      // get last line
      importItems = (importItems.match(/.*$/) || [''])[0].trim()
    }
    importStatements.push({
      line,
      name: importItems,
      definitions: getNames(importItems),
      from: importLocation, 
      index: result.index,
      isRequire: true,
      isRelative: isRelativeImport(importLocation)
    })
  }
  return importStatements
}

function getNames(names = []) {
  return inspectParameters(names).map((item) => {
    item.name = item.parameter
    if (item.destructuredParameters && item.destructuredParameters.length > 0) {
      item.destructuredParameters = item.destructuredParameters.map((details) => {
        if (details.parameter.indexOf(':') > -1) {
          const [ name, alias ] = details.parameter.replace(/^{/, '').replace(/}$/, '').split(':')
          details.name = name.trim()
          details.alias = alias.trim()
          delete details.parameter
          return details
        }
        if (details.declaration.indexOf(' as ') > -1) {
          const [ parameter, alias ] = details.declaration.split(' as ')
          details.name = parameter.trim()
          details.alias = alias.trim()
          delete details.parameter
          return details
        }
        details.name = details.parameter
        delete details.parameter
        return details
      })
    }

    if (item.name.indexOf('{') === -1 && item.parameter.indexOf(' as ') > -1) {
      const [ parameter, alias ] = item.parameter.split(' as ')
      item.name = parameter.trim()
      item.alias = alias.trim()
    }

    delete item.parameter

    return item
  })
}

// https://regex101.com/r/cfEmlm/1
function getImports(targetText = '') {
  let importStatements = []
  var result;
  while((result = IMPORT_REGEX.exec(targetText)) !== null) {
    const [ line, names, from ] = result
    const namesValues = (names || '').trim()
    importStatements.push({ 
      line,
      name: namesValues,
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

module.exports = {
  getRequires,
  getImports,
  getTypeImports
}