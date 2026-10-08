import { render } from '@testing-library/react'

/**
 * Renders an element into a container that is not attached to the document, so it does not
 * interfere with queries on `document.body`. Returns the root DOM node, if any.
 *
 * @param {React.ReactElement} element
 * @returns {Element|null}
 */
export const renderDetached = (element) => {
  const container = document.createElement('div')
  render(element, { container })

  return container.firstElementChild
}

/**
 * Checks that `candidate` has the tag & attributes of `expected`, its other attributes and classes
 * are ignored.
 *
 * @param {Element} candidate
 * @param {Element} expected
 * @param {Object} [options]
 * @param {boolean} [options.compareText=true] Also requires the same text content.
 * @returns {boolean}
 */
const isSimilarNode = (candidate, expected, { compareText = true } = {}) => {
  if (candidate.tagName !== expected.tagName) return false
  if (compareText && candidate.textContent !== expected.textContent) return false

  return Array.from(expected.attributes).every(({ name, value }) => {
    if (name === 'class') {
      return value.split(/\s+/).every((className) => candidate.classList.contains(className))
    }

    return candidate.getAttribute(name) === value
  })
}

/**
 * Finds a node inside `root` (including itself) that matches `expected`.
 *
 * @param {Element} root A node to search in.
 * @param {Element} expected A node to match.
 * @param {Object} [options]
 * @param {boolean} [options.exact=true] Requires an equal node (tag, attributes & children),
 *   otherwise the tag & a subset of attributes and classes should match.
 * @param {boolean} [options.compareText=true] Requires the same text, for non-exact matching only.
 * @returns {Element|undefined}
 */
export const findMatchingNode = (root, expected, { exact = true, compareText = true } = {}) => {
  const candidates = [root, ...root.querySelectorAll(expected.tagName)]

  return candidates.find((candidate) =>
    exact ? candidate.isEqualNode(expected) : isSimilarNode(candidate, expected, { compareText }),
  )
}
