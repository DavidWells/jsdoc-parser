var dox = require('../')
var code = `
/** description text */

/**
 * description
 * @module {Type.<Type,Type(Type,Type.<Type>)>} [name={}] - description text
 * @module {Type} name description text
 * @module [name] - description text
 * @module name - description text
 * @module name
 */

/** @extends {Type.<Type,Type(Type,Type.<Type>)>} [name={}] - description text */
/** @extends {Type} name description text */
/** @extends [name] - description text */
/** @extends name - description text */
/** @extends name */

/** @tag {Type.<Type,Type(Type,Type.<Type>)>} - description text */
/** @tag {Type} description text */
/** @tag - description text */
/** @tag description text */
/** @tag */

/*! ignore */
/*!
 * ignore
 */

/* ignore */
/*
 * ignore
 */
`;



var obj = dox.parseComments(code);
const { inspect } = require('util')
console.log(inspect(obj, {showHidden: false, depth: null}))