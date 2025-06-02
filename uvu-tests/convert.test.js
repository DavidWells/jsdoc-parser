const { test } = require('uvu')
const assert = require('uvu/assert')
const typeConverter = require('../lib/utils/convert')


test.after(() => console.log('tests done'))

test('API is exposed', async () => {
  assert.is(typeof typeConverter, 'function')
})

const singleType = `
/**
 * Before action hook.
 */
export type TinyProps = {
  /**
   * Xyz 123
   */
  message: string;
  /**
   * Product count
   */
  count: number;
  /**
   * Is disabled
   */
  disabled: boolean;
};
`

test('typeConverter tyoe', async () => {
  const result = typeConverter(singleType)
  /*
  console.log(result)
  console.log(result.jsdoc)
  /** */
  // console.log('foundValues', foundValues)
  assert.equal(result, {
    jsdoc: '/**\n' +
      ' * Before action hook.\n' +
      ' * @typedef {object} TinyProps\n' +
      ' * @property {string} message   Xyz 123\n' +
      ' * @property {number} count   Product count\n' +
      ' * @property {boolean} disabled   Is disabled\n' +
      ' */',
    typeMap: {
      TinyProps: {
        start: 1,
        end: 202,
        code: '/**\n' +
          ' * Before action hook.\n' +
          ' */\n' +
          'export type TinyProps = {\n' +
          '    /**\n' +
          '     * Xyz 123\n' +
          '     */\n' +
          '    message: string;\n' +
          '    /**\n' +
          '     * Product count\n' +
          '     */\n' +
          '    count: number;\n' +
          '    /**\n' +
          '     * Is disabled\n' +
          '     */\n' +
          '    disabled: boolean;\n' +
          '};'
      }
    }
  }, 'typeConverter')
})

const simpleInterface =
`
/**
 * JSON representation of an {@link Action}
 * @see Action
 */
export default interface ActionJSON {
  /**
   * Unique action name
   */
  name: string;
  /**
   * Type of an action
   */
  actionType: 'record' | 'resource' | Array<'record' | 'resource'>;
  /**
   * Action icon
   */
  icon?: string;
  /**
   * Action label - visible on the frontend
   */
  label: string;
  /**
   * Guarding message
   */
  guard?: string;
  /**
   * If action should have a filter (for resource actions)
   */
  showFilter: boolean;
  /**
   * Action component. When set to false action will be invoked immediately after clicking it,
   * to put in another words: tere wont be an action view
   */
  component?: string | false | null;
}
`

test('typeConverter interface', async () => {
  const result = typeConverter(simpleInterface)
  // console.log(result)
  // process.exit(1)
  // console.log('foundValues', foundValues)
  assert.equal(result, {
    jsdoc: '/**\n' +
      ' * JSON representation of an {@link Action}\n' +
      ' * @see Action\n' +
      ' * @interface ActionJSON\n' +
      ' */\n' +
      '/**\n' +
      ' * Unique action name\n' +
      ' * @name ActionJSON#name\n' +
      ' * @type {string}\n' +
      ' */\n' +
      '/**\n' +
      ' * Type of an action\n' +
      ' * @name ActionJSON#actionType\n' +
      " * @type {'record' | 'resource' | Array<'record' | 'resource'>}\n" +
      ' */\n' +
      '/**\n' +
      ' * Action icon\n' +
      ' * @name ActionJSON#icon\n' +
      ' * @optional\n' +
      ' * @type {string}\n' +
      ' */\n' +
      '/**\n' +
      ' * Action label - visible on the frontend\n' +
      ' * @name ActionJSON#label\n' +
      ' * @type {string}\n' +
      ' */\n' +
      '/**\n' +
      ' * Guarding message\n' +
      ' * @name ActionJSON#guard\n' +
      ' * @optional\n' +
      ' * @type {string}\n' +
      ' */\n' +
      '/**\n' +
      ' * If action should have a filter (for resource actions)\n' +
      ' * @name ActionJSON#showFilter\n' +
      ' * @type {boolean}\n' +
      ' */\n' +
      '/**\n' +
      ' * Action component. When set to false action will be invoked immediately after clicking it,\n' +
      ' * to put in another words: tere wont be an action view\n' +
      ' * @name ActionJSON#component\n' +
      ' * @optional\n' +
      ' * @type {string | false | null}\n' +
      ' */',
    typeMap: {
      ActionJSON: {
        start: 1,
        end: 729,
        code: '/**\n' +
          ' * JSON representation of an {@link Action}\n' +
          ' * @see Action\n' +
          ' */\n' +
          'export default interface ActionJSON {\n' +
          '    /**\n' +
          '     * Unique action name\n' +
          '     */\n' +
          '    name: string;\n' +
          '    /**\n' +
          '     * Type of an action\n' +
          '     */\n' +
          '    actionType: "record" | "resource" | Array<"record" | "resource">;\n' +
          '    /**\n' +
          '     * Action icon\n' +
          '     */\n' +
          '    icon?: string;\n' +
          '    /**\n' +
          '     * Action label - visible on the frontend\n' +
          '     */\n' +
          '    label: string;\n' +
          '    /**\n' +
          '     * Guarding message\n' +
          '     */\n' +
          '    guard?: string;\n' +
          '    /**\n' +
          '     * If action should have a filter (for resource actions)\n' +
          '     */\n' +
          '    showFilter: boolean;\n' +
          '    /**\n' +
          '     * Action component. When set to false action will be invoked immediately after clicking it,\n' +
          '     * to put in another words: tere wont be an action view\n' +
          '     */\n' +
          '    component?: string | false | null;\n' +
          '}'
      }
    }
  }, 'typeConverter')
})

test('typeConverter simple interface', async () => {
  const result = typeConverter(`
  interface Person {
    /** Name of person */
    name: string;
    /** Age of person */
    age: number;
  }
  `)
  // console.log(result)
  // process.exit(1)
  // console.log('foundValues', foundValues)
  assert.equal(result, {
    jsdoc: '/**\n' +
      ' * @interface Person\n' +
      ' */\n' +
      '/** Name of person\n' +
      ' * @name Person#name\n' +
      ' * @type {string}\n' +
      ' */\n' +
      '/** Age of person\n' +
      ' * @name Person#age\n' +
      ' * @type {number}\n' +
      ' */',
    typeMap: {
      Person: {
        start: 0,
        end: 111,
        code: 'interface Person {\n' +
          '    /** Name of person */\n' +
          '    name: string;\n' +
          '    /** Age of person */\n' +
          '    age: number;\n' +
          '}'
      }
    }
  }, 'typeConverter')
})

test.run()