// https://github.com/ritz078/transform/blob/55585e8220fe3b431a47a19ff022aea409db212a/assets/vendor/json-to-jsdoc.js
   
function checkIfNeededToAddUndefinedType(obj, objectKey) {
  const temporaryObject = {}
  let maxLenghtOfObject = 0

  Object.keys(obj).forEach(currentKey => {
    // check if it's our Object,
    // like awards.editions in awards.editions.outcome
    if (currentKey.includes(objectKey) && currentKey !== objectKey) {
      temporaryObject[currentKey] = obj[currentKey]
    }
  })

  // We need to check the local maximum
  Object.keys(temporaryObject).forEach(key => {
    const currentKeyLength = temporaryObject[key].length

    if (currentKeyLength > maxLenghtOfObject)
      maxLenghtOfObject = currentKeyLength
  })

  // If the maximum is bigger than the current value,
  // but only one child in, we can also have an undefined.
  Object.keys(temporaryObject).forEach(key => {
    if (key.split(".").length < 2) {
      if (maxLenghtOfObject > temporaryObject[key].length) {
        this[key].push("undefined")
      }
    }
  })
}

function keepUniqueTypes(obj, jsonObjects) {
  const temporaryObject = obj
  const remainingObject = {}
  const numberOfJSONDefinitions = jsonObjects.length

  Object.keys(obj).forEach(objectKey => {
    if (!objectKey.includes(".")) {
      if (obj[objectKey].length < numberOfJSONDefinitions) {
        temporaryObject[objectKey].push("undefined")
      }
    }

    obj[objectKey].forEach(anyValue => {
      if (anyValue === "object" || anyValue === "object[]") {
        checkIfNeededToAddUndefinedType.bind(temporaryObject, obj, objectKey)()
      }
    })
  })

  Object.keys(temporaryObject).forEach(key => {
    remainingObject[key] = getUnique(temporaryObject[key])
  })

  return remainingObject
}

/**
 * @param {Array} array - The array that needs to be ded-duplicated
 * @returns {Array}
 */
function getUnique(array) {
  const u = {}
  const a = []
  for (let i = 0, l = array.length; i < l; ++i) {
    if (u.hasOwnProperty(array[i])) continue
    a.push(array[i])
    u[array[i]] = 1
  }
  return a
}

/**
 * @param {*} value
 * @returns {string} currentType - lowerCased type of value
 */
function getTypeOfValue(value) {
  let currentType = Object.prototype.toString
    .call(value)
    .split(" ")[1]
    .slice(0, -1)
    .toLowerCase()

  if (!currentType) currentType = "*"

  return currentType[0].toUpperCase() + currentType.substr(1)
}
/**
 * @param {Array} array - The array that we want to parse
 * @param {string} objectName - Usually the Prefix - Root do no have ObjectName
 */
function parseArray(array, objectName) {
  const currentArrayTypes = []
  const prefix = objectName ? `${objectName}` : ""

  // If array is empty set to ANY
  if (!array.length) {
    currentArrayTypes.push(`Array`)
  }
  // console.log('parse array')
  array.forEach(currentValue => {
    currentArrayTypes.push(`${getTypeOfValue(currentValue)}[]`)
  })

  if (!(objectName in this)) this[objectName] = []
  this[objectName].push(getUnique(currentArrayTypes).join("|"))

  array.forEach(currentValue => {
    const currentValueType = getTypeOfValue(currentValue)
    // console.log('currentValueType', currentValueType)
    if (currentValueType === "array") {
      parseArray.bind(this, currentValue, prefix)()
    } else if (currentValueType === "object") {
      parseObject.bind(this, currentValue, prefix, true)()
    }
  })
}
/**
 * @param {object} obj - The object that we want to parse
 * @param {string} objectName - Usually the Prefix - Root do no have ObjectName
 * @param {boolean} doNotReinsert - If we want to reinsert the type, usually when we parse
 * an array of objects, we do not want to reinsert.
 */
function parseObject(obj, objectName, doNotReinsert = false) {
  const prefix = objectName ? `${objectName}.` : ""

  // Root Object don't have a objectName
  if (!doNotReinsert && objectName) {
    if (!(objectName in this)) this[objectName] = []
    // Insert root object name at the top
    this[objectName].push("Object")
  }

  Object.keys(obj).forEach((propertyName) => {
    const currentValue = obj[propertyName]
    const propertyType = getTypeOfValue(currentValue)
    const currentPrefix = `${prefix}${propertyName}`
    let result = null
    console.log(`propertyType ${propertyName}`, propertyType)
    // If it's Array, we need the values inside.
    if (propertyType === "array" || propertyType === "Array") {
      parseArray.bind(this, currentValue, currentPrefix)()
    } else if (propertyType === "object" || propertyType === "Object") {
      parseObject.bind(this, currentValue, currentPrefix)()
    } else {
      result = propertyType
      if (!(currentPrefix in this)) this[currentPrefix] = []
      this[currentPrefix].push(result)
    }
  })

}

function ParseRootDefinition(obj) {
  // 1. What is the default type for our Definition?
  const jsonType = typeof obj
  console.log('jsonType', jsonType)

  if (jsonType === "array") parseArray.bind(this, obj)()
  else if (jsonType === "object") parseObject.bind(this, obj)()
}

/**
 * @param {Object} obj
 * @param {Object[]} jsonObjects
 */
function printTheTypeDef(obj, jsonObjects) {
  let output = ""
  // 0. A default name for our Definition
  const jsonDef = "json"
  const jsonTypes = []
  const leading = ' '

  Object.keys(jsonObjects).forEach(key => {
    jsonTypes.push(getTypeOfValue(jsonObjects[key]))
  })

  output = `/** 
${leading}* @typedef {${getUnique(jsonTypes)}} ${jsonDef} \n`

  Object.keys(obj).forEach((key) => {
    console.log('key', key)
    output += ` * @property {${obj[key].join("|")}} ${key} \n`
  })

  output += `${leading}*/`

  return output
}

/**
 * @param {Array} jsonObjects
 */
function goThroughAndParse(jsonObjects) {
  const theObjectDefinition = {}

  jsonObjects.forEach(obj =>
    ParseRootDefinition.bind(theObjectDefinition, obj)()
  )

  return printTheTypeDef(
    keepUniqueTypes(theObjectDefinition, jsonObjects),
    jsonObjects
  )
}

function convert(val) {
  const jsonObjects = []

  const json = (typeof val === 'object') ? JSON.stringify(val) : val

  jsonObjects.push(JSON.parse(json))
  return goThroughAndParse(jsonObjects)
}

module.exports = convert