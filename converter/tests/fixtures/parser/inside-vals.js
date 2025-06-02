
const hi = 'yo'
/**
* This thing does xyz
* @param {string}   [fin="cool"]
*/
function internal(bongo, fin = 'cool', api, { wow, lol }, lastArg) {
  const {
    awesome = 'chill',
    rad = { whatever: 'bar', cool: { fun: 'stuff' }, x: hi },
    boss,
  } = api

  const [wooo, boom = true, bop = 'zip'] = lastArg

  return {
    bobby: 'james'
  }
}