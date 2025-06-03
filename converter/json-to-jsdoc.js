const {comparators, composeComparators} = require('generate-comparators');

const { UNKNOWN_VALUE, UNKNOWN_REFERENCE } = require('./_constants')
// Generate data from types https://github.com/deanshub/data-from-types

function checkIfNeededToAddUndefinedType(obj, objectKey) {
  const temporaryObject = {};
  let maxLengthOfObject = 0;

  Object.keys(obj).forEach(currentKey => {
    // check if it's our Object,
    // like awards.editions in awards.editions.outcome
    if (currentKey.includes(objectKey) && currentKey !== objectKey) {
      temporaryObject[currentKey] = obj[currentKey];
    }
  })

  // We need to check the local maximum
  Object.keys(temporaryObject).forEach(key => {
    const currentKeyLength = temporaryObject[key].length;

    if (currentKeyLength > maxLengthOfObject)
      maxLengthOfObject = currentKeyLength;
  })

  // If the maximum is bigger than the current value,
  // but only one child in, we can also have an undefined.
  Object.keys(temporaryObject).forEach(key => {
    if (key.split(".").length < 2) {
      if (maxLengthOfObject > temporaryObject[key].length) {
        this[key].push("undefined");
      }
    }
  })
}

function keepUniqueTypes(obj, jsonObjects) {
  const temporaryObject = obj;
  const remainingObject = {};
  const numberOfJSONDefinitions = jsonObjects.length;

  Object.keys(obj).forEach((objectKey) => {
    if (!objectKey.includes(".")) {
      if (obj[objectKey].length < numberOfJSONDefinitions) {
        temporaryObject[objectKey].push("undefined");
      }
    }

    obj[objectKey].forEach(anyValue => {
      if (anyValue === "object" || anyValue === "object[]") {
        checkIfNeededToAddUndefinedType.bind(temporaryObject, obj, objectKey)();
      }
    });
  });

  Object.keys(temporaryObject).forEach(key => {
    remainingObject[key] = getUnique(temporaryObject[key]);
  });

  return remainingObject;
}

/**
 * @param {Array} array - The array that needs to be ded-duplicated
 * @returns {Array}
 */
function getUnique(array) {
  const u = {};
  const a = [];
  for (let i = 0, l = array.length; i < l; ++i) {
    if (u.hasOwnProperty(array[i])) continue;
    a.push(array[i]);
    u[array[i]] = 1;
  }
  return a;
}

/**
 * @param {*} value
 * @returns {string} currentType - lowerCased type of value
 */
function getTypeOfValue(value) {
  if (value === UNKNOWN_VALUE) {
    return '*'
  }
  if (typeof value === 'string' && value.startsWith('__unknown__ref')) {
    return value
  }
  let currentType = Object.prototype.toString
    .call(value)
    .split(" ")[1]
    .slice(0, -1)
    .toLowerCase();

  if (!currentType) currentType = "*";
  return currentType;
}
/**
 * @param {Array} array - The array that we want to parse
 * @param {string} objectName - Usually the Prefix - Root do no have ObjectName
 */
function parseArray(array, objectName) {
  const currentArrayTypes = [];
  const prefix = objectName ? `${objectName}` : "";

  array.forEach((currentValue) => {
    console.log('array currentValue', currentValue)
    // currentArrayTypes.push(`${getTypeOfValue(currentValue)}[]`);
    currentArrayTypes.push(`${getTypeOfValue(currentValue)}`);
  })

  if (!(objectName in this)) this[objectName] = [];
  this[objectName].push(`Array<${getUnique(currentArrayTypes).join("|")}>`);

  array.forEach(currentValue => {
    const currentValueType = getTypeOfValue(currentValue);

    if (currentValueType === "array") {
      parseArray.bind(this, currentValue, prefix)();
    } else if (currentValueType === "object") {
      parseObject.bind(this, currentValue, prefix, true)();
    }
  });
}
/**
 * @param {object} obj - The object that we want to parse
 * @param {string} objectName - Usually the Prefix - Root do no have ObjectName
 * @param {boolean} doNotReinsert - If we want to reinsert the type, usually when we parse
 * an array of objects, we do not want to reinsert.
 */
