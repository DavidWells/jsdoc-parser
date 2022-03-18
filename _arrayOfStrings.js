const deepLog = require('./test/utils/log')
const doxxx = require('./lib/dox')

let codeTwo = `
import React, { Component } from 'react'

/**
 * Renders a <Button /> component
 * @param {Array.<string>}
 * @return {React.ReactElement} - React component
 */
export default function ButtonTwo(props = {}) {
  return (
    <button>{props.text || 'my button'}</button>
  )
}
`

codeTwo = `
/**
 * TypeScript style
 * @type {Rgb[]}
 */
const color2 = [{ red: 111, green: 111, blue: 111 }];
`

deepLog(doxxx.parseComments(codeTwo))
