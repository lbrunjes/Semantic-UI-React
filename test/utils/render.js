import { render } from '@testing-library/react'
import { onTestFinished } from 'vitest'

/**
 * Renders an element and returns its root DOM node.
 *
 * @param {React.ReactElement} element
 * @returns {Element|null}
 */
export const renderRoot = (element) => render(element).container.firstElementChild

/**
 * Renders an element inside valid parent elements and returns its root DOM node, i.e. a "tr"
 * inside a "table > tbody" to avoid "validateDOMNesting" warnings from React.
 *
 * @example
 * renderRootIn(<TableRow />, 'table', 'tbody')
 *
 * @param {React.ReactElement} element
 * @param {...string} parentTags Tag names of parents, from the outermost to the innermost.
 * @returns {Element|null}
 */
export const renderRootIn = (element, ...parentTags) => {
  const [root, ...rest] = parentTags.map((tagName) => document.createElement(tagName))
  const parent = rest.reduce((node, child) => node.appendChild(child), root)

  document.body.appendChild(root)
  // RTL removes only containers that are direct children of "document.body"
  onTestFinished(() => root.remove())

  return render(element, { container: parent }).container.firstElementChild
}
