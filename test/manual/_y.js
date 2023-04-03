const { inspect } = require('util')
const doxxx = require('../../lib/dox')

function deepLog(x) {
  console.log(inspect(x, {showHidden: false, depth: null}))
}

const codeTwo = `
import React, { Component } from 'react'

/**
 * MyDivComponent component props
 * @typedef CustomProps
 * @prop {string} [text] - My button
 */

/**
 * HTML div attributes + custom props
 * @typedef {React.HTMLAttributes<HTMLDivElement> & CustomProps} Props
 */

/**
 * Renders a <MyDivComponent /> component
 * @param {Props} props
 * @return {React.ReactElement} - React component
 * @example
    <MyDivComponent className='cool'>
      Words
    </MyDivComponent>
 */
export default function MyDivComponent({
  text = 'my div',
  ...props
}) {
  return (
    <div {...props}>
      {text}
    </div>
  )
}
`

deepLog(doxxx.parseComments(codeTwo))
