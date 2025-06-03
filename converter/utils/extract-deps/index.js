const { getImports, getDynamicImports } = require('./get-imports')
const { getRequires, getDynamicRequires } = require('./get-requires')

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
  const { test } = require('uvu')
  const assert = require('uvu/assert')
  import { test } from 'uvu'
  import assert from 'uvu/assert'
  import { test } from 'uvu'
  `
  const { imports, requires } = extractDeps(code)
  console.log('imports', imports)
  console.log('requires', requires)
}

module.exports = {
  extractDeps,
  getRequires,
  getDynamicRequires,
  getStaticRequires,
  getImports,
  getStaticImports,
  getDynamicImports,
}