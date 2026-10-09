import * as React from 'react'

import cx from './cx'
import { isValidElementType } from './reactIs'
import { isBoolean, isNumber, isPlainObject, isString, uniq } from './utils'

const DEPRECATED_CALLS: Record<string, boolean> = {}

/** Maps a primitive shorthand value (string, number, array) to the props of a component. */
export type ShorthandValueToProps = (val: any) => Record<string, any>

export interface ShorthandOptions {
  /** Default props object. */
  defaultProps?: Record<string, any>

  /** Override props object or function (called with regular props). */
  overrideProps?: Record<string, any> | ((props: Record<string, any>) => Record<string, any>)

  /** Whether or not automatic key generation is allowed. */
  autoGenerateKey?: boolean

  /** Heads up! Ignored, some callers pass it: a key should be passed via `defaultProps`. */
  key?: React.Key
}

// ============================================================
// Factories
// ============================================================

/**
 * A more robust React.createElement. It can create elements from primitive values.
 *
 * @param {function|string} Component A ReactClass or string
 * @param {function} mapValueToProps A function that maps a primitive value to the Component props
 * @param {string|object|function} val The value to create a ReactElement from
 * @param {Object} [options={}]
 * @param {object} [options.defaultProps={}] Default props object
 * @param {object|function} [options.overrideProps={}] Override props object or function (called with regular props)
 * @param {boolean} [options.autoGenerateKey=true] Whether or not automatic key generation is allowed
 * @returns {object|null}
 */
export function createShorthand(
  Component: any,
  mapValueToProps: ShorthandValueToProps | null,
  val: any,
  options: ShorthandOptions = {},
) {
  if (!isValidElementType(Component)) {
    throw new Error('createShorthand(): Component should be a valid element type.')
  }

  // short circuit noop values
  if (val == null || isBoolean(val)) {
    return null
  }

  const valIsString = isString(val)
  const valIsNumber = isNumber(val)
  const valIsFunction = typeof val === 'function'
  const valIsReactElement = React.isValidElement(val)
  const valIsPropsObject = isPlainObject(val)
  const valIsPrimitiveValue = valIsString || valIsNumber || Array.isArray(val)

  // unhandled type return null
  /* eslint-disable no-console */
  if (!valIsFunction && !valIsReactElement && !valIsPropsObject && !valIsPrimitiveValue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        [
          'Shorthand value must be a string|number|array|object|ReactElement|function.',
          ' Use null|undefined|boolean for none',
          ` Received ${typeof val}.`,
        ].join(''),
      )
    }
    return null
  }
  /* eslint-enable no-console */

  // ----------------------------------------
  // Build up props
  // ----------------------------------------
  const { defaultProps = {} } = options

  // User's props
  const usersProps =
    (valIsReactElement && val.props) ||
    (valIsPropsObject && val) ||
    // TODO(bug): throws for primitive values if "mapValueToProps" is null (i.e. AccordionPanel)
    (valIsPrimitiveValue && mapValueToProps!(val))

  // Override props
  const { overrideProps: overridePropsOption = {} } = options
  const overrideProps =
    typeof overridePropsOption === 'function'
      ? overridePropsOption({ ...defaultProps, ...usersProps })
      : overridePropsOption

  // Merge props

  const props = { ...defaultProps, ...usersProps, ...overrideProps }

  // Merge className
  if (defaultProps.className || overrideProps.className || usersProps.className) {
    const mergedClassesNames = cx(
      defaultProps.className,
      overrideProps.className,
      usersProps.className,
    )
    props.className = uniq(mergedClassesNames.split(' ')).join(' ')
  }

  // Merge style
  if (defaultProps.style || overrideProps.style || usersProps.style) {
    props.style = { ...defaultProps.style, ...usersProps.style, ...overrideProps.style }
  }

  // ----------------------------------------
  // Get key
  // ----------------------------------------

  // Use key, childKey, or generate key
  if (props.key == null) {
    const { childKey } = props
    const { autoGenerateKey = true } = options

    if (childKey != null) {
      // apply and consume the childKey
      props.key = typeof childKey === 'function' ? childKey(props) : childKey
      delete props.childKey
    } else if (autoGenerateKey && (valIsString || valIsNumber)) {
      // use string/number shorthand values as the key
      props.key = val
    }
  }

  // ----------------------------------------
  // Create Element
  // ----------------------------------------

  // Clone ReactElements
  if (valIsReactElement) {
    return React.cloneElement(val, props)
  }

  if (typeof props.children === 'function') {
    return props.children(Component, { ...props, children: undefined })
  }

  // Create ReactElements from built up props
  if (valIsPrimitiveValue || valIsPropsObject) {
    return React.createElement(Component, props)
  }

  // Call functions with args similar to createElement()
  // TODO: V3 remove the implementation
  if (valIsFunction) {
    if (process.env.NODE_ENV !== 'production') {
      if (!DEPRECATED_CALLS[Component]) {
        DEPRECATED_CALLS[Component] = true

        // eslint-disable-next-line no-console
        console.warn(
          `Warning: There is a deprecated shorthand function usage for "${Component}". It is deprecated and will be removed in v3 release. Please follow our upgrade guide: https://github.com/Semantic-Org/Semantic-UI-React/pull/4029`,
        )
      }
    }

    return val(Component, props, props.children)
  }
}

// ============================================================
// Factory Creators
// ============================================================

/**
 * Creates a `createShorthand` function that is waiting for a value and options.
 *
 * @param {function|string} Component A ReactClass or string
 * @param {function} mapValueToProps A function that maps a primitive value to the Component props
 * @returns {function} A shorthand factory function waiting for `val` and `defaultProps`.
 */
export function createShorthandFactory(
  Component: any,
  mapValueToProps: ShorthandValueToProps | null,
) {
  if (!isValidElementType(Component)) {
    throw new Error('createShorthandFactory(): Component should be a valid element type.')
  }

  return (val: any, options?: ShorthandOptions) =>
    createShorthand(Component, mapValueToProps, val, options)
}

// ============================================================
// HTML Factories
// ============================================================
export const createHTMLDivision = /* #__PURE__ */ createShorthandFactory('div', (val: unknown) => ({
  children: val,
}))
export const createHTMLIframe = /* #__PURE__ */ createShorthandFactory(
  'iframe',
  (src: unknown) => ({ src }),
)
export const createHTMLImage = /* #__PURE__ */ createShorthandFactory('img', (val: unknown) => ({
  src: val,
}))
export const createHTMLInput = /* #__PURE__ */ createShorthandFactory('input', (val: unknown) => ({
  type: val,
}))
export const createHTMLLabel = /* #__PURE__ */ createShorthandFactory('label', (val: unknown) => ({
  children: val,
}))
export const createHTMLParagraph = /* #__PURE__ */ createShorthandFactory('p', (val: unknown) => ({
  children: val,
}))
