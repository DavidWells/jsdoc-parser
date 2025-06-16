const getDiff = require('get-object-diff')
const assert = require('uvu/assert')

function assertNoDiffs(origObj, newObj) {
  let error = ''
  // Handle arrays of objects
  if (Array.isArray(origObj) && Array.isArray(newObj)) {
    assert.equal(origObj.length, newObj.length, 'arrays have same length')
    for (let i = 0; i < origObj.length; i++) {
      const diff = getDiff(origObj[i], newObj[i])
      if (diff && Object.keys(diff).length > 0) {
        error += `newObj has diff at index ${i}\n`
        error += JSON.stringify(diff, null, 2) + '\n'
      }
      assert.equal(error, '', `testStub and testResult objects are equal`)
    }
    return
  }

  // Handle single objects
  const diff = getDiff(origObj, newObj)
  if (diff && Object.keys(diff).length > 0) {
    console.log('───────────────────────────────')
    console.log('Object has diff')
    console.log(diff)
    console.log('───────────────────────────────')
  }
  assert.equal(diff, {}, 'objects are equal')
}

module.exports = assertNoDiffs