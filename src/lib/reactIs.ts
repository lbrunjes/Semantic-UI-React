import * as React from 'react'

// Heads up!
// These replace "react-is": its element checks depend on its own version matching React's version
// (React 19 changed the symbol of elements), while symbols of types used below are stable.

const FORWARD_REF_TYPE = Symbol.for('react.forward_ref')

const ELEMENT_TYPE_SYMBOLS = [
  Symbol.for('react.fragment'),
  Symbol.for('react.profiler'),
  Symbol.for('react.strict_mode'),
  Symbol.for('react.suspense'),
  Symbol.for('react.suspense_list'),
]

const OBJECT_TYPE_SYMBOLS = [
  FORWARD_REF_TYPE,
  Symbol.for('react.memo'),
  Symbol.for('react.lazy'),
  Symbol.for('react.context'),
  // React <= 18
  Symbol.for('react.provider'),
  // React >= 19
  Symbol.for('react.consumer'),
  Symbol.for('react.client.reference'),
]

/**
 * Checks that a value can be used as an element type, i.e. `React.createElement(type)`.
 *
 * @param {*} type
 * @returns {boolean}
 */
export const isValidElementType = (type: any): boolean => {
  if (typeof type === 'string' || typeof type === 'function') return true
  if (ELEMENT_TYPE_SYMBOLS.includes(type)) return true

  return (
    typeof type === 'object' &&
    type !== null &&
    (OBJECT_TYPE_SYMBOLS.includes(type.$$typeof) || type.getModuleId !== undefined)
  )
}

/**
 * Checks that a value is an element of a component created with `React.forwardRef()`.
 *
 * @param {*} element
 * @returns {boolean}
 */
export const isForwardRef = (element: unknown): boolean =>
  React.isValidElement(element) &&
  typeof element.type === 'object' &&
  element.type !== null &&
  (element.type as any).$$typeof === FORWARD_REF_TYPE

/**
 * Checks that a value is a `React.Fragment` element.
 *
 * @param {*} element
 * @returns {boolean}
 */
export const isFragment = (element: unknown): boolean =>
  React.isValidElement(element) && element.type === React.Fragment

/**
 * Returns the ref of an element. React 19 made "ref" a regular prop and warns when "element.ref"
 * is accessed, while React <= 18 warns when "element.props.ref" is accessed.
 *
 * @param {React.ReactElement} element
 * @returns {React.Ref|undefined}
 */
export const getElementRef = (element: unknown): React.Ref<any> | undefined => {
  if (!React.isValidElement(element)) return undefined

  // React <= 18 in development: "props.ref" is a warning getter
  const propsRefGetter = Object.getOwnPropertyDescriptor(element.props, 'ref')?.get
  if (propsRefGetter && (propsRefGetter as any).isReactWarning) return (element as any).ref

  // React >= 19 in development: "element.ref" is a warning getter
  const elementRefGetter = Object.getOwnPropertyDescriptor(element, 'ref')?.get
  if (elementRefGetter && (elementRefGetter as any).isReactWarning)
    return (element.props as any).ref

  // Production builds have no warning getters
  return (element.props as any).ref || (element as any).ref
}
