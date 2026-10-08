import { render } from '@testing-library/react'
import React, { createElement } from 'react'

import { consoleUtil } from 'test/utils'
import faker from 'test/utils/faker'
import helpers from './commonHelpers'

/**
 * Assert a component renders children somewhere in the tree.
 * @param {React.Component|Function} Component A component that should render children.
 * @param {Object} [options={}]
 * @param {Object} [options.rendersContent] Assert that component also renders `content` prop.
 * @param {Object} [options.requiredProps={}] Props required to render the component.
 */
export default (Component, options = {}) => {
  const { rendersContent = true, requiredProps = {} } = options
  const { assertRequired } = helpers('rendersChildren', Component)

  assertRequired(Component, 'a `Component`')

  // Renders `value` as `children` or as another prop (i.e. `content`).
  // Heads up! "baseElement" (document.body) also covers components that render into a portal.
  const renderWith = (propName, value) => {
    // silence element nesting warnings, i.e. text rendered in a "table"
    consoleUtil.disableOnce()

    const element =
      propName === 'children'
        ? createElement(Component, requiredProps, value)
        : createElement(Component, { ...requiredProps, [propName]: value })

    return render(element).baseElement
  }

  const itRendersProp = (propName) => {
    it('renders child text', () => {
      const text = faker.hacker.phrase()

      expect(renderWith(propName, text)).toHaveTextContent(text)
    })

    it('renders child components', () => {
      const id = faker.hacker.noun()
      const baseElement = renderWith(propName, <div data-child={id} />)

      expect(baseElement.querySelector(`[data-child="${id}"]`)).toBeInTheDocument()
    })

    it('renders child number with 0 value', () => {
      expect(renderWith(propName, 0)).toHaveTextContent('0')
    })
  }

  describe('children (common)', () => itRendersProp('children'))

  if (rendersContent) {
    describe('content (common)', () => itRendersProp('content'))
  }
}
