import { test } from 'uvu'
import doxxx from '../lib/dox'
import * as assert from 'uvu/assert'

const emptyCode = ``

test('Parses empty code ok', async () => {
  const result = doxxx.parseComments(emptyCode)
  assert.equal(result, [])
})

test.run()