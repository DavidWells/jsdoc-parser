// 1 anon default export inline assignment
module.exports = () => {}

// 2 anon named export inline assignment
module.exports.arrowFn = () => {}

// 3 anon named export with anon function with params inline assignment
module.exports.anonFn = function(x, y) {
  console.log('anonFn body')
}

// 4 named export with async keyword and params inline assignment
module.exports.asyncFn = async function foo (x, y) {
  console.log('anonFn body')
}

// 5 named export with params inline assignment
module.exports.normalFn = function xyz(a, b) {
  console.log('body')
}

// 6 default export with params
export default function ButtonTwo(props = {}) {
  return (
    <button>{props.text || 'my button'}</button>
  )
}

// 7 simple functions
function awesome(one, two) {
  const a = (y, x)
}

// 8
function fuzzy(fin = 'cool', api, { funky, dope }, fun) {

}

// 9
export async function coolio(rad) {

}

// 10
var a = function bar() {

}
a.displayName = 'bro';

// 11
/**
* This thing does xyz
* @param {string}   [fin="cool"]
*/
function internal(fin = 'cool', api, { wow, lol }, lastArg) {
  const {
    awesome = 'chill',
    rad = { whatever: 'bar', cool: { fun: 'stuff' } },
    boss,
  } = api

  return {
    bobby: 'james'
  }
}

// 12
{
  function fnInsideBrackets(one, two) {
    const { a, b } = one
    console.log('fnInsideBrackets') 
  }
}

// 13
module.exports = 
  () => {}

// 14 iife 
;(function iife(param1 = 'radDefault', param2) {
  console.log('iife')
})()

// Export awesome as new fn name
export { awesome as renamedFunction }