function parseObject(obj, objectName, doNotReinsert = false) {
  const prefix = objectName ? `${objectName}.` : "";

  Object.keys(obj).forEach(propertyName => {
    const currentValue = obj[propertyName];
    const propertyType = getTypeOfValue(currentValue);
    console.log(`propertyType ${propertyName}`, propertyType, currentValue)
    const currentPrefix = `${prefix}${propertyName}`;
    let result = null;

    // Root Object don't have a objectName
    if (!doNotReinsert && objectName) {
      if (!(objectName in this)) this[objectName] = [];
      this[objectName].push("object");
    }

    // If it's Array, we need the values inside.
    if (propertyType === "array") {
      parseArray.bind(this, currentValue, currentPrefix)();
    } else if (propertyType === "object") {
      parseObject.bind(this, currentValue, currentPrefix)();
    } else {
      result = propertyType;
      if (!(currentPrefix in this)) this[currentPrefix] = [];
      this[currentPrefix].push(result);
    }
  })
}

function ParseRootDefinition(obj) {
  // 1. What is the default type for our Definition?
  const jsonType = typeof obj;

  if (jsonType === "array") parseArray.bind(this, obj)();
  else if (jsonType === "object") parseObject.bind(this, obj)();
}

/**
 * @param {Object} obj
 * @param {Object[]} jsonObjects
 */
function processTypeDef(obj, jsonObjects, opts) {
  let output = "";
  // 0. A default name for our Definition
  const jsonDef = opts.typeName || "json";
  const jsonTypes = [];

  Object.keys(jsonObjects).forEach(key => {
    jsonTypes.push(getTypeOfValue(jsonObjects[key]));
  });

  let prefix = 'property'
  let desc = (opts.description) ? opts.description : ''
  let openTag = ''
  if (opts.isFunction) {
    prefix = 'param'
    openTag = `* ${desc}`
  } else {
    openTag = `* @typedef {${getUnique(jsonTypes)}} ${jsonDef}`
  }

  let returnTag = ''
  if (opts.returnStatements) {
    const returnType = getTypeOfValue(opts.returnStatements[0])
    const finalReturnType = returnType === 'undefined' ? '*' : returnType
    returnTag = `* @return {${finalReturnType}}`
  }

  output = `/** 
${openTag}\n`;

  // console.log('BILLY', obj)


  const objKeys = Object.keys(obj)
  /*
  console.log('obj', obj)
  console.log('objKeys', objKeys)
  process.exit(1)
  /** */
  console.log('obj', jsonObjects[0])
  let parentOptional = {}
  const asData = objKeys.map((key, i) => {
    let isUnknownRef = false
    const isLast = objKeys.length === (i + 1)
    let foundDefault = dotProp(jsonObjects[0], key)
    let type = obj[key].join("|")

    const keys = key.split('.')
    const parent = removeItem(keys, keys.length -1).join('.')
    const collection = keys[0]
    console.log(`>>>type ${collection} - ${key}`, obj[key])
    console.log(`inner found default ${key}`, foundDefault)
    let keyOutput = key
    let isOptional = (foundDefault === UNKNOWN_VALUE) ? true : false
    console.log('foundDefault', foundDefault)
    if (!Array.isArray(foundDefault) && typeof foundDefault === 'object') {
      keyOutput = `[${key}]`
      isOptional = true
      parentOptional[key] = true
    } else if (typeof foundDefault === 'number') {
      keyOutput = `[${key}=${foundDefault}]`
      type = 'number'
      isOptional = true
      parentOptional[key] = true
    } else if (typeof foundDefault === 'boolean') {
      keyOutput = `[${key}=${foundDefault}]`
      type = 'boolean'
      isOptional = true
      parentOptional[key] = true
    } else if (typeof foundDefault === 'string' && foundDefault.indexOf(UNKNOWN_REFERENCE) > -1) {
      console.log('BeforefoundDefault', foundDefault)
      const cleanDefault = foundDefault.replace(UNKNOWN_REFERENCE, '')
      keyOutput = `[${key}=${cleanDefault}]`
      foundDefault = cleanDefault
      type = '*'
      isUnknownRef = true
      isOptional = true
      parentOptional[key] = true
    } else if (typeof foundDefault !== 'undefined' && foundDefault !== UNKNOWN_VALUE) {
      keyOutput = `[${key}=${JSON.stringify(foundDefault)}]`
      isOptional = true
      parentOptional[key] = true
    }

    if (parentOptional[collection]) {
      isOptional = true
      parentOptional[key] = true
    }
    // keyOutput = (typeof foundDefault !== 'undefined' && foundDefault !== UNKNOWN_VALUE) ? `[${key}=${JSON.stringify(foundDefault)}]` : key

    output += `* @${prefix} {${type}} ${keyOutput}`
    if (isLast) {
      output += returnTag
    }
    output += '\n'

    const fnParams = opts.fnParams || []

    /*
    console.log('fnParams', fnParams)
    /** */

    let argPosition
    if (fnParams.length) {
      argPosition = fnParams.find((param, i) => {
        return collection === param.parameter || collection === param.paramPlaceholder || collection === param.paramKey
      }).position
    }
    const details = {
      tagType: prefix,
      arg: collection,
      key: key,
      parent: parent,
      identifier: keys[keys.length - 1],
      type,
      defaultValue: foundDefault !== UNKNOWN_VALUE ? foundDefault : undefined,
      isUnknownRef,
      isOptional,
    }

    if (typeof argPosition !== 'undefined') {
      details.argPosition = argPosition
    }

    return details
  })

  /*
  console.log('parentOptional', parentOptional)
  console.log('asData', asData)
  /** */

  // process.exit(1)
  
  output += "*/"

  return {
    data: asData,
    description: desc,
    openTag,
    returnTag,
    // string: output
  }
}


