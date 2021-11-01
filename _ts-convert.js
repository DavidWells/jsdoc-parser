const fs = require('fs')
const path = require('path')
const typeConverter = require('./lib/utils/convert')

const input =
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

const inputTwo = `
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

console.log(typeConverter(inputTwo))