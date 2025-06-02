const lebab = require('lebab')

/* 
Options https://github.com/lebab/lebab/blob/master/types/index.d.ts
"class",
"template",
"arrow",
"arrow-return",
"let",
"default-param",
"destruct-param",
"arg-spread",
"arg-rest",
"obj-method",
"obj-shorthand",
"no-strict",
"commonjs",
"exponent",
"multi-var",
"for-of",
"for-each",
"includes",
*/

function transform(codeString) {
  let es6 = codeString
  try {
    es6 = lebab.transform(codeString, ["commonjs"])
  } catch (e) {
    console.log('ERROR: ES6 converter error')
    console.log(e.message)
  }
  return es6
}

module.exports = {
  transform
}