function removeItem(array, n) {
  return array.filter((x, i) => i != n)
}

function getValue(name, jsonObjects) {
  return JSON.stringify(jsonObjects[name])
}

/**
 * @param {Array} jsonObjects
 */
function goThroughAndParse(jsonObjects, opts) {
  const theObjectDefinition = {}

  jsonObjects.forEach((obj) =>
    ParseRootDefinition.bind(theObjectDefinition, obj)()
  )
  /*
  console.log('theObjectDefinition', theObjectDefinition)
  process.exit(1)
  /** */

  const uniqueValues = keepUniqueTypes(theObjectDefinition, jsonObjects)
  /*
  console.log('uniqueValues', uniqueValues)
  process.exit(1)
  /** */

  const values = processTypeDef(
    uniqueValues,
    jsonObjects,
    opts
  )
  // console.log('values', values)
  let maxWidth = values.data.reduce((acc, tag) => {
    if (acc < tag.type.length) {
      return tag.type.length
    }
    return acc
  }, 0)
  maxWidth = maxWidth + 2

  const byDefinitionOrder = comparators(element => element.argPosition)
  const byOptional = comparators(element => element.isOptional)
  const byKey = comparators(element => element.key)
  const composed = composeComparators(
    byDefinitionOrder.asc,
    byKey.asc,
    byOptional.asc,
  )

  /*
  console.log('values.data', values.data)
  process.exit(1)
  /** */

  const render = values.data.sort(composed.asc).reduce((acc, tag, i) => {
    const isFirst = i === 0
    const isLast = values.data.length === (i + 1)
    if (isFirst && values.description) {
      acc += `\n* ${values.description}\n`
    }
    let keyOutput = tag.key
    let foundDefault = tag.defaultValue
    console.log('x', foundDefault)
    if (opts && opts.fnParams && opts.fnParams[i] && opts.fnParams[i].defaultValue) {
      console.log('xxxx')
      foundDefault = opts.fnParams[i].defaultValue
    }

    console.log('foundDefault', foundDefault, opts)
    let defaultValueRender = ''
    if (!Array.isArray(foundDefault) && typeof foundDefault === 'object') {
      // hide for objects
      defaultValueRender = ''
    } else if (typeof foundDefault !== 'undefined') {
      if (typeof foundDefault === 'boolean') {
        defaultValueRender = `=${foundDefault}`
      } else if (Array.isArray(foundDefault)) {
        defaultValueRender = `=${JSON.stringify(foundDefault.filter((x) => x !== UNKNOWN_VALUE))}`
      } else if (tag && tag.isUnknownRef) {
        defaultValueRender = `=${foundDefault}`
      } else if (typeof foundDefault === 'number') {
        defaultValueRender = `=${foundDefault}`
      } else if (foundDefault !== UNKNOWN_VALUE && !foundDefault.startsWith('__unknown__ref')) {
        defaultValueRender = `=${JSON.stringify(foundDefault)}`
      }
    }
    if (tag.isOptional) {
      keyOutput = `[${tag.key}${defaultValueRender}]`
    }
    // console.log('defaultValueRender' , defaultValueRender)
    acc += `* @${tag.tagType} ${padRight(`{${tag.type}}`, maxWidth, ' ')} ${keyOutput}\n`;
    if (isLast) {
      acc += values.returnTag;
      acc += '\n*/';
    }
    return acc
  }, '/**')

  /*
  console.log('render')
  console.log(render)
  process.exit(1)
  /** */

  return {
    data: values.data,
    render: render,
  }
}

