const { parseCode } = require('./code-to-jsdoc')
const { inspectParameters, getParametersNames } = require('inspect-parameters-declaration')
const util = require('util')

function deepLog(myObject) {
  console.log(util.inspect(myObject, {showHidden: false, depth: null, colors: true}))
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
function cool(api, { funky, dope }, fun) {
  const {
    awesome = 'chill',
    rad = { whatever: 'bar', lol: { cool: true }},
    boss,
    abc = false,
    arrayThing = ['nice', 'cool'],
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

let codeToParse = cool.toString()
if (typeof codeToParse === 'string') {
  var args = /\(\s*([^)]+?)\s*\)/.exec(codeToParse)
  if (args[1]) {
    // args = args[1].split(/\s*,\s*/);
    codeToParse = args[1]
  }
}

const fnParams = inspectParameters(codeToParse).map((x, i) => {
  return { 
    ...x, 
    position: i,
    paramPlaceholder: `param${i}`
  }
})
const fnParamNames = getParametersNames(codeToParse)
console.log('fnParamNames', fnParamNames)
console.log('fnParams')
deepLog(fnParams)
process.exit(1)

//*
parseCode(codeToParse)
/** */