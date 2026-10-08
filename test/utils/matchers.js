/**
 * Custom matchers for Vitest's `expect`, registered in "test/setup.js".
 */

const hasClassName = (node, className) =>
  ` ${String(node.className).replace(/\s+/g, ' ')} `.includes(` ${className.trim()} `)

export const matchers = {
  /**
   * Asserts that a DOM node has a className. Unlike `toHaveClass()` from "jest-dom", multiple
   * classes must be present in the same order & next to each other, i.e. "four wide".
   *
   * @example
   * expect(node).toHaveClassName('four wide')
   */
  toHaveClassName(node, className) {
    // Heads up! Throws instead of failing, otherwise ".not.toHaveClassName()" would pass on a missing node
    if (!node || typeof node.className !== 'string') {
      throw new TypeError(
        `toHaveClassName() expects a DOM element, received ${this.utils.printReceived(node)}`,
      )
    }

    const pass = hasClassName(node, className)

    return {
      pass,
      message: () =>
        `expected node ${pass ? 'not ' : ''}to have className ${this.utils.printExpected(
          className,
        )}, it has ${this.utils.printReceived(node.className)}`,
    }
  },
}
