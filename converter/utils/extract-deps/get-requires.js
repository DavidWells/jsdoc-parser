const { isRelativeImport, getNames } = require('./utils')

// https://regex101.com/r/sR1TIP/2
const REQUIRE_REGEX = /(const|var|let)(?:["'\s]*([\w*{}:=\n\r\t,:= ]+)\s*=\s*require\(\s*)?["'\s](.*[@\w_-]+)["'\s]+\);?$|require\(["'\s](.*[@\w_-]+)["'\s]\)/gm
// https://regex101.com/r/kZ5xCk/3
const DYNAMIC_REQUIRE_REGEX = /(?:(const|var|let)\s+([\w*{}\n\r\t,:= ]+)\s*=\s*)?require\(([^()'"]+(?:\([^()]*\)[^()'"]*)*)\)/gm

function getDynamicRequires(code) {
  const results = []
  let match
  
  while ((match = DYNAMIC_REQUIRE_REGEX.exec(code)) !== null) {
    const [line, varType, names, from] = match
    /*
    console.log('line', line)
    console.log('varType', varType)
    console.log('names', names || 'no names')
    console.log('from', from)
    /** */
    let namesValues = (names || '').trim()
    
    results.push({
      line,
      varType: varType || '',
      varName: namesValues,
      definitions: names ? getNames(namesValues) : [],
      from: from.trim(),
      index: match.index,
      isRequire: true,
      isRelative: false,
      isDynamic: true
    })
  }
  
  return results
}

// https://regex101.com/r/sR1TIP/1
function getStaticRequires(targetText = '') {
  let requireStatements = []
  var result;
  while((result = REQUIRE_REGEX.exec(targetText)) !== null) {
    const [ line, varType, names, from, fromTwo ] = result
    // console.log('getStaticRequires result', result)
    const importLocation = from || fromTwo
    const importItems = (names || '').trim()
    requireStatements.push({
      line,
      varType: varType || '',
      varName: importItems,
      definitions: getNames(importItems),
      from: importLocation,
      index: result.index,
      isRequire: true,
      isRelative: isRelativeImport(importLocation),
      isDynamic: false
    })
  }

  return requireStatements
}

function getRequires(code) {
  const staticRequires = getStaticRequires(code)
  const dynamicRequires = getDynamicRequires(code)
  return staticRequires.concat(dynamicRequires).sort((a, b) => a.index - b.index)
}

if (require.main === module) {
  const code = `
  const moduleName = 'fs'
  const dynamicRequire = require(moduleName)
  const path = require('path')
  const relative = require('./relative')
  const dynamicPath = require(path.join(__dirname, 'utils'))
  const foo = require('foo-pkg')
  require(\`./$\{folder}/file\`)
  const { test : funky, foo = false } = require(moduleTwo)
  `

  //*
  const dynamicRequires = getDynamicRequires(code)
  dynamicRequires.forEach(item => console.log(item))
  /** */


  //*
  const requires = getStaticRequires(code)
  console.log('requires', requires)
  /** */
}

module.exports = {
  getRequires,
  getStaticRequires,
  getDynamicRequires,
}