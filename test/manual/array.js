const { inspect } = require('util')
const doxxx = require('../../lib/dox')

function deepLog(x) {
  console.log(inspect(x, {showHidden: false, depth: null}))
}

const codeTwo = `
/**
 * Assign the project to a list of employees.
 * @param {Object[]} employees - The employees who are responsible for the project.
 * @param {string} employees[].name - The name of an employee.
 * @param {string} employees[].department - The employee's department.
 * @param {string} [employees[].height] - The employee's height.
 * @param {string} [employees[].height=180] - The employee's weight.
 */
Project.prototype.assign = function(employees) {
    // ...
};
`

deepLog(doxxx.parseComments(codeTwo))
