const { getImports, getStaticImports, getDynamicImports } = require('./get-imports')
const { getRequires, getStaticRequires, getDynamicRequires } = require('./get-requires')

// Alt approach import parseImports from 'parse-imports'
// https://github.com/ganeshkbhat/get-imports/blob/main/index.js
// Alt get imports https://github.com/beenotung/fix-esm-import-path/blob/master/fix-esm-import-path.js#L186

function extractDeps(code) {
  const imports = getImports(code)
  const requires = getRequires(code)
  return { imports, requires }
}

if (require.main === module) {
  const code = `
  const { test : testTwo, lol: lolTwo } = require('uvu')
  const assert = require('uvu/assert')
  import { test } from 'uvu'
  import assert from 'uvu/assert'
  import { test } from 'uvu'
  `
  const { imports, requires } = extractDeps(code)

  function logDefinitions(item) {
    console.log(item)
    const definitions = item.definitions[0].destructuredParameters
    console.log(definitions)
  }

  imports.forEach(logDefinitions)
  requires.forEach(logDefinitions)
}

module.exports = {
  extractDeps,
  /* Requires */
  getRequires,
  getDynamicRequires,
  getStaticRequires,
  /* Imports */
  getImports,
  getStaticImports,
  getDynamicImports,
}