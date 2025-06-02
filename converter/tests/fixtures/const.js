const refValue = 'foo'
const xyz = 'bar'

/**
* This thing does xyz
* @param {string} [a="cool"]
* @param {*}      b
* @param {object} [param2]
* @param {*}      [param2.dope]
* @param {*}      [param2.funky]
* @param {*}      c
* @return {object}
*/
const fuzz = (a = 'cool', b, { funky, dope }, c) => {
// function cool(api) {
  const {
    awesome = 'chill',
    rad = { whatever: 'bar', lol: { cool: true }},
    boss,
    abc = false,
    arrayThing = ['nice', 'cool'],
    refThing = refValue
  } = b

  var {
    bunker,
    what = '',
    foo: asBar = ['lol'],
    ...rest
  } = c

  // return xyz
  return {
    cool: xyz
  }
}

module.exports.bar = fuzz