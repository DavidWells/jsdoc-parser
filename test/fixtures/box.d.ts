export type BoxOptions = {
    /**
     * - The title to display at the top of the box
     */
    title?: string;
    /**
     * - Title style ('normal', 'bold')
     */
    titleStyle?: string;
    /**
     * - Title alignment within the box ('left', 'center', 'right')
     */
    titleAlign?: string;
    /**
     * - Title color (any chalk color)
     */
    titleColor?: string;
    /**
     * - The text message to display in the box
     */
    text?: string;
    /**
     * - Text style ('normal', 'bold')
     */
    textStyle?: string;
    /**
     * - Text alignment within the box ('left', 'center', 'right')
     */
    textAlign?: string;
    /**
     * - Text color (any chalk color)
     */
    textColor?: string;
    /**
     * - Number of newlines to add before the content inside the box
     */
    paddingTop?: number;
    /**
     * - Number of spaces for left padding
     */
    paddingLeft?: number;
    /**
     * - Number of spaces for right padding
     */
    paddingRight?: number;
    /**
     * - Number of newlines to add after the content inside the box
     */
    paddingBottom?: number;
    /**
     * - Number of newlines to add before the box
     */
    marginTop?: number;
    /**
     * - Number of newlines to add after the box
     */
    marginBottom?: number;
    /**
     * - Border color (any chalk color)
     */
    borderColor?: string;
    /**
     * - Border style ('normal', 'bold')
     */
    borderStyle?: string;
    /**
     * - Minimum width of the box. Set 100% for full width.
     */
    minWidth?: number | string;
    /**
     * - Maximum width of the box (defaults to terminal width)
     */
    maxWidth?: number;
    /**
     * - Custom border symbols
     */
    edges?: BoxEdges;
    /**
     * - custom adjust the title width
     */
    adjustTitleWidth?: number;
    /**
     * - custom adjust the content width
     */
    adjustContentWidth?: number;
    /**
     * - If true, wrap the text contents to fit inside of the terminalWidth and the box
     */
    wrapText?: boolean;
    /**
     * - Custom icon to display before the title or text
     */
    icon?: string;
    /**
     * - Type of box ('default', 'success', 'error', 'warning', 'info')
     */
    type?: string;
    /**
     * - Index of the box in a stack (for stacked boxes)
     */
    stackIndex?: number;
    /**
     * - Total number of boxes in the stack (for stacked boxes)
     */
    stackCount?: number;
};
export type BoxEdges = {
    /**
     * - Horizontal border character
     */
    horizontal?: string;
    /**
     * - Vertical border character
     */
    vertical?: string;
    /**
     * - Top-left corner character
     */
    leftTop?: string;
    /**
     * - Bottom-left corner character
     */
    leftBottom?: string;
    /**
     * - Top-right corner character
     */
    rightTop?: string;
    /**
     * - Bottom-right corner character
     */
    rightBottom?: string;
};
export type BoxInternals = {
    /**
     * - If true, renders as a header without left border
     */
    header?: boolean;
    /**
     * - If true, adds a right border with corners like in box (for header mode)
     */
    rightBorder?: boolean;
};
export type BoxApi = BoxOptions & BoxInternals;
export type LongestResult = {
    /**
     * - The length of the longest line
     */
    length: number;
    /**
     * - The text of the longest line
     */
    text: string;
};
export type LogBoxAPI = (messageOrSettings: string | BoxOptions, settings?: BoxOptions) => void;
export type LogBoxFunction = {
    /**
     * - Creates a success box
     */
    success: LogBoxAPI;
    /**
     * - Creates an error box
     */
    error: LogBoxAPI;
    /**
     * - Creates a warning box
     */
    warning: LogBoxAPI;
    /**
     * - Creates an info box
     */
    info: LogBoxAPI;
};
export type LogStackBoxesAPI = (boxesOrSettings: BoxOptions[] | BoxOptions, settings?: BoxOptions) => void;
export type LogStackBoxesFunction = {
    /**
     * - Creates stacked boxes with success style
     */
    success: LogStackBoxesAPI;
    /**
     * - Creates stacked boxes with error style
     */
    error: LogStackBoxesAPI;
    /**
     * - Creates stacked boxes with warning style
     */
    warning: LogStackBoxesAPI;
    /**
     * - Creates stacked boxes with info style
     */
    info: LogStackBoxesAPI;
};
/**
 * @typedef {Object} BoxOptions
 * @property {string}   [title] - The title to display at the top of the box
 * @property {string}   [titleStyle='bold'] - Title style ('normal', 'bold')
 * @property {string}   [titleAlign='left'] - Title alignment within the box ('left', 'center', 'right')
 * @property {string}   [titleColor] - Title color (any chalk color)
 * @property {string}   [text] - The text message to display in the box
 * @property {string}   [textStyle='normal'] - Text style ('normal', 'bold')
 * @property {string}   [textAlign='left'] - Text alignment within the box ('left', 'center', 'right')
 * @property {string}   [textColor] - Text color (any chalk color)
 * @property {number}   [paddingTop=0] - Number of newlines to add before the content inside the box
 * @property {number}   [paddingLeft=2] - Number of spaces for left padding
 * @property {number}   [paddingRight=2] - Number of spaces for right padding
 * @property {number}   [paddingBottom=0] - Number of newlines to add after the content inside the box
 * @property {number}   [marginTop=0] - Number of newlines to add before the box
 * @property {number}   [marginBottom=0] - Number of newlines to add after the box
 * @property {string}   [borderColor] - Border color (any chalk color)
 * @property {string}   [borderStyle='normal'] - Border style ('normal', 'bold')
 * @property {number|string}   [minWidth] - Minimum width of the box. Set 100% for full width.
 * @property {number}   [maxWidth] - Maximum width of the box (defaults to terminal width)
 * @property {BoxEdges} [edges] - Custom border symbols
 * @property {number}   [adjustTitleWidth=0] - custom adjust the title width
 * @property {number}   [adjustContentWidth=0] - custom adjust the content width
 * @property {boolean}  [wrapText=false] - If true, wrap the text contents to fit inside of the terminalWidth and the box
 * @property {string}   [icon] - Custom icon to display before the title or text
 * @property {string}   [type] - Type of box ('default', 'success', 'error', 'warning', 'info')
 * @property {number}   [stackIndex] - Index of the box in a stack (for stacked boxes)
 * @property {number}   [stackCount] - Total number of boxes in the stack (for stacked boxes)
 */
