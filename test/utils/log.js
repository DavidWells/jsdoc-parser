const { inspect } = require('util')

function deepLog(x) {
  console.log(inspect(x, {showHidden: false, depth: null}))
}

module.exports = deepLog