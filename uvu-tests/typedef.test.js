const { test } = require('uvu')
const assert = require('uvu/assert')
const doxxx = require('../lib/dox')
const deepLog = require('../test/utils/log')

test('Add type if singular typedef', async () => {
  const code = `
/**
 * Allowed file syntaxes
 * @typedef {'md' | 'js' | 'yml' | 'yaml'} SyntaxType
 */
`
  const result = doxxx.parseComments(code)
  /*
  deepLog(result)
  /** */
  assert.equal(result[0].type, 'SyntaxType')
})


test('Add type with multiple blocks', async () => {
const codeTwo = `
/**
 * Allowed file syntaxes
 * @typedef {'md' | 'js' | 'yml' | 'yaml'} SyntaxType
 * @param {string}  name - x
 */

/**
 * Configuration for markdown magic
 * 
 * Below is the main config for markdown magic
 * @typedef {object} MarkdownMagicOptions
 * @property {Array} [transforms = defaultTransforms] - Custom commands to transform block contents, see transforms & custom transforms sections below.
 * @property {string} [outputDir] - Change output path of new content. Default behavior is replacing the original file
 * @property {SyntaxType} [syntax = 'md'] - Syntax to parse
 * @property {string} [open] - Opening match word
 * @property {string} [close] - Closing match word. If not defined will be same as opening word.
 * @property {string} [cwd] - Current working directory. Default process.cwd()
 * @property {boolean} [outputFlatten] - Flatten files that are output
 * @property {function} [handleOutputPath] - Custom function for altering output paths
 * @property {boolean} [useGitGlob] - Use git glob for LARGE file directories
 * @property {boolean} [dryRun = false] - See planned execution of matched blocks
 * @property {boolean} [debug = false] - See debug details
 * @property {boolean} [failOnMissingTransforms = false] - Fail if transform functions are missing. Default skip blocks.
 */
`
  const result = doxxx.parseComments(codeTwo, {raw: false})
  /*
  deepLog(result)
  process.exit(1)
  /** */
  assert.equal(result[0].type, 'SyntaxType')
  assert.equal(result[0].description.text, 'Allowed file syntaxes')
  assert.equal(result[1].type, 'MarkdownMagicOptions')
  assert.equal(result[1].description.text, `
Configuration for markdown magic

Below is the main config for markdown magic`.trim())
})

test('Add type with multiple blocks @typedef {object}', async () => {
const codeThree = `
import React, { Component } from 'react'

/**
 * @typedef {object} Props - component props
 * @ignore
 * @prop {string} [text] - My button
 * @prop {string} [textColor] - the color of the text in the button
 * @prop {string} [bgColor] - the background color of the button
 * @prop {React.CSSProperties} [overrideStyles] - used to set the CSS of the button
 * @prop {()=>void} [onLogin]
 */

/**
 * Renders a <Button /> component
 * 
 * Lol hi hi hi
 * @param {Props} props
 * @return {React.ReactElement} - React component
 */
export default function ButtonTwo(props = {}) {
  return (
    <button>{props.text || 'my button'}</button>
  )
}
`
  const comments = doxxx.parseComments(codeThree)
  //*
  deepLog(comments)
  /** */
  assert.equal(comments[0].type, 'Props')
  assert.equal(comments[0].description.text, 'component props')
})


test.run()