/**
 * @typedef {Object} BoxEdges
 * @property {string} [horizontal='─'] - Horizontal border character
 * @property {string} [vertical='│'] - Vertical border character
 * @property {string} [leftTop='┌'] - Top-left corner character
 * @property {string} [leftBottom='└'] - Bottom-left corner character
 * @property {string} [rightTop='┐'] - Top-right corner character
 * @property {string} [rightBottom='┘'] - Bottom-right corner character
 */
/**
 * @typedef {Object} BoxInternals
 * @property {boolean}  [header=false] - If true, renders as a header without left border
 * @property {boolean}  [rightBorder=false] - If true, adds a right border with corners like in box (for header mode)
 */
/**
 * @typedef {BoxOptions & BoxInternals} BoxApi
 */
/**
 * Creates a boxed text with customizable borders, padding, and styling
 *
 * @param {string|BoxOptions} messageOrSettings - Either a string message or an options object
 * @param {BoxOptions} settings - Options object
 * @returns {string} A formatted box with the message inside
 */
export function makeBox(messageOrSettings: string | BoxOptions, settings?: BoxOptions): string;
/**
 * Stack multiple boxes vertically into a single continuous box
 *
 * @param {BoxOptions[]} boxes - Array of box options
 * @param {BoxOptions} [opts={}] - Global options for all boxes
 * @returns {string} The stacked boxes as a single continuous box
 */
export function makeStackedBoxes(boxes: BoxOptions[], opts?: BoxOptions): string;
/**
 * @typedef {(messageOrSettings: string|BoxOptions, settings?: BoxOptions) => void} LogBoxAPI
 */
/**
 * @typedef {Object} LogBoxFunction
 * @property {LogBoxAPI} success - Creates a success box
 * @property {LogBoxAPI} error - Creates an error box
 * @property {LogBoxAPI} warning - Creates a warning box
 * @property {LogBoxAPI} info - Creates an info box
 */
/**
 * Creates a boxed text with customizable borders, padding, and styling
 *
 * @param {string|BoxOptions} messageOrSettings - Either a string message or an options object
 * @param {BoxOptions} [settings={}] - Options object
 * @returns {void} Logs a formatted box with the message inside
 */
/**
 * @type {LogBoxAPI & LogBoxFunction}
 */
export const logBox: LogBoxAPI & LogBoxFunction;
/**
 * @typedef {(boxesOrSettings: BoxOptions[]|BoxOptions, settings?: BoxOptions) => void} LogStackBoxesAPI
 */
/**
 * @typedef {Object} LogStackBoxesFunction
 * @property {LogStackBoxesAPI} success - Creates stacked boxes with success style
 * @property {LogStackBoxesAPI} error - Creates stacked boxes with error style
 * @property {LogStackBoxesAPI} warning - Creates stacked boxes with warning style
 * @property {LogStackBoxesAPI} info - Creates stacked boxes with info style
 */
/**
 * Creates stacked boxes with customizable borders, padding, and styling
 *
 * @param {BoxOptions[]|BoxOptions} boxesOrSettings - Either an array of box options or an options object
 * @param {BoxOptions} [settings={}] - Options object
 * @returns {void} Logs formatted stacked boxes
 */
/**
 * @type {LogStackBoxesAPI & LogStackBoxesFunction}
 */
export const logStackBoxes: LogStackBoxesAPI & LogStackBoxesFunction;
//# sourceMappingURL=box.d.ts.map