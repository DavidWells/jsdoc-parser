const { inspect } = require('util')
const doxxx = require('../../lib/dox')

const code = `

//*****

/** */

//*

/* single star */

/** x */

/** tag here */

/**
 *
 * @param {number|string|{name:string,age:number}} a
 * @param {number|{name:string,age:number}|Array} b
 * @returns {{name:string,age:number}}
 */
function complexTypeParamAndReturn(a, b) {
  //*
  console.log('test')
  /****** *****/
  return {
    name: 'Test',
    age: 30
  }
}
`

function deepLog(x) {
  console.log(inspect(x, {showHidden: false, depth: null}))
}


deepLog(doxxx.parseComments(code))

//*
console.log('test')
/****** */
