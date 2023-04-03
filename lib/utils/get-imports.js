// Alt approach import parseImports from 'parse-imports'

const IMPORT_REGEX = /import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s](.*[@\w_-]+)["'\s]+;?$/gm
const REQUIRE_REGEX = /(?:const|var|let)(?:["'\s]*([\w*{}\n\r\t, ]+)\s*=\s*require\(\s*)?["'\s](.*[@\w_-]+)["'\s]+\);?$|require\(["'\s](.*[@\w_-]+)["'\s]\)/gm
const IMPORT_TYPE_REGEX = /import\(['"](.*)['"]\)\.?([A-Za-z_0-9.]*)?/gm
const MODULE_IMPORT = /module:([^)]*)\)\.?([A-Za-z_0-9.]*)?/gm
// Alt get imports https://github.com/beenotung/fix-esm-import-path/blob/master/fix-esm-import-path.js#L186

function isRelativeImport(importLocation) {
  return !!importLocation.match(/^\./)
}

// https://regex101.com/r/sR1TIP/1
function getRequires(targetText) {
  let importStatements = []
  var result;
  while((result = REQUIRE_REGEX.exec(targetText)) !== null) {
    const [ line, names, from, fromTwo ] = result
    const importLocation = from || fromTwo
    let importItems = (names || '').trim()
    if (importItems.indexOf('\n') > -1 && importItems.indexOf('{') === -1) {
      // get last line
      importItems = (importItems.match(/.*$/) || [''])[0].trim()
    }
    importStatements.push({
      line, 
      names: importItems,
      from: importLocation,
      index: result.index,
      isRequire: true,
      isRelative: isRelativeImport(importLocation)
    })
  }
  return importStatements
}

// https://regex101.com/r/cfEmlm/1
function getImports(targetText) {
  let importStatements = []
  var result;
  while((result = IMPORT_REGEX.exec(targetText)) !== null) {
    const [ line, names, from ] = result
    importStatements.push({ 
      line: (line || '').trim(),
      names: (names || '').trim(), 
      from,
      index: result.index,
      isImport: true,
      isRelative: isRelativeImport(from)
    })
  }
  return importStatements
}

function getTypeImports(targetText) {
  let importStatements = []
  var result;
  // (module:path/to/file.js).foo

  while((result = IMPORT_TYPE_REGEX.exec(targetText)) !== null) {
    const [ importStatement, importPath, importName ] = result
    // console.log('result', result)
    importStatements.push({
      importStatement,
      importPath,
      // TODO add resolved file path with passed in filePath opt
      importName: (importName).trim(),
      index: result.index,
      isImport: true,
      isRelative: isRelativeImport(importPath)
    })
  }

  while((result = MODULE_IMPORT.exec(targetText)) !== null) {
    const [ importStatement, importPath, importName ] = result
    // console.log('result', result)
    importStatements.push({
      importStatement,
      importPath,
      importName: (importName).trim(),
      index: result.index,
      isImport: true,
      isRelative: isRelativeImport(importPath),
      isModule: true,
    })
  }

  return importStatements
}

module.exports = {
  getRequires,
  getImports,
  getTypeImports
}