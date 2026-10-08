import { render } from '@testing-library/react'
import _ from 'lodash'
import React from 'react'

import { consoleUtil } from 'test/utils'

/**
 * Renders a component and returns its root DOM node.
 * @param {React.ElementType} Component
 * @param {Object} props
 * @returns {Element}
 */
export const renderComponentRoot = (Component, props) =>
  render(React.createElement(Component, props)).container.firstElementChild

export const classNamePropValueBeforePropName = (Component, propKey, propValues, options = {}) => {
  const { className = propKey, requiredProps = {} } = options

  propValues.forEach((propVal) => {
    it(`adds "${propVal} ${className}" to className`, () => {
      const root = renderComponentRoot(Component, { ...requiredProps, [propKey]: propVal })

      expect(root).toHaveClassName(`${propVal} ${className}`)
    })
  })
}

export const noClassNameFromBoolProps = (Component, propKey, propValues, options = {}) => {
  const { className = propKey, requiredProps = {} } = options

  _.each([true, false], (bool) =>
    it(`does not add any className when ${bool}`, () => {
      consoleUtil.disableOnce()

      const root = renderComponentRoot(Component, { ...requiredProps, [propKey]: bool })

      expect(root).not.toHaveClassName(className)
      expect(root).not.toHaveClassName('true')
      expect(root).not.toHaveClassName('false')

      propValues.forEach((propVal) => expect(root).not.toHaveClassName(propVal.toString()))
    }),
  )
}

export const noDefaultClassNameFromProp = (Component, propKey, propValues, options = {}) => {
  const { className = propKey, requiredProps = {}, defaultValue } = options

  // required props may include a prop that creates a className
  // if so, we cannot assert that it doesn't exist by default because it is required to exist
  // skip assertions for required props
  if (defaultValue) return
  if (propKey in requiredProps) return

  it('is not included in className when not defined', () => {
    consoleUtil.disableOnce()
    const root = renderComponentRoot(Component, requiredProps)

    expect(root).not.toHaveClassName(className)

    // ensure that none of the prop option values are in className
    // SUI classes ought to be built up using a declarative component API
    propValues.forEach((propValue) => expect(root).not.toHaveClassName(propValue.toString()))
  })
}
