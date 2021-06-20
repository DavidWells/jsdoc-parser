var dox = require('../')
var code = `
/**
 * Banana test module
 * @module Banana
 */
module.exports = function xtz() {
    /**
     * Banana constructor
     *
     * Creates a banana instance
     *
     * @constructor
     */
    var Banana = function() {

    }

    /**
     * Peels a banana
     *
     * This method peels a banana and calls a callback
     *
     * @method peelIt
     * @chainable
     * @param {string} startPoint Sets the peeling start point.
     * @param {function} [callback] Callback function
     * @returns {object} Returns this value
     */
    Banana.prototype.peelIt = function(startPoint, callback) {
        return this;
    }

    /**
     * Returns a banana color
     * @return {string} Returns color of a banana
     */
    Banana.prototype.getColor = function () {
        return 'yellow';
    };
}
`;


var obj = dox.parseComments(code);
const { inspect } = require('util')
console.log(inspect(obj, {showHidden: false, depth: null}))