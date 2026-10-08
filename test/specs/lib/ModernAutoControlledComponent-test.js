import faker from 'test/utils/faker'
import _ from 'lodash'
import { act, render } from '@testing-library/react'
import React from 'react'

import { ModernAutoControlledComponent as AutoControlledComponent } from 'src/lib'
import { consoleUtil } from 'test/utils'

let TestClass

// Renders the (test-local) class component and exposes its state through a React ref
const renderTestClass = (element) => {
  const ref = React.createRef()
  const { rerender } = render(React.cloneElement(element, { ref }))

  return {
    getState: () => ref.current.state,
    setState: (state) => act(() => ref.current.setState(state)),
    // merges the given props into the initially rendered ones
    rerenderWithProps: (props) => rerender(React.cloneElement(element, { ...props, ref })),
  }
}

const createTestClass = (options = {}) =>
  class Test extends AutoControlledComponent {
    static autoControlledProps = options.autoControlledProps
    static defaultProps = options.defaultProps
    getInitialAutoControlledState() {
      return options.state
    }
    render = () => <div />
  }

const toDefaultName = (prop) => `default${prop.slice(0, 1).toUpperCase() + prop.slice(1)}`

const makeProps = () => ({
  computer: 'hardware',
  flux: 'capacitor',
  ion: 'belt',
})

const makeDefaultProps = (props) =>
  _.transform(props, (res, val, key) => {
    res[toDefaultName(key)] = val
  })