function padRight(val, num, str) {
  var padding = '';
  var diff = num - val.length;
  if (diff <= 5 && !str) {
    padding = '00000';
  } else if (diff <= 25 && !str) {
    padding = '000000000000000000000000000';
  } else {
    return val + repeat(str || '0', diff);
  }
  return val + padding.slice(0, diff);
}

// https://github.com/jonschlinkert/repeat-string/blob/master/index.js
var res = '';
var cache;
function repeat(str, num) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  }

  // cover common, quick use cases
  if (num === 1) return str;
  if (num === 2) return str + str;

  var max = str.length * num;
  if (cache !== str || typeof cache === 'undefined') {
    cache = str;
    res = '';
  } else if (res.length >= max) {
    return res.substr(0, max);
  }

  while (max > res.length && num > 1) {
    if (num & 1) {
      res += str;
    }

    num >>= 1;
    str += str;
  }

  res += str;
  res = res.substr(0, max);
  return res;
}

function dotProp(obj, key, def, p, undef) {
	key = key.split ? key.split('.') : key;
	for (p = 0; p < key.length; p++) {
		obj = obj ? obj[key[p]] : undef;
	}
	return obj === undef ? def : obj;
}

function convertToJSDoc(json, opts = {}) {
  const jsonObjects = []
  console.log('json')
  console.log(json)
  console.log('convertToJSDoc opts', opts)
  const obj = JSON.parse(json)
  if (!Object.keys(obj).length) {
    return {
      data: {},
      render: '',
    }
  }

  // process.exit(1)
  jsonObjects.push(obj)
  const val = goThroughAndParse(jsonObjects, opts)
  return val
}

if (require.main === module) {
  const json = `{
    "name": "John",
    "coolPoints": 100,
    "age": {
      "digits": 30,
      "units": "years"
    },
    "city": "New York",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip": "10001"
    }
  }`
  const opts = {}
  const result = convertToJSDoc(json, opts)
  console.log(result)
}

module.exports = {
  convertToJSDoc
}