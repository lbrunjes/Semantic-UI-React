/* eslint-disable no-console */
/**
 * Why choose inheritance over a HOC?  Multiple advantages for this particular use case.
 * In short, we need identical functionality to setState(), unless there is a prop defined
 * for the state key.  Also:
 *
 * 1. Single Renders
 *    Calling setState() does not cause two renders. Consumers and tests do not have to wait two
 *    renders to get state.
 *    See www.react.run/4kJFdKoxb/27 for an example of this issue.
 *
 * 2. Simple Testing
 *    Using a HOC means you must either test the undecorated component or test through the decorator.
 *    Testing the undecorated component means you must mock the decorator functionality.
 *    Testing through the HOC means you can not simply shallow render your component.
 *
 * 3. Statics
 *    HOC wrap instances, so statics are no longer accessible. They can be hoisted, but this is more
 *    looping over properties and storing references.  We rely heavily on statics for testing and
 *    sub components.
 *
 * 4. Instance Methods
 *    Some instance methods may be exposed to users via refs.  Again, these are lost with HOC unless
 *    hoisted and exposed by the HOC.
 */
import * as React from 'react'
import { filter, intersection, isEmpty, keys, startsWith } from './utils'

const getDefaultPropName = (prop: string): string =>
  `default${prop[0].toUpperCase() + prop.slice(1)}`

/**
 * Return the auto controlled state value for a give prop. The initial value is chosen in this order:
 *  - regular props
 *  - then, default props
 *  - then, initial state
 *  - then, `checked` defaults to false
 *  - then, `value` defaults to '' or [] if props.multiple
 *  - else, undefined
 *
 *  @param {string} propName A prop name
 *  @param {object} [props] A props object
 *  @param {object} [state] A state object
 *  @param {boolean} [includeDefaults=false] Whether or not to heed the default props or initial state
 */
const getAutoControlledStateValue = (
  propName: string,
  props: Record<string, any>,
  state?: Record<string, any> | null,
  includeDefaults = false,
): any => {
  // regular props
  const propValue = props[propName]
  if (propValue !== undefined) return propValue

  if (includeDefaults) {
    // defaultProps
    const defaultProp = props[getDefaultPropName(propName)]
    if (defaultProp !== undefined) return defaultProp

    // initial state - state may be null or undefined
    if (state) {
      const initialState = state[propName]
      if (initialState !== undefined) return initialState
    }
  }

  // React doesn't allow changing from uncontrolled to controlled components,
  // default checked/value if they were not present.
  if (propName === 'checked') return false
  if (propName === 'value') return props.multiple ? [] : ''

  // otherwise, undefined
}

// Optional hook implemented by subclasses, declared via interface merging so that subclasses can
// define it as a regular method
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default interface ModernAutoControlledComponent<P = any, S = any> {
  getInitialAutoControlledState?(props: P): any
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export default class ModernAutoControlledComponent<P = any, S = any> extends React.Component<P, S> {
  constructor(...args: [props: P, context?: any]) {
    super(...args)

    const { autoControlledProps, getAutoControlledStateFromProps } = this.constructor as any
    const state = this?.getInitialAutoControlledState?.(this.props) || {}

    if (process.env.NODE_ENV !== 'production') {
      const { defaultProps, name, getDerivedStateFromProps } = this.constructor as any

      // require usage of getAutoControlledStateFromProps()
      if (getDerivedStateFromProps !== ModernAutoControlledComponent.getDerivedStateFromProps) {
        console.error(
          `Auto controlled ${name} must specify a static getAutoControlledStateFromProps() instead of getDerivedStateFromProps().`,
        )
      }

      // prevent autoControlledProps in defaultProps
      //
      // When setting state, auto controlled props values always win (so the parent can manage them).
      // It is not reasonable to decipher the difference between props from the parent and defaultProps.
      // Allowing defaultProps results in trySetState always deferring to the defaultProp value.
      // Auto controlled props also listed in defaultProps can never be updated.
      //
      // To set defaults for an AutoControlled prop, you can set the initial state in the
      // constructor or by using an ES7 property initializer:
      // https://babeljs.io/blog/2015/06/07/react-on-es6-plus#property-initializers
      const illegalDefaults = intersection(autoControlledProps, keys(defaultProps))
      if (!isEmpty(illegalDefaults)) {
        console.error(
          [
            'Do not set defaultProps for autoControlledProps. You can set defaults by',
            'setting state in the constructor or using an ES7 property initializer',
            '(https://babeljs.io/blog/2015/06/07/react-on-es6-plus#property-initializers)',
            `See ${name} props: "${illegalDefaults}".`,
          ].join(' '),
        )
      }

      // prevent listing defaultProps in autoControlledProps
      //
      // Default props are automatically handled.
      // Listing defaults in autoControlledProps would result in allowing defaultDefaultValue props.
      const illegalAutoControlled = filter(autoControlledProps, (prop: string) =>
        startsWith(prop, 'default'),
      )
      if (!isEmpty(illegalAutoControlled)) {
        console.error(
          [
            'Do not add default props to autoControlledProps.',
            'Default props are automatically handled.',
            `See ${name} autoControlledProps: "${illegalAutoControlled}".`,
          ].join(' '),
        )
      }
    }

    // Auto controlled props are copied to state.
    // Set initial state by copying auto controlled props to state.
    // Also look for the default prop for any auto controlled props (foo => defaultFoo)
    // so we can set initial values from defaults.
    const props: Record<string, any> = this.props
    const initialAutoControlledState = autoControlledProps.reduce(
      (acc: Record<string, any>, prop: string) => {
        acc[prop] = getAutoControlledStateValue(prop, props, state, true)

        if (process.env.NODE_ENV !== 'production') {
          const defaultPropName = getDefaultPropName(prop)
          const { name } = this.constructor as any
          // prevent defaultFoo={} along side foo={}
          if (props[defaultPropName] !== undefined && props[prop] !== undefined) {
            console.error(
              `${name} prop "${prop}" is auto controlled. Specify either ${defaultPropName} or ${prop}, but not both.`,
            )
          }
        }

        return acc
      },
      {},
    )

    this.state = {
      ...state,
      ...initialAutoControlledState,
      autoControlledProps,
      getAutoControlledStateFromProps,
    }
  }

  static getDerivedStateFromProps(props: Record<string, any>, state: any) {
    const { autoControlledProps, getAutoControlledStateFromProps } = state

    // Solve the next state for autoControlledProps
    const newStateFromProps = autoControlledProps.reduce(
      (acc: Record<string, any>, prop: string) => {
        const isNextDefined = props[prop] !== undefined

        // if next is defined then use its value
        if (isNextDefined) acc[prop] = props[prop]

        return acc
      },
      {},
    )

    // Due to the inheritance of the AutoControlledComponent we should call its
    // getAutoControlledStateFromProps() and merge it with the existing state
    if (getAutoControlledStateFromProps) {
      const computedState = getAutoControlledStateFromProps(
        props,
        {
          ...state,
          ...newStateFromProps,
        },
        state,
      )

      // We should follow the idea of getDerivedStateFromProps() and return only modified state
      return { ...newStateFromProps, ...computedState }
    }

    return newStateFromProps
  }

  /**
   * Override this method to use getDerivedStateFromProps() in child components.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getAutoControlledStateFromProps(...args: any[]): any {
    return null
  }
}
