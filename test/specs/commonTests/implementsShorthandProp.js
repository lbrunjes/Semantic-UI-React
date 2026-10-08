import { render } from '@testing-library/react'
import _ from 'lodash'
import React from 'react'

import { createShorthand } from 'src/lib'
import { consoleUtil, getComponentName } from 'test/utils'
import { findMatchingNode, renderDetached } from 'test/utils/domMatching'
import { noDefaultClassNameFromProp } from './classNameHelpers'
import helpers from './commonHelpers'

const shorthandComponentName = (ShorthandComponent) => {
  if (typeof ShorthandComponent === 'string') {
    return ShorthandComponent
  }

  return getComponentName(ShorthandComponent)
}

/**
 * Assert that a Component correctly implements a shorthand prop.
 *
 * Assertions are made on the DOM: the shorthand value should render the same DOM as the
 * `ShorthandComponent` rendered with the props created from that value.
 *
 * @param {function} Component The component to test.
 * @param {object} options
 * @param {string} options.propKey The name of the shorthand prop.
 * @param {string|function} options.ShorthandComponent The component that should be rendered from the shorthand value.
 * @param {boolean} [options.alwaysPresent] Whether or not the shorthand exists by default.
 * @param {boolean} [options.assertExactMatch] Requires equal DOM if true, otherwise the rendered
 *   DOM can have additional attributes & classes.
 * @param {boolean} [options.autoGenerateKey=false] Whether or not automatic key generation is
 *   allowed for the shorthand component.
 * @param {function} options.mapValueToProps A function that maps a primitive value to the Component props.
 * @param {Boolean} [options.parentIsFragment=false] A flag that shows the type of the Component to test.
 * @param {Object} [options.requiredProps={}] Props required to render the component.
 * @param {boolean} [options.rendersPortal=false] Does this component render a Portal powered component?
 * @param {boolean|string} [options.defaultValue] The default value for the shorthand prop.
 * @param {Object} [options.shorthandDefaultProps] Default props for the shorthand component.
 * @param {Object} [options.shorthandOverrideProps] Override props for the shorthand component.
 */
export default (Component, options = {}) => {
  const {
    alwaysPresent,
    defaultValue,
    assertExactMatch = true,
    autoGenerateKey = true,
    mapValueToProps,
    parentIsFragment = false,
    rendersPortal = false,
    propKey,
    ShorthandComponent,
    shorthandDefaultProps = {},
    shorthandOverrideProps = {},
    requiredProps = {},
  } = options
  const { assertRequired } = helpers('implementsShorthandProp', Component)

  describe(`${propKey} shorthand prop (common)`, () => {
    assertRequired(Component, 'a `Component`')
    assertRequired(_.isPlainObject(options), 'an `options` object')
    assertRequired(propKey, 'a `propKey`')
    assertRequired(ShorthandComponent, 'a `ShorthandComponent`')

    const name = shorthandComponentName(ShorthandComponent)

    // Heads up! "baseElement" (document.body) also covers components that render into a portal
    const renderComponent = (props) =>
      render(React.createElement(Component, { ...requiredProps, ...props })).baseElement

    // The DOM of a ShorthandComponent without props, used to check if it is rendered at all
    const findBareShorthand = (root) => {
      const expected = renderDetached(<ShorthandComponent />)

      return findMatchingNode(root, expected, { exact: false, compareText: false })
    }

    const assertValidShorthand = (value) => {
      const expectedElement = createShorthand(ShorthandComponent, mapValueToProps, value, {
        defaultProps: shorthandDefaultProps,
        overrideProps: shorthandOverrideProps,
        autoGenerateKey,
      })
      const root = renderComponent({ [propKey]: value })
      const expected = renderDetached(expectedElement)

      if (!expected) {
        throw new Error(`Expected ${name} rendered from "${value}" to render a DOM node.`)
      }

      expect(
        findMatchingNode(root, expected, { exact: assertExactMatch }),
        `${name} rendered from "${value}" was not found, expected:\n${expected.outerHTML}`,
      ).toBeDefined()
    }

    if (alwaysPresent) {
      it(`has default ${name} when not defined`, () => {
        expect(findBareShorthand(renderComponent())).toBeDefined()
      })
    } else {
      if (!parentIsFragment && !rendersPortal) {
        noDefaultClassNameFromProp(Component, propKey, [], options)
      }

      if (!defaultValue) {
        it(`has no ${name} when not defined`, () => {
          expect(findBareShorthand(renderComponent())).toBeUndefined()
        })
      }
    }

    if (!alwaysPresent && !defaultValue) {
      it(`has no ${name} when null`, () => {
        expect(findBareShorthand(renderComponent({ [propKey]: null }))).toBeUndefined()
      })
    }

    it(`renders a ${name} from strings`, () => {
      consoleUtil.disableOnce()
      assertValidShorthand('string')
    })

    it(`renders a ${name} from numbers`, () => {
      consoleUtil.disableOnce()
      assertValidShorthand(123)
    })

    // the Input maps shorthand to `type`
    // React uses the default prop ('text') in place of type={0}
    if (propKey !== 'input') {
      it(`renders a ${name} from number 0`, () => {
        consoleUtil.disableOnce()
        assertValidShorthand(0)
      })
    }

    it(`renders a ${name} from a props object`, () => {
      consoleUtil.disableOnce()
      assertValidShorthand(mapValueToProps('foo'))
    })

    it(`renders a ${name} from elements`, () => {
      consoleUtil.disableOnce()
      assertValidShorthand(<ShorthandComponent />)
    })
  })
}
