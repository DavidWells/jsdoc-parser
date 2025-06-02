const refValue = 'foo'
const xyz = 'bar'
/**
* This thing does xyz
* @param {string}   [fin="cool"]
* @param {object}   [api]
* @param {boolean}  [api.abc=false]
* @param {string[]} [api.arrayThing=["nice","cool"]]
* @param {string}   [api.awesome="chill"]
* @param {*}        [api.boss]
* @param {object}   [api.rad]
* @param {object}   [api.rad.lol]
* @param {boolean}  [api.rad.lol.cool=true]
* @param {string}   [api.rad.whatever="bar"]
* @param {*}        [api.refThing]
* @param {object}   [param2]
* @param {*}        [param2.dope]
* @param {*}        [param2.funky]
* @param {object}   [fun]
* @param {*}        [fun.bunker]
* @param {string[]} [fun.foo=["lol"]]
* @param {string}   [fun.what=""]
* @return {object}
*/
function fuzzy(fin = 'cool', api, { funky, dope }, fun) {
// function cool(api) {
  const {
    awesome = 'chill',
    rad = { whatever: 'bar', lol: { cool: true, crazy: 'word' }},
    boss,
    abc = false,
    arrayThing = ['nice', 'cool'],
    refThing = refValue
  } = api

  /** @type {string} */
  const myvar = 'string';

  /** @type { "small" | "medium" | "large" } */
  const myvarTwo = 'small'

  /** @type {typeof myvarTwo} */
  const myvarThree = 'small'

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

module.exports = cool