describe('extending AutoControlledComponent', () => {
  beforeEach(() => {
    TestClass = createTestClass({ autoControlledProps: [], state: {} })
  })

  it('does not throw with a `null` state', () => {
    TestClass = createTestClass({ autoControlledProps: [], state: null })
    renderTestClass(<TestClass />)
  })

  it('getAutoControlledStateFromProps', () => {
    consoleUtil.disableOnce()

    TestClass = createTestClass({
      autoControlledProps: ['open'],
      defaultProps: ['defaultOpen'],
      state: { open: false, value: 'initial' },
    })
    TestClass.getAutoControlledStateFromProps = (props, state) => {
      return {
        openProp: props.open,
        openState: state.open,
        modifiedValue: `${state.value} + auto`,
      }
    }
    const view = renderTestClass(<TestClass open />)

    expect(view.getState()).toHaveProperty('open', true)
    expect(view.getState()).toHaveProperty('openProp', true)

    // will be "true" because logic of ACC was executed before
    expect(view.getState()).toHaveProperty('openState', true)

    // "getAutoControlledStateFromProps" has access to whole state
    expect(view.getState()).toHaveProperty('modifiedValue', 'initial + auto')
    // original "value" will be kept
    expect(view.getState()).toHaveProperty('value', 'initial')
  })

  describe('setState', () => {
    it('sets state for autoControlledProps', () => {
      consoleUtil.disableOnce()

      const autoControlledProps = _.keys(makeProps())
      const randomProp = _.sample(autoControlledProps)
      const randomValue = faker.hacker.verb()

      TestClass = createTestClass({ autoControlledProps })
      const view = renderTestClass(<TestClass />)

      view.setState({ [randomProp]: randomValue })
      expect(view.getState()).toHaveProperty(randomProp, randomValue)
    })

    it('does not set state for props defined by the parent', () => {
      consoleUtil.disableOnce()

      const props = makeProps()
      const autoControlledProps = _.keys(props)

      const randomProp = _.sample(autoControlledProps)
      const randomValue = faker.hacker.phrase()

      TestClass = createTestClass({ autoControlledProps, state: {} })
      const view = renderTestClass(<TestClass {...props} />)

      view.setState({ [randomProp]: randomValue })

      // not updated
      expect(view.getState()).not.toHaveProperty(randomProp, randomValue)

      // is original value
      expect(view.getState()).toHaveProperty(randomProp, props[randomProp])
    })

    it('sets state for props passed as undefined by the parent', () => {
      consoleUtil.disableOnce()

      const props = makeProps()
      const autoControlledProps = _.keys(props)

      const randomProp = _.sample(autoControlledProps)
      const randomValue = faker.hacker.phrase()

      props[randomProp] = undefined

      TestClass = createTestClass({ autoControlledProps, state: {} })
      const view = renderTestClass(<TestClass {...props} />)

      view.setState({ [randomProp]: randomValue })

      expect(view.getState()).toHaveProperty(randomProp, randomValue)
    })

    it('does not set state for props passed as null by the parent', () => {
      consoleUtil.disableOnce()

      const props = makeProps()
      const autoControlledProps = _.keys(props)

      const randomProp = _.sample(autoControlledProps)
      const randomValue = faker.hacker.phrase()

      props[randomProp] = null

      TestClass = createTestClass({ autoControlledProps, state: {} })
      const view = renderTestClass(<TestClass {...props} />)

      view.setState({ [randomProp]: randomValue })

      // not updated
      expect(view.getState()).not.toHaveProperty(randomProp, randomValue)

      // is original value
      expect(view.getState()).toHaveProperty(randomProp, props[randomProp])
    })
  })

  describe('initial state', () => {
    it('is derived from autoControlledProps in props', () => {
      consoleUtil.disableOnce()

      const props = makeProps()
      const autoControlledProps = _.keys(props)

      TestClass = createTestClass({ autoControlledProps, state: {} })
      const view = renderTestClass(<TestClass {...props} />)

      _.each(props, (val, key) => expect(view.getState()).toHaveProperty(key, val))
    })

    it('does not include non autoControlledProps', () => {
      const props = makeProps()
      const view = renderTestClass(<TestClass {...props} />)

      _.each(props, (val, key) => expect(view.getState()).not.toHaveProperty(key, val))
    })

    it('includes non autoControlled state', () => {
      const props = makeProps()

      TestClass = createTestClass({ autoControlledProps: [], state: { foo: 'bar' } })
      expect(renderTestClass(<TestClass {...props} />).getState()).toHaveProperty('foo', 'bar')
    })

    it('uses the initial state if default and regular props are undefined', () => {
      consoleUtil.disableOnce()

      const defaultProps = { defaultFoo: undefined }
      const autoControlledProps = ['foo']

      TestClass = createTestClass({ autoControlledProps, defaultProps, state: { foo: 'bar' } })

      expect(renderTestClass(<TestClass foo={undefined} />).getState()).toHaveProperty('foo', 'bar')
    })

    it('uses the default prop if the regular prop is undefined', () => {
      consoleUtil.disableOnce()

      const defaultProps = { defaultFoo: 'default' }
      const autoControlledProps = ['foo']

      TestClass = createTestClass({ autoControlledProps, defaultProps, state: {} })

      expect(renderTestClass(<TestClass foo={undefined} />).getState()).toHaveProperty(
        'foo',
        'default',
      )
    })

    it('uses the regular prop when a default is also defined', () => {
      consoleUtil.disableOnce()

      const defaultProps = { defaultFoo: 'default' }
      const autoControlledProps = ['foo']

      TestClass = createTestClass({ autoControlledProps, defaultProps, state: {} })

      expect(renderTestClass(<TestClass foo='initial' />).getState()).toHaveProperty(
        'foo',
        'initial',
      )
    })

    it('defaults "checked" to false if not present', () => {
      consoleUtil.disableOnce()
      TestClass.autoControlledProps.push('checked')

      expect(renderTestClass(<TestClass />).getState()).toHaveProperty('checked', false)
    })

    it('defaults "value" to an empty string if not present', () => {
      consoleUtil.disableOnce()
      TestClass.autoControlledProps.push('value')

      expect(renderTestClass(<TestClass />).getState()).toHaveProperty('value', '')
    })

    it('defaults "value" to an empty array if "multiple"', () => {
      consoleUtil.disableOnce()
      TestClass.autoControlledProps.push('value')

      expect(renderTestClass(<TestClass multiple />).getState()).toHaveProperty('value', [])
    })
  })

  describe('default props', () => {
    it('are applied to state for props in autoControlledProps', () => {
      consoleUtil.disableOnce()

      const props = makeProps()
      const autoControlledProps = _.keys(props)
      const defaultProps = makeDefaultProps(props)

      TestClass = createTestClass({ autoControlledProps, state: {} })
      const view = renderTestClass(<TestClass {...defaultProps} />)

      _.each(props, (val, key) => expect(view.getState()).toHaveProperty(key, val))
    })

    it('are not applied to state for normal props', () => {
      const props = makeProps()
      const defaultProps = makeDefaultProps(props)

      const view = renderTestClass(<TestClass {...defaultProps} />)

      _.each(props, (val, key) => expect(view.getState()).not.toHaveProperty(key, val))
    })

    it('allows setState to work on non-default autoControlledProps', () => {
      consoleUtil.disableOnce()

      const props = makeProps()
      const autoControlledProps = _.keys(props)
      const defaultProps = makeDefaultProps(props)

      const randomProp = _.sample(autoControlledProps)
      const randomValue = faker.hacker.phrase()

      TestClass = createTestClass({ autoControlledProps, state: {} })
      const view = renderTestClass(<TestClass {...defaultProps} />)

      view.setState({ [randomProp]: randomValue })
      expect(view.getState()).toHaveProperty(randomProp, randomValue)
    })
  })

  describe('changing props', () => {
    it('sets state for props in autoControlledProps', () => {
      consoleUtil.disableOnce()

      const props = makeProps()
      const autoControlledProps = _.keys(props)

      const randomProp = _.sample(autoControlledProps)
      const randomValue = faker.hacker.phrase()

      TestClass = createTestClass({ autoControlledProps, state: {} })
      const view = renderTestClass(<TestClass {...props} />)

      view.rerenderWithProps({ [randomProp]: randomValue })

      expect(view.getState()).toHaveProperty(randomProp, randomValue)
    })

    it('does not set state for props not in autoControlledProps', () => {
      consoleUtil.disableOnce()
      const props = makeProps()

      const randomProp = _.sample(_.keys(props))
      const randomValue = faker.hacker.phrase()

      TestClass = createTestClass({ autoControlledProps: [], state: {} })
      const view = renderTestClass(<TestClass {...props} />)

      view.rerenderWithProps({ [randomProp]: randomValue })

      expect(view.getState()).not.toHaveProperty(randomProp, randomValue)
    })

    it('does not set state for default props when changed', () => {
      consoleUtil.disableOnce()

      const props = makeProps()
      const autoControlledProps = _.keys(props)
      const defaultProps = makeDefaultProps(props)

      const randomDefaultProp = _.sample(defaultProps)
      const randomValue = faker.hacker.phrase()

      TestClass = createTestClass({ autoControlledProps, state: {} })
      const view = renderTestClass(<TestClass {...defaultProps} />)

      view.rerenderWithProps({ [randomDefaultProp]: randomValue })

      expect(view.getState()).not.toHaveProperty(randomDefaultProp, randomValue)
    })

    it('does not return state to default props when setting props undefined', () => {
      consoleUtil.disableOnce()

      const autoControlledProps = ['foo']
      const defaultProps = { defaultFoo: 'default' }

      TestClass = createTestClass({ autoControlledProps, defaultProps, state: {} })
      const view = renderTestClass(<TestClass foo='initial' />)

      // default value
      expect(view.getState()).toHaveProperty('foo', 'initial')

      view.rerenderWithProps({ foo: undefined })

      expect(view.getState()).toHaveProperty('foo', 'initial')
    })

    it('does not set state for props passed as null by the parent', () => {
      consoleUtil.disableOnce()

      const props = makeProps()
      const autoControlledProps = _.keys(props)

      const randomProp = _.sample(autoControlledProps)

      TestClass = createTestClass({ autoControlledProps, state: {} })
      const view = renderTestClass(<TestClass {...props} />)

      view.rerenderWithProps({ [randomProp]: null })

      expect(view.getState()).toHaveProperty(randomProp, null)
    })
  })
})
