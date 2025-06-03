const { inspectParameters, getParametersNames } = require('inspect-parameters-declaration')

function isRelativeImport(importLocation) {
  return !!importLocation.match(/^\./)
}

function isRelativeImportWithQuotes(importLocation) {
  // TODO harden for "${" or " + 'var' + "
  return !!importLocation.match(/[`"']\./) 
    && importLocation.indexOf('${') === -1  // No template literals
    && importLocation.indexOf(' + ') === -1 // No string concatenation
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


module.exports = {
  isRelativeImport,
  isRelativeImportWithQuotes,
  getNames
}