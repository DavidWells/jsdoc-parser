const deepLog = require('./test/utils/log')
const doxxx = require('./lib/dox')

const tsImport = `
import React from 'react'

/**
 * Renders a <ButtonImport /> component with imported types
 * @param { import("./_types-array").Chill } isChill
 * @return {React.ReactElement} - React component
 */
export default function ButtonImport(props) {
  return (
    <button>
      {props.message || 'my button'}
    </button>
  )
}
`

deepLog(doxxx.parseComments(tsImport))
