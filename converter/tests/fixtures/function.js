const refValue = 'foo'
const xyz = 'bar'

/**
* This thing does xyz
* @param {string}        [fin="cool"]
* @param {object}        [api]
* @param {boolean}       [api.abc=false]
* @param {Array<string>} [api.arrayThing=["nice","cool"]]
* @param {string}        [api.awesome="chill"]
* @param {*}             [api.boss]
* @param {object}        [api.rad]
* @param {object}        [api.rad.lol]
* @param {boolean}       [api.rad.lol.cool=true]
* @param {string}        [api.rad.lol.crazy="word"]
* @param {string}        [api.rad.whatever="bar"]
* @param {*}             [api.refThing=refValue]
* @param {object}        [param3]
* @param {*}             [param3.dope]
* @param {*}             [param3.funky]
* @param {object}        [fun]
* @param {*}             [fun.bunker]
* @param {Array<string>} [fun.foo=["lol"]]
* @param {string}        [fun.what=]
* @return {object}
*/
function fuzzy(fin = 'cool', api, { funky = 'hi', dope }, fun) {
  const {
    awesome = 'chill',
    rad = { whatever: 'bar', lol: { cool: true, crazy: 'word' }},
    boss,
    abc = false,
    arrayThing = ['nice', 'cool'],
    refThing = refValue
  } = api

  console.log('awesome', awesome)
  console.log('rad', rad)
  console.log('boss', boss)
  console.log('abc', abc)
  console.log('arrayThing', arrayThing)
  console.log('refThing', refThing)

  /** @type {string} */
  const myVar = 'string';

  /** @type { "small" | "medium" | "large" } */
  const myVarTwo = 'small'

  /** @type {typeof myVarTwo} */
  const myVarThree = 'small'

  var {
    bunker,
    what = '',
    foo: asBar = ['lol'],
    ...rest
  } = fun

  // return xyz
  return {
    cool: xyz
  }
}

module.exports = fuzzy