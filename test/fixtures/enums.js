const FSM = {}

/**
 * FSM states.
 *
 * @enum {number}
 */
FSM.prototype.states = {
  STOPPED     : 0,
  STARTING    : 1,
  WORKING     : 2,
  STOPPING    : 3
};


/**
 * Colors.
 *
 * @enum {string}
 */
exports.RED     = "#f00";
exports.GREEN   = "#0f0";
exports.BLUE    = "#00f";
exports.BLACK   = "#000";
exports.WHITE   = "#fff";
